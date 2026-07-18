-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chain_of_custody ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.get_user_role(auth.uid()) = 'administrator');
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.get_user_role(auth.uid()) = 'administrator');

-- Merchants policies
CREATE POLICY "Authenticated users can view merchants" ON public.merchants FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and supervisors can manage merchants" ON public.merchants FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'supervisor'));

-- Technicians policies
CREATE POLICY "Authenticated users can view technicians" ON public.technicians FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage technicians" ON public.technicians FOR ALL USING (public.get_user_role(auth.uid()) = 'administrator');

-- Warehouses policies
CREATE POLICY "Authenticated users can view warehouses" ON public.warehouses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse staff can manage warehouses" ON public.warehouses FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Assets policies
CREATE POLICY "Authenticated users can view assets" ON public.assets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse staff can manage assets" ON public.assets FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Work orders policies
CREATE POLICY "Authenticated users can view work orders" ON public.work_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and supervisors can manage work orders" ON public.work_orders FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'supervisor'));

-- Withdrawals policies
CREATE POLICY "Authenticated users can view withdrawals" ON public.withdrawals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Technicians can create withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'technician');
CREATE POLICY "Admins and supervisors can update withdrawals" ON public.withdrawals FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('administrator', 'supervisor'));

-- Receives policies
CREATE POLICY "Authenticated users can view receives" ON public.receives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Warehouse staff can manage receives" ON public.receives FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Quality checks policies
CREATE POLICY "Authenticated users can view quality checks" ON public.quality_checks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse staff can manage quality checks" ON public.quality_checks FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'warehouse'));

-- Repairs policies
CREATE POLICY "Authenticated users can view repairs" ON public.repairs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and technicians can manage repairs" ON public.repairs FOR ALL USING (public.get_user_role(auth.uid()) IN ('administrator', 'technician'));

-- Chain of custody policies (IMMUTABLE - only insert)
CREATE POLICY "Authenticated users can view chain of custody" ON public.chain_of_custody FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create chain of custody" ON public.chain_of_custody FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Authenticated users can view activity logs" ON public.activity_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can create activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
