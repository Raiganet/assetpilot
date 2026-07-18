-- Create merchants table
CREATE TABLE public.merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_name TEXT NOT NULL,
  merchant_code TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'Indonesia',
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  mid TEXT,
  tid TEXT,
  mcc TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for merchants updated_at
CREATE TRIGGER update_merchants_updated_at
  BEFORE UPDATE ON public.merchants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_merchants_merchant_code ON public.merchants(merchant_code);
CREATE INDEX idx_merchants_city ON public.merchants(city);
CREATE INDEX idx_merchants_status ON public.merchants(status);
CREATE INDEX idx_merchants_mid ON public.merchants(mid);