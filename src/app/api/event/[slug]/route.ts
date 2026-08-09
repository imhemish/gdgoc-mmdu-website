import type { NextRequest } from "next/server";
import { getGDGEvent } from "@/lib/event";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await params;

  if (!slug) {
    return Response.json(
      { error: "Missing event slug" },
      { status: 400 }
    );
  }

  const event = await getGDGEvent(slug);

  if (!event) {
    return Response.json(
      { error: "Event not found or GDG API failed" },
      { status: 404 }
    );
  }

  return Response.json(event);
}