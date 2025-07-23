import { supabase } from "@/utils/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiRequest) {

    const id = req.url.split('/').pop(); // Extract the ID from the URL
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return NextResponse.json(data, { status: 500 });
    }
    if (!data) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 })
}

export async function DELETE(req: Request) {
    const id = req.url.split('/').pop(); // Extract the ID from the URL

    console.log("Deleting article with ID:", id);
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error: deletError } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

    if (deletError) {
        return NextResponse.json({ deletError }, { status: 500 });
    }

    return NextResponse.json({ status: 200 });
}