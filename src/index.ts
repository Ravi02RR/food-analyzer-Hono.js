import { Hono } from "hono";
import { cors } from "hono/cors";
import { validateEnvironment, Env } from "./envValidator";
import { handleMultipartForm } from "./imageHandler";
import { analyzeFoodImage } from "./foodAnalyzer";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  })
);

app.use("*", async (c, next) => {
  try {
    validateEnvironment(c.env);
    await next();
  } catch (error) {
    //@ts-ignore
    console.error("Environment configuration error:", error);
    return c.json(
      {
        error: "Server configuration error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

app.post("/", async (c) => {
  try {
    const contentType = c.req.header("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return c.json({ error: "Content-Type must be multipart/form-data" }, 400);
    }

    const formData = await c.req.formData();
    const { base64: imageBase64, mimeType } = await handleMultipartForm(
      formData
    );
    //@ts-ignore
    console.log("API Key hai ");

    const analysis = await analyzeFoodImage(imageBase64, mimeType, "");

    return c.json(analysis);
  } catch (error) {
    //@ts-ignore
    console.error("Error processing request:", error);

    return c.json(
      {
        error: "Failed to analyze food image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export default app;
