// src/pages/api/query.ts
import { apiServer } from "@/pages/api/util/apiserver";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.error("method is not POST");
    return res.status(405).end();
  }

  try {
    const data = await apiServer.post("/api/query", {
      headers: req.headers as any,
      body: req.body,
    });

    console.log("Query proxy result via apiServer:", data);

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error in query proxy via apiServer:", error);
    res.status(500).json({
      detail: error?.message || "Internal server error",
    });
  }
}
