type Backend = "java" | "python";

const BACKEND = (process.env.API_BACKEND || "java").toLowerCase() as Backend;

export function getBaseUrl() {
  if (BACKEND === "python") {
    if (!process.env.PYTHON_API_BASE) throw new Error("PYTHON_API_BASE not set");
    return process.env.PYTHON_API_BASE;
  }

  if (!process.env.JAVA_API_BASE) throw new Error("JAVA_API_BASE not set");
  return process.env.JAVA_API_BASE;
}
