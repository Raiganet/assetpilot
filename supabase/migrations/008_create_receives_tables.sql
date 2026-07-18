-- Create receives table
CREATE TABLE public.receives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receive_number TEXT UNIQUE NOT NULL,
  withdrawal_id UUID NOT NULL REFERENCES public.withdrawals(id),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  received_by UUID NOT NULL REFERENCES public.profiles(id),
  serial_number TEXT NOT NULL,
  sim_number TEXT,
  wo_number TEXT NOT NULL,
  condition asset_condition NOT NULL,
  photo_url TEXT,
  warehouse_signature_url TEXT NOT NULL,
  receive_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'rejected')),
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for receives updated_at
CREATE TRIGGER update_receives_updated_at
  BEFORE UPDATE ON public.receives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_receives_receive_number ON public.receives(receive_number);
CREATE INDEX idx_receives_withdrawal_id ON public.receives(withdrawal_id);
CREATE INDEX idx_receives_warehouse_id ON public.receives(warehouse_id);
CREATE INDEX idx_receives_asset_id ON public.receives(asset_id);
CREATE INDEX idx_receives_received_by ON public.receives(received_by);
CREATE INDEX idx_receives_receive_date ON public.receives(receive_date);