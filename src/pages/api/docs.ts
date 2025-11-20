import { apiServer } from "@/pages/api/util/apiserver";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const data = await apiServer.get("/api/docs", {
      headers: req.headers as any,
    });

    console.log("Docs proxy result from apiServer:", data);

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error in docs proxy:", error);
    res.status(500).json({
      detail: error?.message || "Internal server error",
    });
  }
}
