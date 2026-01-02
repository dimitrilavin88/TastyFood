-- PostgreSQL INSERT Statements for TastyFood Database
-- This file contains all data from the SQLite database
-- IMPORTANT: Run supabase_schema.sql FIRST to create the tables
-- Then run this file to insert all the data
-- Insert order matters due to foreign key constraints
-- Order: item_categories -> menu_items -> delivery_address -> drivers -> employees -> login_credentials -> orders -> order_items
-- ============================================================================
-- ITEM CATEGORIES (4 rows)
-- ============================================================================
INSERT INTO item_categories (category_id, name, display_order)
VALUES (1, 'appetizers', NULL),
    (2, 'main courses', NULL),
    (3, 'desserts', NULL),
    (4, 'beverages', NULL);
-- Reset sequence to continue from the highest ID
SELECT setval(
        'item_categories_category_id_seq',
        (
            SELECT MAX(category_id)
            FROM item_categories
        )
    );
-- ============================================================================
-- MENU ITEMS (15 rows)
-- ============================================================================
INSERT INTO menu_items (
        item_id,
        name,
        description,
        price,
        image_url,
        category_id,
        prep_time_minutes
    )
VALUES (
        1,
        'Chicken Nuggets',
        'Bite size portions of lightly breaded ground chicken, seasoned and fried to golden perfection.',
        5.99,
        'https://img.freepik.com/free-photo/two-chicken-nuggets-isolated-white-background_839833-29679.jpg?semt=ais_hybrid&w=740&q=80',
        1,
        NULL
    ),
    (
        2,
        'Chicken Wings',
        'Chicken wings that are fried or baked to fall-off-the-bone tenderness and tossed in your sauce of choice.',
        10.99,
        'https://www.shutterstock.com/image-photo/single-saucy-chicken-wing-isolated-600nw-2556509549.jpg',
        1,
        NULL
    ),
    (
        3,
        'Chicken Meals Combo',
        'Your combo choice of different cuts of chicken, cooked and seasoned to your liking.',
        23.99,
        'https://img.freepik.com/premium-photo/fried-chicken-with-french-fries-nuggets-meal-junk-food-unhealthy-food_1339-20695.jpg?semt=ais_hybrid&w=740&q=80',
        2,
        NULL
    ),
    (
        4,
        'Club Sandwich',
        'A three-layer sandwich of toasted bread with a filling of turkey, bacon, lettuce, tomato, and mayonnaise.',
        8.99,
        'https://storage.googleapis.com/gen-atmedia/3/2018/05/5ccfc009f24fdaa8bc2cf64305d4e1c5b1c79b38.jpeg',
        2,
        NULL
    ),
    (
        5,
        'Chicken Wrap',
        'Sliced grilled chicken breast, fresh green leaf lettuce, diced tomatoes, shredded cheddar cheese, and a creamy ranch dressing, all wrapped in a soft flour tortilla.',
        6.99,
        'https://www.shutterstock.com/image-photo/chicken-avocado-wrap-on-white-600nw-2502632265.jpg',
        2,
        NULL
    ),
    (
        6,
        'Pepperoni Pizza (Small)',
        'A personal sized pepperoni pizza.',
        12.99,
        'https://media.istockphoto.com/id/1475561128/photo/pepperoni-pizza-cheese-wood-cutting-board-isolated-white-background.jpg?s=612x612&w=0&k=20&c=qD3OZLURt-xjr5Ol-rkO9uoLMoDWQoEsuigHSsyjnmw=',
        2,
        NULL
    ),
    (
        7,
        'Hawaiian Pizza',
        'A medium-sized pizza with ham and pineapple toppings.',
        24.99,
        'https://t3.ftcdn.net/jpg/15/60/21/42/360_F_1560214236_0VLZUpAk3fKLpBTPCWUcoFNlSTVWMSBI.jpg',
        2,
        NULL
    ),
    (
        8,
        'Pepperoni Pizza (Large)',
        'A large-sized pepperoni pizza meant to feed 3-4 people.',
        17.99,
        'https://media.istockphoto.com/id/1042948900/photo/pizza-pepperoni-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=2WZk35fHKdCCh1FU-fOX6hrixIWB3IlMl0FspKaOraA=',
        2,
        NULL
    ),
    (
        9,
        'Supreme Pizza',
        'A pizza with a mix of meats like pepperoni and sausage, along with vegetables such as green peppers, onions, and black olives, and is often topped with mushrooms as well.',
        21.99,
        'https://t4.ftcdn.net/jpg/11/20/79/89/360_F_1120798909_Rmth1QO2eade612YlKPibr7RRegRIQro.jpg',
        2,
        NULL
    ),
    (
        10,
        'Your 3 Topping Pizza',
        'A customizable pizza that comes with up to three toppings.',
        15.99,
        'https://www.shutterstock.com/image-photo/three-different-gourmet-pizzas-various-600nw-2660242367.jpg',
        2,
        NULL
    ),
    (
        11,
        'Butter Burger',
        'A burger that is cooked in butter or is cooked and then finished with butter. (Your Preference)',
        9.99,
        'https://www.certifiedangusbeef.com/_next/image?url=https%3A%2F%2Fappetizing-cactus-7139e93734.media.strapiapp.com%2FButter_Burger_a8c0d88729.jpeg&w=1920&q=75',
        2,
        NULL
    ),
    (
        12,
        'Cheese Burger',
        'A hamburger that includes a slice of cheese of your choice on top of the beef patty.',
        5.99,
        'https://media.istockphoto.com/id/520410807/photo/cheeseburger.jpg?s=612x612&w=0&k=20&c=fG_OrCzR5HkJGI8RXBk76NwxxTasMb1qpTVlEM0oyg4=',
        2,
        NULL
    ),
    (
        13,
        'Hamburger',
        'A burger that comes with lettuce, onion, tomatoes, pickles, ketchup, and mustard toppings.',
        4.99,
        'https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2VyfGVufDB8fDB8fHww',
        2,
        NULL
    ),
    (
        14,
        'BBSpecial Burger',
        'A customizable burger that comes with special toppings of your choice.',
        12.99,
        'https://www.tillamook.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fj8tkpy1gjhi5%2F7spL2AK0zUMWy4R0tX60ND%2F580c3c15c9825d7f89b83aac71110b64%2FDigital_S223_Slice_Farm_Swiss_CubanoBurger_V2__1_.jpg&w=3840&q=75',
        2,
        NULL
    ),
    (
        15,
        'BBDouble Burger',
        'A customizable burger of your choice that comes with two beef patties.',
        11.99,
        'https://www.shutterstock.com/image-photo/juicy-double-cheeseburger-studio-shot-600nw-2572134091.jpg',
        2,
        NULL
    );
