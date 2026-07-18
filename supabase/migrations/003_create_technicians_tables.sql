-- Create technicians table (extends profiles for technician-specific data)
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  specialization TEXT,
  service_area TEXT,
  phone TEXT NOT NULL,
  emergency_contact TEXT,
  join_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  last_location_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for technicians updated_at
CREATE TRIGGER update_technicians_updated_at
  BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_technicians_employee_id ON public.technicians(employee_id);
CREATE INDEX idx_technicians_status ON public.technicians(status);
CREATE INDEX idx_technicians_service_area ON public.technicians(service_area);