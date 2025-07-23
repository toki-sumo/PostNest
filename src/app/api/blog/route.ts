import { supabase } from "@/utils/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiRequest) {
    const { data, error } = await supabase.from("posts").select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 })
    // return NextResponse.json({ message: "Articles fetched successfully", data }, { status: 200 });
}

export async function POST(req: Request) {
    const { id, title, content } = await req.json();

    if (!id || !title || !content) {
        return NextResponse.json({ error: "ID, title, and content are required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("posts")
        .insert([{ id, title, content, createdAt: new Date().toISOString() }]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}