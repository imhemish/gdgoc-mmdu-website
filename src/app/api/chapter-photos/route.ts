// app/api/chapter-photos/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const chapterId = process.env.CHAPTER_ID;
  
  try {
    // Fetch chapter photos from Bevy's internal API
    const response = await fetch(
      `https://gdg.community.dev/api/chapter/${chapterId}/photos`,
      {
        next: {
          revalidate: 60*60*24*30, // Cache for 30 days
          tags: [`chapter-${chapterId}`],
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Origin': 'https://gdg.community.dev',
          'Referer': 'https://gdg.community.dev/',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Bevy API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chapter photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter photos' },
      { status: 500 }
    );
  }
}