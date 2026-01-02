-- PostgreSQL Migration Script
-- Generated from SQLite database: TastyFoodFinal.db
-- Generated on: 2026-01-01 22:07:16
-- 
-- IMPORTANT: Run this AFTER creating tables (using Hibernate or manual schema)
-- 


-- Data for table: login_credentials
-- 7 rows

INSERT INTO login_credentials (username, password, usertype) VALUES ('admin', 'O2Esdae1BIpDX7bsgeUv+S1teVqLWpwXBw9qY8l6U7I=', 'admin');
INSERT INTO login_credentials (username, password, usertype) VALUES ('richard01', 'MVmIPZ6SvSWJKWwhCsLG7fEN9UGT0IyoqG+HDrpqoLs=', 'staff');
INSERT INTO login_credentials (username, password, usertype) VALUES ('cox02', 'Cox123', 'staff');
INSERT INTO login_credentials (username, password, usertype) VALUES ('deckon03', 'Deckon123', 'staff');
INSERT INTO login_credentials (username, password, usertype) VALUES ('cox04', 'Cox1234', 'staff');
INSERT INTO login_credentials (username, password, usertype) VALUES ('mullard05', 'Mullard123', 'staff');
INSERT INTO login_credentials (username, password, usertype) VALUES ('cox05', '/Z/3JM0EkK2pX1jW36KgFDEIZmU+NM//4OOW6dozGMM=', 'staff');

-- Data for table: employees
-- 7 rows

INSERT INTO employees (username, first_name, last_name, role, active_status, hire_date, last_active_at) VALUES ('admin', 'Admin', '', 'admin', TRUE, NULL, NULL);
INSERT INTO employees (username, first_name, last_name, role, active_status, hire_date, last_active_at) VALUES ('richard01', 'Amanda', 'Richard', 'staff', TRUE, NULL, NULL);
INSERT INTO employees (username, first_name, last_name, role, active_status, hire_date, last_active_at) VALUES ('cox02', 'Arthur', 'Cox', 'staff', TRUE, NULL, NULL);
INSERT INTO employees (username, first_name, last_name, role, active_status, hire_date, last_active_at) VALUES ('deckon03', 'Charles', 'Deckon', 'staff', TRUE, NULL, NULL);
INSERT INTO employees (username, first_name, last_name, role, active_status, hire_date, last_active_at) VALUES ('cox04', 'Francis', 'Cox', 'staff', TRUE, NULL, NULL);
INSERT INTO employees (username, first_name, last_name, role, active_status, hire_date, last_active_at) VALUES ('mullard05', 'Sarah', 'Mullard', 'staff', TRUE, NULL, NULL);
INSERT INTO employees (username, first_name, last_name, role, active_status, hire_date, last_active_at) VALUES ('cox05', 'Arthur', 'Cox', 'staff', TRUE, 1765177200000, to_timestamp(1765235921.248));

-- Data for table: drivers
-- 8 rows

INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (1, 'Shawn Murray', FALSE, NULL, NULL, NULL);
INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (2, 'Alex Shopper', FALSE, NULL, NULL, NULL);
INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (3, 'Lisa Graham', TRUE, NULL, NULL, NULL);
INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (4, 'Marcus Shane', FALSE, NULL, NULL, NULL);
INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (5, 'Ryan Graham', FALSE, NULL, NULL, NULL);
INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (6, 'Vicky Kissinger', FALSE, NULL, NULL, NULL);
INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (7, 'Lucy Gordon', TRUE, NULL, NULL, NULL);
INSERT INTO drivers (driver_id, full_name, on_delivery, current_order_id, phone_number, vehicle_description) VALUES (13, 'Meera Shane', FALSE, NULL, NULL, NULL);

-- Data for table: item_categories
-- 4 rows

INSERT INTO item_categories (category_id, name, display_order) VALUES (1, 'appetizers', NULL);
INSERT INTO item_categories (category_id, name, display_order) VALUES (2, 'main courses', NULL);
INSERT INTO item_categories (category_id, name, display_order) VALUES (3, 'desserts', NULL);
INSERT INTO item_categories (category_id, name, display_order) VALUES (4, 'beverages', NULL);

-- Data for table: menu_items
-- 15 rows

INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (1, 'Chicken Nuggets', 'Bite size portions of lightly breaded ground chicken, seasoned and fried to golden perfection.', 5.99, 'https://img.freepik.com/free-photo/two-chicken-nuggets-isolated-white-background_839833-29679.jpg?semt=ais_hybrid&w=740&q=80', 1, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (2, 'Chicken Wings', 'Chicken wings that are fried or baked to fall-off-the-bone tenderness and tossed in your sauce of choice.', 10.99, 'https://www.shutterstock.com/image-photo/single-saucy-chicken-wing-isolated-600nw-2556509549.jpg', 1, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (3, 'Chicken Meals Combo', 'Your combo choice of different cuts of chicken, cooked and seasoned to your liking.', 23.99, 'https://img.freepik.com/premium-photo/fried-chicken-with-french-fries-nuggets-meal-junk-food-unhealthy-food_1339-20695.jpg?semt=ais_hybrid&w=740&q=80', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (4, 'Club Sandwich', 'A three-layer sandwich of toasted bread with a filling of turkey, bacon, lettuce, tomato, and mayonnaise.', 8.99, 'https://storage.googleapis.com/gen-atmedia/3/2018/05/5ccfc009f24fdaa8bc2cf64305d4e1c5b1c79b38.jpeg', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (5, 'Chicken Wrap', 'Sliced grilled chicken breast, fresh green leaf lettuce, diced tomatoes, shredded cheddar cheese, and a creamy ranch dressing, all wrapped in a soft flour tortilla.', 6.99, 'https://www.shutterstock.com/image-photo/chicken-avocado-wrap-on-white-600nw-2502632265.jpg', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (6, 'Pepperoni Pizza (Small)', 'A personal sized pepperoni pizza.', 12.99, 'https://media.istockphoto.com/id/1475561128/photo/pepperoni-pizza-cheese-wood-cutting-board-isolated-white-background.jpg?s=612x612&w=0&k=20&c=qD3OZLURt-xjr5Ol-rkO9uoLMoDWQoEsuigHSsyjnmw=', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (7, 'Hawaiian Pizza', 'A medium-sized pizza with ham and pineapple toppings.', 24.99, 'https://t3.ftcdn.net/jpg/15/60/21/42/360_F_1560214236_0VLZUpAk3fKLpBTPCWUcoFNlSTVWMSBI.jpg', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (8, 'Pepperoni Pizza (Large)', 'A large-sized pepperoni pizza meant to feed 3-4 people.', 17.99, 'https://media.istockphoto.com/id/1042948900/photo/pizza-pepperoni-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=2WZk35fHKdCCh1FU-fOX6hrixIWB3IlMl0FspKaOraA=', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (9, 'Supreme Pizza', 'A pizza with a mix of meats like pepperoni and sausage, along with vegetables such as green peppers, onions, and black olives, and is often topped with mushrooms as well.', 21.99, 'https://t4.ftcdn.net/jpg/11/20/79/89/360_F_1120798909_Rmth1QO2eade612YlKPibr7RRegRIQro.jpg', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (10, 'Your 3 Topping Pizza', 'A customizable pizza that comes with up to three toppings.', 15.99, 'https://www.shutterstock.com/image-photo/three-different-gourmet-pizzas-various-600nw-2660242367.jpg', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (11, 'Butter Burger', 'A burger that is cooked in butter or is cooked and then finished with butter. (Your Preference)', 9.99, 'https://www.certifiedangusbeef.com/_next/image?url=https%3A%2F%2Fappetizing-cactus-7139e93734.media.strapiapp.com%2FButter_Burger_a8c0d88729.jpeg&w=1920&q=75', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (12, 'Cheese Burger', 'A hamburger that includes a slice of cheese of your choice on top of the beef patty.', 5.99, 'https://media.istockphoto.com/id/520410807/photo/cheeseburger.jpg?s=612x612&w=0&k=20&c=fG_OrCzR5HkJGI8RXBk76NwxxTasMb1qpTVlEM0oyg4=', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (13, 'Hamburger', 'A burger that comes with lettuce, onion, tomatoes, pickles, ketchup, and mustard toppings.', 4.99, 'https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (14, 'BBSpecial Burger', 'A customizable burger that comes with special toppings of your choice.', 12.99, 'https://www.tillamook.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fj8tkpy1gjhi5%2F7spL2AK0zUMWy4R0tX60ND%2F580c3c15c9825d7f89b83aac71110b64%2FDigital_S223_Slice_Farm_Swiss_CubanoBurger_V2__1_.jpg&w=3840&q=75', 2, NULL);
INSERT INTO menu_items (item_id, name, description, price, image_url, category_id, prep_time_minutes) VALUES (15, 'BBDouble Burger', 'A customizable burger of your choice that comes with two beef patties.', 11.99, 'https://www.shutterstock.com/image-photo/juicy-double-cheeseburger-studio-shot-600nw-2572134091.jpg', 2, NULL);

-- Data for table: order_items
-- 50 rows

INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD6956', 1, 3, 17.97, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD6956', 2, 2, 21.98, 10.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0001', 4, 3, 26.97, 8.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0002', 1, 10, 59.9, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0003', 4, 1, 8.99, 8.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0003', 1, 1, 5.99, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0003', 5, 2, 13.98, 6.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0004', 4, 10, 89.9, 8.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0004', 5, 10, 69.9, 6.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0004', 3, 10, 239.9, 23.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0005', 2, 3, 32.97, 10.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0005', 1, 3, 17.97, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0101', 9, 2, 43.98, 21.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0102', 8, 2, 35.98, 17.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0103', 9, 1, 21.99, 21.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0103', 7, 2, 49.98, 24.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0103', 10, 1, 15.99, 15.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0104', 6, 5, 64.95, 12.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0104', 7, 2, 49.98, 24.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0104', 10, 2, 31.98, 15.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0201', 13, 7, 34.93, 4.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0201', 12, 3, 17.97, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0202', 11, 10, 99.9, 9.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0202', 12, 5, 29.95, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0202', 14, 12, 155.88, 12.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0202', 15, 7, 83.93, 11.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0108', 7, 3, 74.97, 24.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0108', 9, 2, 43.98, 21.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0043', 3, 5, 119.95, 23.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0043', 5, 12, 83.88, 6.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0044', 4, 8, 71.92, 8.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0208', 14, 10, 129.9, 12.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0208', 15, 6, 71.94, 11.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0208', 12, 2, 11.98, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0209', 13, 5, 24.95, 4.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0209', 12, 5, 29.95, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0209', 11, 2, 19.98, 9.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0109', 6, 2, 25.98, 12.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0109', 8, 2, 35.98, 17.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0109', 7, 2, 49.98, 24.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0109', 9, 2, 43.98, 21.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0045', 4, 5, 44.95, 8.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0045', 3, 5, 119.95, 23.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0045', 5, 5, 34.95, 6.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD7973', 1, 4, 23.96, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD7973', 2, 2, 21.98, 10.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD0959', 1, 2, 11.98, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD3621', 1, 2, 11.98, 5.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD1729', 4, 2, 17.98, 8.99);
INSERT INTO order_items (order_id, item_id, quantity, line_total, unit_price) VALUES ('FD1729', 9, 2, 43.98, 21.99);

-- Data for table: orders
-- 20 rows

INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD6956', 'Dimitri Lavin', '7044411704', NULL, 17, 39.95, 0.99, 40.94, 'pending', 1764806600400, 1764808700400, NULL, to_timestamp(1765059984.969), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0001', 'Martha Washington', '6174785869', 1, 1, 26.97, 3.0, 29.97, 'delivered', 1764549120000, 1764551220000, 1764551400000, to_timestamp(1765061854.264), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0002', 'Raven Clinch', '6177074682', 2, 2, 59.9, 5.0, 64.9, 'delivered', 1764562860000, 1764565560000, 1764567120000, to_timestamp(1765062189.664), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0003', 'Brian Anderson', '3396880896', 1, 3, 28.96, 3.14, 32.1, 'delivered', 1764531660000, 1764532380000, 1764532260000, to_timestamp(1765062449.713), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0004', 'Elaine Mikowsky', '8574780267', 3, 4, 399.7, 64.9, 464.6, 'delivered', 1764619380000, 1764626580000, 1764626460000, to_timestamp(1765062901.559), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0005', 'Raj Sinha', '6179361143', 2, 5, 50.94, 5.0, 55.94, 'delivered', 1764560700000, 1764561600000, 1764561780000, to_timestamp(1765063405.845), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0101', 'Aram Shankar', '8572892774', 1, 6, 43.98, 4.76, 48.74, 'delivered', 1764636000000, 1764637800000, 1764637980000, to_timestamp(1765064160.509), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0102', 'Aram Shankar', '8572892774', 2, 6, 35.98, 3.9, 39.88, 'delivered', 1764714600000, 1764716400000, 1764716280000, to_timestamp(1765064742.676), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0103', 'Ramon Swagger', '7816782552', 2, 7, 87.96, 14.28, 102.24, 'delivered', 1764709200000, 1764711000000, 1764710520000, to_timestamp(1765065001.766), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0104', 'Ayesha Mohammad', '6175229965', 4, 8, 146.91, 19.08, 165.99, 'delivered', 1764701100000, 1764702600000, 1764703800000, to_timestamp(1765065329.069), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0201', 'William Dean', '7816662416', 5, 9, 52.9, 1.96, 54.86, 'delivered', 1764620820000, 1764621720000, 1764621480000, to_timestamp(1765065491.558), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0202', 'Sean Oxford', '6178325554', 3, 10, 369.66, 100.04, 469.7, 'delivered', 1764606720000, 1764615420000, 1764628200000, to_timestamp(1765065896.591), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0108', 'Rachel Meyer', '8572731010', 13, 11, 118.95, 9.95, 128.9, 'delivered', 1764704820000, 1764706920000, 1765236180000, to_timestamp(1765236338.511), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0043', 'Fu Wang', '6173577772', 1, 12, 203.83, 22.0, 225.83, 'delivered', 1764705720000, 1764709920000, NULL, to_timestamp(1765236824.8), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0044', 'Cliff Hans', '8572569863', NULL, 13, 71.92, 3.89, 75.81, 'pending', 1764706380000, 1764708180000, NULL, to_timestamp(1765071034.296), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0208', 'Graham Walter', '7814910166', NULL, 14, 213.82, 34.72, 248.54, 'pending', 1764708840000, 1764710640000, NULL, to_timestamp(1765071303.983), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0209', 'Lisa Manters', '6174135588', NULL, 15, 74.88, 3.74, 78.62, 'pending', 1764709680000, 1764711480000, NULL, to_timestamp(1765071477.933), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0109', 'Aram Shankar', '8572892774', NULL, 6, 155.92, 30.38, 186.3, 'pending', 1764711480000, 1764713280000, NULL, to_timestamp(1765071667.946), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD0045', 'Brian Anderson', '3396880896', NULL, 3, 199.85, 21.63, 221.48, 'pending', 1764713400000, 1764715200000, NULL, to_timestamp(1765071821.017), NULL);
INSERT INTO orders (order_id, customer_name, customer_phone, driver_id, address_id, subtotal, tip, grand_total, status, created_at, estimated_delivery_time, delivered_at, last_updated_at, special_instructions) VALUES ('FD1729', 'Graham Walter', '7814910166', NULL, 14, 61.96, 4.12, 66.08, 'pending', 1765236599984, 1765238699984, NULL, to_timestamp(1765236599.984), NULL);

-- Data for table: delivery_address
-- 16 rows

INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (1, 77, 'Langley Road', NULL, 'Brighton', 'MA', '02239');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (2, 361, 'Stuart Road', NULL, 'College Town', 'MA', '02129');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (3, 45, 'Everett Street', NULL, 'Chestnut Hill', 'MA', '02129');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (4, 82564, 'Breck Avenue', NULL, 'Brighton', 'MA', '02239');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (5, 75, 'Blake Street', NULL, 'Edmonds Park', 'MA', '02134');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (6, 89, 'Langley Road', NULL, 'Brighton', 'MA', '02239');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (7, 387, 'University Avenue', NULL, 'Corey Hill', 'MA', '02491');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (8, 433, 'Queensberry Street', NULL, 'West Fens', 'MA', '02201');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (9, 4, 'Commonwealth Avenue', NULL, 'Griggs Park', 'MA', '02330');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (10, 345, 'Rocket Hall', NULL, 'Boston', 'MA', '02007');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (11, 75, 'Chatham Street', NULL, 'Longwood', 'MA', '02196');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (12, 2323, 'Brock Street', NULL, 'Central Village', 'MA', '02342');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (13, 563, 'Davis Avenue', NULL, 'Brookline', 'MA', '02342');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (14, 6256, 'Kent Street', NULL, 'Central Village', 'MA', '02342');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (15, 17286, 'York Terrace', NULL, 'Corey Hill', 'MA', '02491');
INSERT INTO delivery_address (address_id, building_number, street, apt_unit, city, state, zip_code) VALUES (17, 425, 'W 5th S', 'Apt 40', 'Rexburg', 'ID', '83440');