-- Reset sequence
SELECT setval(
        'menu_items_item_id_seq',
        (
            SELECT MAX(item_id)
            FROM menu_items
        )
    );
-- ============================================================================
-- DELIVERY ADDRESSES (16 rows)
-- ============================================================================
INSERT INTO delivery_address (
        address_id,
        building_number,
        street,
        apt_unit,
        city,
        state,
        zip_code
    )
VALUES (
        1,
        77,
        'Langley Road',
        NULL,
        'Brighton',
        'MA',
        '02239'
    ),
    (
        2,
        361,
        'Stuart Road',
        NULL,
        'College Town',
        'MA',
        '02129'
    ),
    (
        3,
        45,
        'Everett Street',
        NULL,
        'Chestnut Hill',
        'MA',
        '02129'
    ),
    (
        4,
        82564,
        'Breck Avenue',
        NULL,
        'Brighton',
        'MA',
        '02239'
    ),
    (
        5,
        75,
        'Blake Street',
        NULL,
        'Edmonds Park',
        'MA',
        '02134'
    ),
    (
        6,
        89,
        'Langley Road',
        NULL,
        'Brighton',
        'MA',
        '02239'
    ),
    (
        7,
        387,
        'University Avenue',
        NULL,
        'Corey Hill',
        'MA',
        '02491'
    ),
    (
        8,
        433,
        'Queensberry Street',
        NULL,
        'West Fens',
        'MA',
        '02201'
    ),
    (
        9,
        4,
        'Commonwealth Avenue',
        NULL,
        'Griggs Park',
        'MA',
        '02330'
    ),
    (
        10,
        345,
        'Rocket Hall',
        NULL,
        'Boston',
        'MA',
        '02007'
    ),
    (
        11,
        75,
        'Chatham Street',
        NULL,
        'Longwood',
        'MA',
        '02196'
    ),
    (
        12,
        2323,
        'Brock Street',
        NULL,
        'Central Village',
        'MA',
        '02342'
    ),
    (
        13,
        563,
        'Davis Avenue',
        NULL,
        'Brookline',
        'MA',
        '02342'
    ),
    (
        14,
        6256,
        'Kent Street',
        NULL,
        'Central Village',
        'MA',
        '02342'
    ),
    (
        15,
        17286,
        'York Terrace',
        NULL,
        'Corey Hill',
        'MA',
        '02491'
    ),
    (
        17,
        425,
        'W 5th S',
        'Apt 40',
        'Rexburg',
        'ID',
        '83440'
    );
