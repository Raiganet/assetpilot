CREATE TABLE public.chain_of_custody (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES public.assets(id),
  from_holder_id UUID REFERENCES public.profiles(id),
  from_holder_type TEXT CHECK (from_holder_type IN ('merchant', 'technician', 'warehouse', 'qc', 'repair')),
  to_holder_id UUID REFERENCES public.profiles(id),
  to_holder_type TEXT CHECK (to_holder_type IN ('merchant', 'technician', 'warehouse', 'qc', 'repair')),
  action TEXT NOT NULL CHECK (action IN ('install', 'replacement', 'withdraw', 'on_technician', 'receive_warehouse', 'qc', 'repair', 'ready_stock', 'deploy', 'transfer')),
  reference_type TEXT CHECK (reference_type IN ('work_order', 'withdrawal', 'receive', 'qc', 'repair')),
  reference_id UUID,
  notes TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chain_of_custody_asset_id ON public.chain_of_custody(asset_id);
CREATE INDEX idx_chain_of_custody_action ON public.chain_of_custody(action);
CREATE INDEX idx_chain_of_custody_created_at ON public.chain_of_custody(created_at);
CREATE INDEX idx_chain_of_custody_from_holder ON public.chain_of_custody(from_holder_id);
CREATE INDEX idx_chain_of_custody_to_holder ON public.chain_of_custody(to_holder_id);

-- IMPORTANT: This table is IMMUTABLE - no UPDATE or DELETE allowed
