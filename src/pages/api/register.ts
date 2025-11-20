// src/pages/api/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { apiServer } from "@/pages/api/util/apiserver";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end(); 
    }

    try {
        const data = await apiServer.post("/api/register", {
            headers: req.headers as any,
            body: req.body,
        });

        console.log("Register proxy result via apiServer:", data);

        res.status(200).json(data);
    } catch (error: any) {
        console.error("Error in register proxy:", error);
        res.status(500).json({
            detail: error?.message || "Internal server error",
        });
    }
}