-- Reset sequence (note: address_id 17 exists, so set to 17)
SELECT setval('delivery_address_address_id_seq', 17);
-- ============================================================================
-- DRIVERS (8 rows)
-- ============================================================================
INSERT INTO drivers (
        driver_id,
        full_name,
        on_delivery,
        current_order_id,
        phone_number,
        vehicle_description
    )
VALUES (1, 'Shawn Murray', FALSE, NULL, NULL, NULL),
    (2, 'Alex Shopper', FALSE, NULL, NULL, NULL),
    (3, 'Lisa Graham', TRUE, NULL, NULL, NULL),
    (4, 'Marcus Shane', FALSE, NULL, NULL, NULL),
    (5, 'Ryan Graham', FALSE, NULL, NULL, NULL),
    (6, 'Vicky Kissinger', FALSE, NULL, NULL, NULL),
    (7, 'Lucy Gordon', TRUE, NULL, NULL, NULL),
    (13, 'Meera Shane', FALSE, NULL, NULL, NULL);
-- Reset sequence (note: driver_id 13 exists, so set to 13)
SELECT setval('drivers_driver_id_seq', 13);
-- ============================================================================
-- EMPLOYEES (7 rows)
-- Note: hire_date stored as BIGINT (milliseconds) in SQLite, converted to DATE here
-- last_active_at stored as BIGINT (milliseconds) in SQLite, converted to TIMESTAMP here
-- ============================================================================
INSERT INTO employees (
        username,
        first_name,
        last_name,
        role,
        active_status,
        hire_date,
        last_active_at
    )
VALUES ('admin', 'Admin', '', 'admin', TRUE, NULL, NULL),
    (
        'richard01',
        'Amanda',
        'Richard',
        'staff',
        TRUE,
        NULL,
        NULL
    ),
    (
        'cox02',
        'Arthur',
        'Cox',
        'staff',
        TRUE,
        NULL,
        NULL
    ),
    (
        'deckon03',
        'Charles',
        'Deckon',
        'staff',
        TRUE,
        NULL,
        NULL
    ),
    (
        'cox04',
        'Francis',
        'Cox',
        'staff',
        TRUE,
        NULL,
        NULL
    ),
    (
        'mullard05',
        'Sarah',
        'Mullard',
        'staff',
        TRUE,
        NULL,
        NULL
    ),
    (
        'cox05',
        'Arthur',
        'Cox',
        'staff',
        TRUE,
        to_timestamp(1765177200000 / 1000)::DATE,
        to_timestamp(1765235921.248)
    );
-- ============================================================================
-- LOGIN CREDENTIALS (7 rows)
-- ============================================================================
INSERT INTO login_credentials (username, password, usertype)
VALUES (
        'admin',
        'O2Esdae1BIpDX7bsgeUv+S1teVqLWpwXBw9qY8l6U7I=',
        'admin'
    ),
    (
        'richard01',
        'MVmIPZ6SvSWJKWwhCsLG7fEN9UGT0IyoqG+HDrpqoLs=',
        'staff'
    ),
    ('cox02', 'Cox123', 'staff'),
    ('deckon03', 'Deckon123', 'staff'),
    ('cox04', 'Cox1234', 'staff'),
    ('mullard05', 'Mullard123', 'staff'),
    (
        'cox05',
        '/Z/3JM0EkK2pX1jW36KgFDEIZmU+NM//4OOW6dozGMM=',
        'staff'
    );
-- ============================================================================
-- ORDERS (20 rows)
-- Note: All timestamps stored as BIGINT (milliseconds since epoch) to match SQLite
-- ============================================================================
INSERT INTO orders (
        order_id,
        customer_name,
        customer_phone,
        driver_id,
        address_id,
        subtotal,
        tip,
        grand_total,
        status,
        created_at,
        estimated_delivery_time,
        delivered_at,
        last_updated_at,
        special_instructions
    )
