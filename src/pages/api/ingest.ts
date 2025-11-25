import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import { apiServer } from "@/pages/api/util/apiserver";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.error("method is not POST");
    return res.status(405).end();
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable parse error:", err);
      return res.status(500).send("Error parsing form data");
    }

    const uploadedFile: any = (files as any).file?.[0] || (files as any).file;
    if (!uploadedFile || !uploadedFile.filepath) {
      console.error("file not found");
      return res.status(400).send("file required");
    }

    try {
      console.log("📥 File received:", uploadedFile.originalFilename);

      const fileBuffer = await fs.readFile(uploadedFile.filepath);

      const fd = new FormData();
      // @ts-ignore Node 18+ has Blob in global scope
      fd.set("file", new Blob([fileBuffer]), uploadedFile.originalFilename);

      const cookieHeader = req.headers.cookie || "";

      const data = await apiServer.post("/api/ingest", {
        headers: req.headers as any,
        body: fd,
      });

      console.log("✅ Upload forwarded to backend via apiServer:", data);

      res.status(200).json(data);
    } catch (e: any) {
      console.error("Upstream upload failed via apiServer helper:", e);
      res
        .status(500)
        .send(e?.message || "Internal Server Error during file upload");
    }
  });
}
