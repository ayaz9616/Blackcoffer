import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Entry from '@/lib/models/Entry';

export async function GET() {
  await dbConnect();
  const [topics, end_years, sectors, regions, countries, cities, pestles, sources, swots] = await Promise.all([
    Entry.distinct('topic'),
    Entry.distinct('end_year'),
    Entry.distinct('sector'),
    Entry.distinct('region'),
    Entry.distinct('country'),
    Entry.distinct('city'),
    Entry.distinct('pestle'),
    Entry.distinct('source'),
    Entry.distinct('swot'),
  ]);
  return NextResponse.json({ topic: topics, end_year: end_years, sector: sectors, region: regions, country: countries, city: cities, pestle: pestles, source: sources, swot: swots });
} 