import { createClient } from '@/lib/supabase/server';

const GOOGLE_SHEETS_API_URL = process.env.GOOGLE_SHEETS_API_URL;

interface SheetData {
  sheet: string;
  headers: string[];
  rows: any[][];
}

export class GoogleSheetsService {
  static async syncToSheets(data: SheetData): Promise<boolean> {
    try {
      if (!GOOGLE_SHEETS_API_URL) {
        console.warn('Google Sheets API URL not configured');
        return false;
      }

      const response = await fetch(GOOGLE_SHEETS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to sync to Google Sheets');
      }

      return true;
    } catch (error) {
      console.error('Google Sheets sync error:', error);
      return false;
    }
  }

  static async syncDashboard(): Promise<boolean> {
    const supabase = await createClient();

    try {
      const { data: stats } = await supabase
        .from('assets')
        .select('status')
        .eq('status', 'ready_stock');

      const data: SheetData = {
        sheet: 'Dashboard',
        headers: ['Metric', 'Value', 'Timestamp'],
        rows: [
          ['Ready Stock', (stats || []).length.toString(), new Date().toISOString()],
        ],
      };

      return await this.syncToSheets(data);
    } catch (error) {
      console.error('Dashboard sync error:', error);
      return false;
    }
  }

  static async syncWorkOrders(): Promise<boolean> {
    const supabase = await createClient();

    try {
      const { data: workOrders } = await supabase
        .from('work_orders')
        .select('wo_number, merchant_id, status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      const data: SheetData = {
        sheet: 'Work Orders',
        headers: ['WO Number', 'Merchant ID', 'Status', 'Created At'],
        rows: (workOrders || []).map(wo => [
          wo.wo_number,
          wo.merchant_id,
          wo.status,
          wo.created_at,
        ]),
      };

      return await this.syncToSheets(data);
    } catch (error) {
      console.error('Work Orders sync error:', error);
      return false;
    }
  }

  static async syncAssets(): Promise<boolean> {
    const supabase = await createClient();

    try {
      const { data: assets } = await supabase
        .from('assets')
        .select('asset_id, asset_type, brand, model, serial_number, status, condition')
        .order('created_at', { ascending: false })
        .limit(100);

      const data: SheetData = {
        sheet: 'Assets',
        headers: ['Asset ID', 'Type', 'Brand', 'Model', 'Serial Number', 'Status', 'Condition'],
        rows: (assets || []).map(asset => [
          asset.asset_id,
          asset.asset_type,
          asset.brand,
          asset.model,
          asset.serial_number,
          asset.status,
          asset.condition,
        ]),
      };

      return await this.syncToSheets(data);
    } catch (error) {
      console.error('Assets sync error:', error);
      return false;
    }
  }
}