import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiRateLimiter } from "../../../lib/rateLimiter";

// Set max execution time to 30 seconds for the serverless handler
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Production Hygiene: Extract IP and run Rate Limiter
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { allowed, retryAfterSec } = apiRateLimiter.limit(ip);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: `Too many requests. Rate limit exceeded. Try again in ${retryAfterSec}s.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfterSec.toString(),
          },
        }
      );
    }

    // 2. Production Hygiene: Validate and cap input length
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Malformed JSON payload." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Prompt message is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (message.length > 800) {
      return new Response(
        JSON.stringify({
          error: "Prompt length exceeds safety threshold (max 800 characters).",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Environment check: handle fallback if API key is missing
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const demoResponse = 
        `[AETHER SYSTEM CORE: DEMO MODE]\n\n` +
        `API Key (GEMINI_API_KEY) is not set in the server environment.\n\n` +
        `I am simulating AETHER AI responses to demonstrate the streaming output engine. ` +
        `This terminal features full sliding-window IP rate limiting (current IP: ${ip}) and an input cap of 800 characters. ` +
        `The background is a custom GLSL fragment shader simulating quantum space coordinates in real-time, ` +
        `listening to mouse vector attractions.\n\n` +
        `To activate real AI streaming, please configure GEMINI_API_KEY in your deployment environment.`;

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const chunks = demoResponse.split(/(?<=\s)/); // Split keeping spaces
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 35)); // Simulated typing speed
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // 4. Initialize Gemini AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-2.5-flash for high performance and low streaming latency
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: 
        "You are AETHER Core AI, the neural central intelligence of AETHER OS. " +
        "Answer queries in a concise, technical, and slightly futuristic tone. " +
        "Keep your output structure clean, listing parameters where helpful. " +
        "Limit response to 2-3 paragraphs max, fitting a terminal display.",
    });

    // 5. Generate and stream the content
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (streamErr) {
          console.error("Gemini stream error:", streamErr);
          controller.enqueue(
            encoder.encode("\n\n[AETHER SYSTEM ERROR: STREAM FAILED]")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API Chat handler crash:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error occurred during prompt processing." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
