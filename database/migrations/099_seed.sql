-- 099 seed BDT demo
insert into public.categories (name, slug, display_order, status) values
  ('Mobile & Accessories','mobile-accessories',1,'active'),
  ('Audio','audio',2,'active'),
  ('Smart Watch','smart-watch',3,'active'),
  ('Gaming','gaming',4,'active'),
  ('Electronics','electronics',5,'active'),
  ('Computer Accessories','computer-accessories',6,'active')
on conflict (slug) do nothing;
insert into public.products (name, slug, brand, short_description, description, regular_price, sale_price, stock_quantity, sku, status, featured, trending) values
  ('Realme Narzo 70 Pro','realme-narzo-70-pro','Realme','Stylish phone','Full description',26999,22999,50,'SKU-NARZO70','active',true,true),
  ('boAt Rockerz 450','boat-rockerz-450','boAt','Over Ear Headphone','40mm Drivers 15H Battery',2499,1799,120,'SKU-BOAT450','active',true,true),
  ('Fire-Boltt Ninja Call Pro','fire-boltt-ninja-call-pro','Fire-Boltt','Smart Watch','Bluetooth Calling',3499,2199,80,'SKU-FIREBOLT','active',true,false),
  ('Gaming Mouse RGB','gaming-mouse-rgb','Generic','High DPI RGB Mouse','Gaming mouse',1399,950,200,'SKU-MOUSE-RGB','active',false,true),
  ('Realme 33W Charger','realme-33w-charger','Realme','Fast Charging Adapter','33W Dart',899,749,300,'SKU-CHARGER33','active',false,false)
on conflict (slug) do nothing;
