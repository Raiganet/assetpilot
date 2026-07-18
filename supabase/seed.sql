-- Seed data for testing
-- Run this after migrations are applied

-- Insert sample admin user (password: admin123)
-- Note: You need to create the user via Supabase Auth first
-- Then run this SQL to set the role

-- INSERT INTO public.profiles (id, email, full_name, role, status)
-- VALUES (
--   'your-user-uuid-here',
--   'admin@assetpilot.com',
--   'System Administrator',
--   'administrator',
--   'active'
-- );

-- Sample warehouses
INSERT INTO public.warehouses (warehouse_name, warehouse_code, address, city, province, phone, email, capacity)
VALUES
  ('Main Warehouse Jakarta', 'WH-JKT-001', 'Jl. Sudirman No. 1', 'Jakarta', 'DKI Jakarta', '021-1234567', 'jakarta@assetpilot.com', 1000),
  ('Warehouse Surabaya', 'WH-SBY-001', 'Jl. Basuki Rahmat No. 10', 'Surabaya', 'Jawa Timur', '031-1234567', 'surabaya@assetpilot.com', 500),
  ('Warehouse Bandung', 'WH-BDG-001', 'Jl. Asia Afrika No. 5', 'Bandung', 'Jawa Barat', '022-1234567', 'bandung@assetpilot.com', 300);

-- Sample merchants
INSERT INTO public.merchants (merchant_name, merchant_code, address, city, province, contact_person, contact_phone, mid, tid)
VALUES
  ('Toko Sejahtera', 'MRC-001', 'Jl. Merdeka No. 10', 'Jakarta', 'DKI Jakarta', 'Budi Santoso', '081234567890', 'MID001', 'TID001'),
  ('Warung Makmur', 'MRC-002', 'Jl. Gatot Subroto No. 20', 'Jakarta', 'DKI Jakarta', 'Siti Aminah', '081234567891', 'MID002', 'TID002'),
  ('Restoran Enak', 'MRC-003', 'Jl. Thamrin No. 30', 'Jakarta', 'DKI Jakarta', 'Ahmad Hidayat', '081234567892', 'MID003', 'TID003');

-- Sample technicians
-- Note: You need to create user accounts first via Supabase Auth
-- Then link them to technicians table

-- Sample assets
INSERT INTO public.assets (asset_id, asset_type, brand, model, serial_number, barcode, status, condition, warehouse_id)
VALUES
  ('AST-EDC-001', 'edc', 'Verifone', 'VX520', 'SN-VX520-001', 'BC-VX520-001', 'ready_stock', 'good', (SELECT id FROM warehouses WHERE warehouse_code = 'WH-JKT-001')),
  ('AST-EDC-002', 'edc', 'Ingenico', 'iCT250', 'SN-ICT250-001', 'BC-ICT250-001', 'ready_stock', 'good', (SELECT id FROM warehouses WHERE warehouse_code = 'WH-JKT-001')),
  ('AST-SIM-001', 'sim_card', 'Telkomsel', '4G LTE', 'SN-SIM-001', 'BC-SIM-001', 'ready_stock', 'good', (SELECT id FROM warehouses WHERE warehouse_code = 'WH-JKT-001'));
