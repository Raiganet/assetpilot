-- Create withdrawals table
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  withdrawal_number TEXT UNIQUE NOT NULL,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id),
  technician_id UUID NOT NULL REFERENCES public.technicians(id),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  sim_card_id UUID REFERENCES public.assets(id),
  edc_barcode TEXT NOT NULL,
  sim_barcode TEXT,
  photo_front_url TEXT,
  photo_back_url TEXT,
  photo_serial_url TEXT,
  photo_merchant_url TEXT,
  gps_latitude DECIMAL(10, 8) NOT NULL,
  gps_longitude DECIMAL(11, 8) NOT NULL,
  gps_address TEXT,
  google_maps_link TEXT,
  merchant_signature_url TEXT NOT NULL,
  remarks TEXT,
  withdrawal_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for withdrawals updated_at
CREATE TRIGGER update_withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_withdrawals_withdrawal_number ON public.withdrawals(withdrawal_number);
CREATE INDEX idx_withdrawals_work_order_id ON public.withdrawals(work_order_id);
CREATE INDEX idx_withdrawals_technician_id ON public.withdrawals(technician_id);
CREATE INDEX idx_withdrawals_merchant_id ON public.withdrawals(merchant_id);
CREATE INDEX idx_withdrawals_asset_id ON public.withdrawals(asset_id);
CREATE INDEX idx_withdrawals_withdrawal_date ON public.withdrawals(withdrawal_date);