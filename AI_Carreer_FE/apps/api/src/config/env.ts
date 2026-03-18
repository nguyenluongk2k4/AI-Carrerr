export interface EnvConfig {
  nodeEnv: "development" | "test" | "production";
}

export const env: EnvConfig = {
  nodeEnv: (process.env.NODE_ENV as EnvConfig["nodeEnv"]) || "development",
};