VALUES (
        'FD6956',
        'Dimitri Lavin',
        '7044411704',
        NULL,
        17,
        39.95,
        0.99,
        40.94,
        'pending',
        1764806600400,
        1764808700400,
        NULL,
        1765059984969,
        NULL
    ),
    (
        'FD0001',
        'Martha Washington',
        '6174785869',
        1,
        1,
        26.97,
        3.0,
        29.97,
        'delivered',
        1764549120000,
        1764551220000,
        1764551400000,
        1765061854264,
        NULL
    ),
    (
        'FD0002',
        'Raven Clinch',
        '6177074682',
        2,
        2,
        59.9,
        5.0,
        64.9,
        'delivered',
        1764562860000,
        1764565560000,
        1764567120000,
        1765062189664,
        NULL
    ),
    (
        'FD0003',
        'Brian Anderson',
        '3396880896',
        1,
        3,
        28.96,
        3.14,
        32.1,
        'delivered',
        1764531660000,
        1764532380000,
        1764532260000,
        1765062449713,
        NULL
    ),
    (
        'FD0004',
        'Elaine Mikowsky',
        '8574780267',
        3,
        4,
        399.7,
        64.9,
        464.6,
        'delivered',
        1764619380000,
        1764626580000,
        1764626460000,
        1765062901559,
        NULL
    ),
    (
        'FD0005',
        'Raj Sinha',
        '6179361143',
        2,
        5,
        50.94,
        5.0,
        55.94,
        'delivered',
        1764560700000,
        1764561600000,
        1764561780000,
        1765063405845,
        NULL
    ),
    (
        'FD0101',
        'Aram Shankar',
        '8572892774',
        1,
        6,
        43.98,
        4.76,
        48.74,
        'delivered',
        1764636000000,
        1764637800000,
        1764637980000,
        1765064160509,
        NULL
    ),
    (
        'FD0102',
        'Aram Shankar',
        '8572892774',
        2,
        6,
        35.98,
        3.9,
        39.88,
        'delivered',
        1764714600000,
        1764716400000,
        1764716280000,
        1765064742676,
        NULL
    ),
    (
        'FD0103',
        'Ramon Swagger',
        '7816782552',
        2,
        7,
        87.96,
        14.28,
        102.24,
        'delivered',
        1764709200000,
        1764711000000,
        1764710520000,
        1765065001766,
        NULL
    ),
    (
        'FD0104',
        'Ayesha Mohammad',
        '6175229965',
        4,
        8,
        146.91,
        19.08,
        165.99,
        'delivered',
        1764701100000,
        1764702600000,
        1764703800000,
        1765065329069,
        NULL
    ),
    (
        'FD0201',
        'William Dean',
        '7816662416',
        5,
        9,
        52.9,
        1.96,
        54.86,
        'delivered',
        1764620820000,
        1764621720000,
        1764621480000,
        1765065491558,
        NULL
    ),
    (
        'FD0202',
        'Sean Oxford',
        '6178325554',
        3,
        10,
        369.66,
        100.04,
        469.7,
        'delivered',
        1764606720000,
        1764615420000,
        1764628200000,
        1765065896591,
        NULL
    ),
    (
        'FD0108',
        'Rachel Meyer',
        '8572731010',
        13,
        11,
        118.95,
        9.95,
        128.9,
        'delivered',
        1764704820000,
        1764706920000,
        1765236180000,
        1765236338511,
        NULL
    ),
    (
        'FD0043',
        'Fu Wang',
        '6173577772',
        1,
        12,
        203.83,
        22.0,
        225.83,
        'delivered',
        1764705720000,
        1764709920000,
        NULL,
        1765236824800,
        NULL
    ),
    (
        'FD0044',
        'Cliff Hans',
        '8572569863',
        NULL,
        13,
        71.92,
        3.89,
        75.81,
        'pending',
        1764706380000,
        1764708180000,
        NULL,
        1765071034296,
        NULL
    ),
    (
        'FD0208',
        'Graham Walter',
        '7814910166',
        NULL,
        14,
        213.82,
        34.72,
        248.54,
        'pending',
        1764708840000,
        1764710640000,
        NULL,
        1765071303983,
        NULL
    ),
    (
        'FD0209',
        'Lisa Manters',
        '6174135588',
        NULL,
        15,
        74.88,
        3.74,
        78.62,
        'pending',
        1764709680000,
        1764711480000,
        NULL,
        1765071477933,
        NULL
    ),
    (
        'FD0109',
        'Aram Shankar',
        '8572892774',
        NULL,
        6,
        155.92,
        30.38,
        186.3,
        'pending',
        1764711480000,
        1764713280000,
        NULL,
        1765071667946,
        NULL
    ),
    (
        'FD0045',
        'Brian Anderson',
        '3396880896',
        NULL,
        3,
        199.85,
        21.63,
        221.48,
        'pending',
        1764713400000,
        1764715200000,
        NULL,
        1765071821017,
        NULL
    ),
    (
        'FD1729',
        'Graham Walter',
        '7814910166',
        NULL,
        14,
        61.96,
        4.12,
        66.08,
        'pending',
        1765236599984,
        1765238699984,
        NULL,
        1765236599984,
        NULL
    );
