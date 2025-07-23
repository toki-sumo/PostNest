import { supabase } from "@/utils/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: "Article not found" });

        return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ message: "Article deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
