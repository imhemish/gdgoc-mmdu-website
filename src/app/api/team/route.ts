import { NextResponse } from "next/server";
import { getTeamMembers } from "@/lib/getTeamMembers";
import type { TeamApiResponse } from "@/types/team";

export async function GET(): Promise<NextResponse<TeamApiResponse>> {
  const members = await getTeamMembers();
  return NextResponse.json({ members } satisfies TeamApiResponse);
}