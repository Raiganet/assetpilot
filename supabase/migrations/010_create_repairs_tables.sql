-- Create repairs table
CREATE TABLE public.repairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_number TEXT UNIQUE NOT NULL,
  qc_id UUID REFERENCES public.quality_checks(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  technician_id UUID NOT NULL REFERENCES public.technicians(id),
  repair_date DATE NOT NULL,
  completion_date DATE,
  parts_replaced JSONB DEFAULT '[]',
  repair_cost DECIMAL(12, 2) DEFAULT 0,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for repairs updated_at
CREATE TRIGGER update_repairs_updated_at
  BEFORE UPDATE ON public.repairs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_repairs_repair_number ON public.repairs(repair_number);
CREATE INDEX idx_repairs_qc_id ON public.repairs(qc_id);
CREATE INDEX idx_repairs_asset_id ON public.repairs(asset_id);
CREATE INDEX idx_repairs_technician_id ON public.repairs(technician_id);
CREATE INDEX idx_repairs_status ON public.repairs(status);
CREATE INDEX idx_repairs_repair_date ON public.repairs(repair_date);