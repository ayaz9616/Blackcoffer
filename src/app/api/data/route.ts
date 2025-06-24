import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Entry from '@/lib/models/Entry';
import path from 'path';
import { promises as fs } from 'fs';

function parseFilters(searchParams: URLSearchParams) {
  const filters: any = {};
  ['end_year', 'topic', 'sector', 'region', 'country', 'city', 'pestle', 'source'].forEach((key) => {
    const value = searchParams.getAll(key);
    if (value.length > 0) filters[key] = { $in: value };
  });
  return filters;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const filters = parseFilters(req.nextUrl.searchParams);
    const entries = await Entry.find(filters);
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const filePath = path.join(process.cwd(), 'public', 'jsondata.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContents);
  await Entry.deleteMany({});
  const result = await Entry.insertMany(data);
  return NextResponse.json({ inserted: result.length });
} 