-- Create quality checks table
CREATE TABLE public.quality_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qc_number TEXT UNIQUE NOT NULL,
  receive_id UUID NOT NULL REFERENCES public.receives(id),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  inspected_by UUID NOT NULL REFERENCES public.profiles(id),
  condition asset_condition NOT NULL,
  check_result TEXT NOT NULL CHECK (check_result IN ('pass', 'fail', 'repair_required')),
  defects_description TEXT,
  repair_required BOOLEAN DEFAULT FALSE,
  repair_notes TEXT,
  photos JSONB DEFAULT '[]',
  qc_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for quality_checks updated_at
CREATE TRIGGER update_quality_checks_updated_at
  BEFORE UPDATE ON public.quality_checks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_quality_checks_qc_number ON public.quality_checks(qc_number);
CREATE INDEX idx_quality_checks_receive_id ON public.quality_checks(receive_id);
CREATE INDEX idx_quality_checks_asset_id ON public.quality_checks(asset_id);
CREATE INDEX idx_quality_checks_inspected_by ON public.quality_checks(inspected_by);
CREATE INDEX idx_quality_checks_check_result ON public.quality_checks(check_result);