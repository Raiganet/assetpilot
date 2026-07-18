-- Create enum for work order status
CREATE TYPE work_order_status AS ENUM (
  'pending',
  'assigned',
  'in_progress',
  'completed',
  'cancelled',
  'on_hold'
);

-- Create enum for case type
CREATE TYPE case_type AS ENUM (
  'installation',
  'replacement',
  'maintenance',
  'repair',
  'withdrawal',
  'inspection'
);

-- Create work orders table
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wo_number TEXT UNIQUE NOT NULL,
  reference_number TEXT,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id),
  technician_id UUID REFERENCES public.technicians(id),
  supervisor_id UUID REFERENCES public.profiles(id),
  service_point TEXT,
  target_date DATE NOT NULL,
  response_date DATE,
  completion_date DATE,
  description TEXT NOT NULL,
  activity TEXT,
  case_type case_type NOT NULL,
  product TEXT,
  serial_number TEXT,
  sim_number TEXT,
  status work_order_status NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for work_orders updated_at
CREATE TRIGGER update_work_orders_updated_at
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_work_orders_wo_number ON public.work_orders(wo_number);
CREATE INDEX idx_work_orders_merchant_id ON public.work_orders(merchant_id);
CREATE INDEX idx_work_orders_technician_id ON public.work_orders(technician_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_orders_target_date ON public.work_orders(target_date);
CREATE INDEX idx_work_orders_case_type ON public.work_orders(case_type);