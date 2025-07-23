// pages/api/create.ts

import { supabase } from "@/utils/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { id, title, content, createdAt } = req.body;

    const { data, error } = await supabase
        .from("posts")
        .insert([{ id, title, content, createdAt: new Date().toISOString() }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data === null) {
        return res.status(400).json({ error: "Failed to create article" });
    }

    return res.status(200).json(data);
}
