-- ============================================================
-- SeribuTukang Seed Data
-- Service Categories — the 6 tiles on the home screen
-- Safe to run multiple times — insert OR reactivate
-- ============================================================

-- Plumbing
INSERT INTO service_categories (name, description, icon_url, is_active, created_at, updated_at)
SELECT 'Plumbing',
       'Jasa perbaikan pipa, ledeng, sanitasi, dan instalasi air',
       'https://cdn.seributukang.id/icons/plumbing.png',
       true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Plumbing');
UPDATE service_categories SET is_active = true, updated_at = NOW()
WHERE name = 'Plumbing' AND is_active = false;

-- Electrical
INSERT INTO service_categories (name, description, icon_url, is_active, created_at, updated_at)
SELECT 'Electrical',
       'Jasa instalasi listrik, perbaikan kabel, dan panel listrik',
       'https://cdn.seributukang.id/icons/electrical.png',
       true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Electrical');
UPDATE service_categories SET is_active = true, updated_at = NOW()
WHERE name = 'Electrical' AND is_active = false;

-- Cleaning
INSERT INTO service_categories (name, description, icon_url, is_active, created_at, updated_at)
SELECT 'Cleaning',
       'Jasa kebersihan rumah, kantor, dan gedung',
       'https://cdn.seributukang.id/icons/cleaning.png',
       true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Cleaning');
UPDATE service_categories SET is_active = true, updated_at = NOW()
WHERE name = 'Cleaning' AND is_active = false;

-- Painting
INSERT INTO service_categories (name, description, icon_url, is_active, created_at, updated_at)
SELECT 'Painting',
       'Jasa pengecatan rumah, tembok, dan furniture',
       'https://cdn.seributukang.id/icons/painting.png',
       true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Painting');
UPDATE service_categories SET is_active = true, updated_at = NOW()
WHERE name = 'Painting' AND is_active = false;

-- AC Service
INSERT INTO service_categories (name, description, icon_url, is_active, created_at, updated_at)
SELECT 'AC Service',
       'Jasa servis, cuci, dan instalasi AC',
       'https://cdn.seributukang.id/icons/ac-service.png',
       true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'AC Service');
UPDATE service_categories SET is_active = true, updated_at = NOW()
WHERE name = 'AC Service' AND is_active = false;

-- Carpentry
INSERT INTO service_categories (name, description, icon_url, is_active, created_at, updated_at)
SELECT 'Carpentry',
       'Jasa pertukangan kayu, furniture, dan renovasi',
       'https://cdn.seributukang.id/icons/carpentry.png',
       true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE name = 'Carpentry');
UPDATE service_categories SET is_active = true, updated_at = NOW()
WHERE name = 'Carpentry' AND is_active = false;