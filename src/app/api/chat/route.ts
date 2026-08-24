import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiRateLimiter } from "../../../lib/rateLimiter";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
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

    // 2. Validate input
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

    // 3. Fallback demo mode if API key is not configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const demoResponse = 
        `[AETHER SYSTEM CORE: DEMO MODE]\n\n` +
        `API Key (GEMINI_API_KEY) is not set in the server environment.\n\n` +
        `I am simulating AETHER AI responses to demonstrate the streaming output engine. ` +
        `This terminal features full sliding-window IP rate limiting (current IP: ${ip}) and an input cap of 800 characters. ` +
        `The background is a custom GLSL fragment shader simulating quantum space coordinates in real-time.\n\n` +
        `To activate live Gemini AI streaming, please add GEMINI_API_KEY to your .env.local file.`;

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const chunks = demoResponse.split(/(?<=\s)/);
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 30));
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

    // 4. Initialize Gemini SDK with model candidates
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const candidates = [
      "gemini-1.5-flash",
      "gemini-3",
      "gemini-2.5-flash",
      
    ];

    const encoder = new TextEncoder();
    let lastError: unknown;

    for (const modelName of candidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: 
            "You are AETHER Core AI, the neural central intelligence of AETHER OS. " +
            "Answer queries in a concise, technical, and slightly futuristic tone. " +
            "Keep your output structure clean, listing parameters where helpful. " +
            "Limit response to 2-3 paragraphs max, fitting a terminal display.",
        });

        const res = await model.generateContentStream({
          contents: [{ role: "user", parts: [{ text: message }] }],
        });

        const iterator = res.stream[Symbol.asyncIterator]();
        const first = await iterator.next();

        if (!first.done && first.value) {
          const firstChunkText = first.value.text();

          const readableStream = new ReadableStream({
            async start(controller) {
              try {
                if (firstChunkText) {
                  controller.enqueue(encoder.encode(firstChunkText));
                }
                while (true) {
                  const { done, value } = await iterator.next();
                  if (done) break;
                  const text = value.text();
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                }
              } catch (streamErr) {
                console.error("Stream chunk error:", streamErr);
              } finally {
                controller.close();
              }
            },
          });

          return new Response(readableStream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Transfer-Encoding": "chunked",
            },
          });
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model ${modelName} failed, attempting next candidate:`, err);
      }
    }

    const errMessage = lastError instanceof Error ? lastError.message : "All Gemini model candidates failed to respond.";
    return new Response(
      JSON.stringify({ error: errMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("API Chat handler crash:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error occurred during prompt processing.";
    return new Response(
      JSON.stringify({ error: errMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
