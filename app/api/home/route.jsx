import { NextResponse } from "next/server";

export async function GET() {
    const obj =
    {
        name: "Saqb",
        age: 20
    };
    return NextResponse.json(obj);

}