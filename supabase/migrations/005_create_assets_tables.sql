-- Create enum for asset types
CREATE TYPE asset_type AS ENUM (
  'edc',
  'sim_card',
  'sam_card',
  'battery',
  'adapter',
  'printer',
  'scanner',
  'other_device'
);

-- Create enum for asset status
CREATE TYPE asset_status AS ENUM (
  'ready_stock',
  'deployed',
  'on_technician',
  'in_transit',
  'in_qc',
  'in_repair',
  'scrap',
  'lost',
  'returned'
);

-- Create enum for asset condition
CREATE TYPE asset_condition AS ENUM (
  'good',
  'minor_damage',
  'major_damage',
  'broken',
  'repair_required',
  'scrap'
);

-- Create assets table
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id TEXT UNIQUE NOT NULL,
  asset_type asset_type NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  barcode TEXT UNIQUE,
  qr_code TEXT UNIQUE,
  status asset_status NOT NULL DEFAULT 'ready_stock',
  condition asset_condition DEFAULT 'good',
  current_holder_id UUID REFERENCES public.profiles(id),
  current_holder_type TEXT CHECK (current_holder_type IN ('merchant', 'technician', 'warehouse')),
  warehouse_id UUID REFERENCES public.warehouses(id),
  merchant_id UUID REFERENCES public.merchants(id),
  purchase_date DATE,
  purchase_cost DECIMAL(12, 2),
  warranty_expiry DATE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for assets updated_at
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_assets_asset_id ON public.assets(asset_id);
CREATE INDEX idx_assets_serial_number ON public.assets(serial_number);
CREATE INDEX idx_assets_barcode ON public.assets(barcode);
CREATE INDEX idx_assets_qr_code ON public.assets(qr_code);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_assets_condition ON public.assets(condition);
CREATE INDEX idx_assets_warehouse_id ON public.assets(warehouse_id);
CREATE INDEX idx_assets_merchant_id ON public.assets(merchant_id);
CREATE INDEX idx_assets_current_holder_id ON public.assets(current_holder_id);