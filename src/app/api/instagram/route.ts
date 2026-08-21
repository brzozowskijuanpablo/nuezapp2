import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

const FALLBACK_IMAGES = [
  "/instagram/insta_0.jpg",
  "/instagram/insta_1.jpg",
  "/instagram/insta_2.jpg",
  "/instagram/insta_3.jpg",
  "/instagram/insta_4.jpg"
];

export async function GET() {
  try {
    const res = await fetch('https://imginn.com/nuezapprio/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from imginn: ${res.status}`);
    }

    const html = await res.text();
    
    // Extract image URLs using regex
    const imgRegex = /<img\s+loading="lazy"\s+src="([^"]+)"/g;
    const matches = [...html.matchAll(imgRegex)];
    
    const imageUrls = matches.map(match => match[1]).slice(0, 5);

    if (imageUrls.length === 0) {
      throw new Error("No images found in the HTML");
    }

    // Return the fresh images, and cache them on the CDN
    return NextResponse.json(imageUrls, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch (error) {
    console.error("Instagram fetch error:", error);
    // Return the fallback static images so the UI never breaks
    return NextResponse.json(FALLBACK_IMAGES, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      }
    });
  }
}
