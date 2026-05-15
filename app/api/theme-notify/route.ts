import { NextRequest, NextResponse } from 'next/server';
import { notifyThemeUpdated } from '@/lib/firebase-admin';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { customerId?: string };

    if (!body.customerId || typeof body.customerId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'customerId is required' },
        { status: 400 }
      );
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(body.customerId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid customerId format' },
        { status: 400 }
      );
    }

    await notifyThemeUpdated(body.customerId);

    return NextResponse.json(
      { success: true, message: 'Theme notification sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[theme-notify route] Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}
