import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    const id = req.url.split('/').pop(); // Extract the ID from the URL

    try {
        const { title, content } = await req.json();

        const { error } = await supabase
            .from("posts")
            .update({ title, content })
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Article updated successfully" }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
