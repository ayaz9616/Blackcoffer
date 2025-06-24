import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Entry from '@/lib/models/Entry';

function parseFilters(searchParams: URLSearchParams) {
  const filters: any = {};
  ['end_year', 'topic', 'sector', 'region', 'country', 'city', 'pestle', 'source'].forEach((key) => {
    const value = searchParams.getAll(key);
    if (value.length > 0) filters[key] = { $in: value };
  });
  return filters;
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const filters = parseFilters(req.nextUrl.searchParams);
  const entries = await Entry.find(filters);
  const total = entries.length;
  const avgIntensity = total ? entries.reduce((a, b) => a + (b.intensity || 0), 0) / total : 0;
  const avgRelevance = total ? entries.reduce((a, b) => a + (b.relevance || 0), 0) / total : 0;
  const avgLikelihood = total ? entries.reduce((a, b) => a + (b.likelihood || 0), 0) / total : 0;
  const activeTopics = new Set(entries.map(e => e.topic).filter(Boolean)).size;
  return NextResponse.json({ total, avgIntensity, avgRelevance, avgLikelihood, activeTopics });
} 