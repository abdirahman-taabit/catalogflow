INSERT INTO products (id, sku, title, description, category, keywords, quality_score, enrichment_status, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000001','KEY-1042','WIRELESS MECHANICAL KEYBOARD','Compact keyboard.','', 'wireless,keyboard',42,'NEEDS_REVIEW',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000002','AUD-2198','Everyday active headphones','Lightweight wireless headphones with 30-hour battery life and soft memory-foam cushions.','Audio','headphones,wireless,audio',91,'COMPLETE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000003','BOT-3011','Stainless steel bottle','Double-wall insulated bottle that keeps drinks cold for 24 hours.','Kitchen and dining','bottle,insulated,steel',86,'COMPLETE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000004','CAM-8820','COMPACT TRAVEL CAMERA','12 MP camera.','Photography','camera,travel',55,'NEEDS_REVIEW',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000005','CHR-4400','Ergonomic desk chair','Adjustable lumbar support, breathable mesh back and durable rolling base for everyday office work.','Furniture','chair,ergonomic,office',94,'COMPLETE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000006','MON-2710','27 inch productivity monitor','Crisp QHD display with an adjustable stand and USB-C connectivity for modern workspaces.','Computer accessories','monitor,qhd,usb-c',96,'COMPLETE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000007','LMP-1880','Minimal task lamp','Focused warm light with three brightness settings and a compact weighted base.','Home office','lamp,light,desk',88,'COMPLETE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000008','MSE-0109','wireless mouse','Basic mouse.','', 'mouse,wireless',48,'NEEDS_REVIEW',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000009','SPK-5561','Portable room speaker','Balanced sound, splash resistance and twelve hours of playback in a compact enclosure.','Audio','speaker,portable,audio',92,'COMPLETE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000010','BAG-7042','Commuter laptop bag','', 'Bags','bag,laptop',57,'NEEDS_REVIEW',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000011','HUB-8325','Seven port USB-C hub','Connect displays, storage and power through one compact aluminium hub.','Computer accessories','hub,usb-c,adapter',90,'COMPLETE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000012','STD-1190','Aluminium laptop stand','Stable laptop stand.','Computer accessories','stand,laptop',66,'NEEDS_REVIEW',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO audit_events (id, product_id, event_type, previous_values, new_values, created_at) VALUES
('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','PRODUCT_IMPORTED',NULL,'{"sku":"KEY-1042","source":"demo-catalog.csv"}',CURRENT_TIMESTAMP),
('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','PRODUCT_IMPORTED',NULL,'{"sku":"CAM-8820","source":"demo-catalog.csv"}',CURRENT_TIMESTAMP),
('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000008','PRODUCT_IMPORTED',NULL,'{"sku":"MSE-0109","source":"demo-catalog.csv"}',CURRENT_TIMESTAMP);

INSERT INTO import_jobs (id, filename, total_rows, imported_rows, rejected_rows, duplicate_rows, status, created_at) VALUES
('20000000-0000-0000-0000-000000000001','demo-catalog.csv',12,12,0,0,'COMPLETED',CURRENT_TIMESTAMP);

