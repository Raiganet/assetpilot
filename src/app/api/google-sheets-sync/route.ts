import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/services/google-sheets.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { syncType } = body;

    let success = false;

    switch (syncType) {
      case 'dashboard':
        success = await GoogleSheetsService.syncDashboard();
        break;
      case 'work_orders':
        success = await GoogleSheetsService.syncWorkOrders();
        break;
      case 'assets':
        success = await GoogleSheetsService.syncAssets();
        break;
      default:
        return NextResponse.json({ error: 'Invalid sync type' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ message: 'Sync successful' });
    } else {
      return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}