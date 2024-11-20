export type Env = {
  GOOGLE_AI_API_KEY: string;
};

const envKey = "";

export function validateEnvironment(env: Env): void {
  if (!envKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  env.GOOGLE_AI_API_KEY = envKey;
}