-- ============================================================================
-- ORDER ITEMS (46 rows)
-- Note: Removed 4 orphaned items (FD7973, FD0959, FD3621) that reference non-existent orders
-- ============================================================================
INSERT INTO order_items (
        order_id,
        item_id,
        quantity,
        line_total,
        unit_price
    )
VALUES ('FD6956', 1, 3, 17.97, 5.99),
    ('FD6956', 2, 2, 21.98, 10.99),
    ('FD0001', 4, 3, 26.97, 8.99),
    ('FD0002', 1, 10, 59.9, 5.99),
    ('FD0003', 4, 1, 8.99, 8.99),
    ('FD0003', 1, 1, 5.99, 5.99),
    ('FD0003', 5, 2, 13.98, 6.99),
    ('FD0004', 4, 10, 89.9, 8.99),
    ('FD0004', 5, 10, 69.9, 6.99),
    ('FD0004', 3, 10, 239.9, 23.99),
    ('FD0005', 2, 3, 32.97, 10.99),
    ('FD0005', 1, 3, 17.97, 5.99),
    ('FD0101', 9, 2, 43.98, 21.99),
    ('FD0102', 8, 2, 35.98, 17.99),
    ('FD0103', 9, 1, 21.99, 21.99),
    ('FD0103', 7, 2, 49.98, 24.99),
    ('FD0103', 10, 1, 15.99, 15.99),
    ('FD0104', 6, 5, 64.95, 12.99),
    ('FD0104', 7, 2, 49.98, 24.99),
    ('FD0104', 10, 2, 31.98, 15.99),
    ('FD0201', 13, 7, 34.93, 4.99),
    ('FD0201', 12, 3, 17.97, 5.99),
    ('FD0202', 11, 10, 99.9, 9.99),
    ('FD0202', 12, 5, 29.95, 5.99),
    ('FD0202', 14, 12, 155.88, 12.99),
    ('FD0202', 15, 7, 83.93, 11.99),
    ('FD0108', 7, 3, 74.97, 24.99),
    ('FD0108', 9, 2, 43.98, 21.99),
    ('FD0043', 3, 5, 119.95, 23.99),
    ('FD0043', 5, 12, 83.88, 6.99),
    ('FD0044', 4, 8, 71.92, 8.99),
    ('FD0208', 14, 10, 129.9, 12.99),
    ('FD0208', 15, 6, 71.94, 11.99),
    ('FD0208', 12, 2, 11.98, 5.99),
    ('FD0209', 13, 5, 24.95, 4.99),
    ('FD0209', 12, 5, 29.95, 5.99),
    ('FD0209', 11, 2, 19.98, 9.99),
    ('FD0109', 6, 2, 25.98, 12.99),
    ('FD0109', 8, 2, 35.98, 17.99),
    ('FD0109', 7, 2, 49.98, 24.99),
    ('FD0109', 9, 2, 43.98, 21.99),
    ('FD0045', 4, 5, 44.95, 8.99),
    ('FD0045', 3, 5, 119.95, 23.99),
    ('FD0045', 5, 5, 34.95, 6.99),
    ('FD1729', 4, 2, 17.98, 8.99),
    ('FD1729', 9, 2, 43.98, 21.99);
-- ============================================================================
-- Verification queries (optional - uncomment to verify data)
-- ============================================================================
-- SELECT COUNT(*) as item_categories_count FROM item_categories; -- Should be 4
-- SELECT COUNT(*) as menu_items_count FROM menu_items; -- Should be 15
-- SELECT COUNT(*) as delivery_address_count FROM delivery_address; -- Should be 16
-- SELECT COUNT(*) as drivers_count FROM drivers; -- Should be 8
-- SELECT COUNT(*) as employees_count FROM employees; -- Should be 7
-- SELECT COUNT(*) as login_credentials_count FROM login_credentials; -- Should be 7
-- SELECT COUNT(*) as orders_count FROM orders; -- Should be 20
-- SELECT COUNT(*) as order_items_count FROM order_items; -- Should be 46 (removed 4 orphaned items: FD7973, FD0959, FD3621)