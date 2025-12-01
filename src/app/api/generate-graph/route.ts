import { NextResponse } from 'next/server';
import { generateGraph } from '@/lib/graphGenerator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const nodeCount = parseInt(searchParams.get('nodes') || '15');
  const width = parseInt(searchParams.get('width') || '800');
  const height = parseInt(searchParams.get('height') || '600');
  const connectionRadius = parseInt(searchParams.get('radius') || '200');

  try {
    const graph = generateGraph(nodeCount, width, height, connectionRadius);
    return NextResponse.json(graph);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate graph' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nodeCount = 15,
      width = 800,
      height = 600,
      connectionRadius = 200,
    } = body;

    const graph = generateGraph(nodeCount, width, height, connectionRadius);
    return NextResponse.json(graph);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate graph' },
      { status: 500 }
    );
  }
}
