-- EF Core Re-Seed Script (TheCoffeeCream)

-- Clean existing data just in case
-- (Already done in previous step, but safe to keep)

-- 1. Shop Seed
INSERT INTO [Shop] ([Id], [Code], [Name], [Address], [PhoneNumber], [Email], [LogoUrl], [TaxCode], [SubscriptionPlan], [StartDate], [ExpiryDate], [IsActive], [CreatedAt])
VALUES ('00000000-0000-0000-0000-000000000001', 'DEFAULT', N'The Coffee Cream', N'Default Address', N'0123456789', N'admin@thecoffeecream.com', '', '', 'LIFETIME', SYSDATETIMEOFFSET(), DATEADD(year, 100, SYSDATETIMEOFFSET()), 1, SYSDATETIMEOFFSET());

-- 2. Category Seed
INSERT INTO [Category] ([Id], [ShopId], [Name], [Rank]) VALUES
('6648dbe7-e96c-4e74-87c9-854747e94ae5', '00000000-0000-0000-0000-000000000001', N'Khác', 14),
('ad8147f8-cccf-420f-bc55-d3d2491dfa81', '00000000-0000-0000-0000-000000000001', N'Bánh', 7),
('2bfba6b7-c0eb-47dd-a06b-14fda34023ae', '00000000-0000-0000-0000-000000000001', N'TOPPING', 13),
('1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', '00000000-0000-0000-0000-000000000001', N'Cafe', 1),
('6138ec79-4292-4747-81aa-d0e4d308efda', '00000000-0000-0000-0000-000000000001', N'Specialty', 2),
('485e5bd2-e0f6-4a56-9f20-cd1707db60f1', '00000000-0000-0000-0000-000000000001', N'Món khác', 9),
('23a13583-3794-4fa1-8704-ba54916dff7d', '00000000-0000-0000-0000-000000000001', N'Trending', 8),
('5d49224a-7fd8-436f-a9a7-b04cf681f706', '00000000-0000-0000-0000-000000000001', N'Cacao', 4),
('97f21f46-4f5e-4979-8d66-c5e666e50aa4', '00000000-0000-0000-0000-000000000001', N'Trà Sữa', 3),
('cf121efe-0380-48eb-82ba-5f26c6f67fab', '00000000-0000-0000-0000-000000000001', N'Món Nóng', 10),
('05ab0a7a-8a5c-43d1-93dc-bef44fa28908', '00000000-0000-0000-0000-000000000001', N'Latte', 5),
('00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', '00000000-0000-0000-0000-000000000001', N'Trà trái cây', 6),
('added61a-03d3-465e-8ebf-9f90b729c2b5', '00000000-0000-0000-0000-000000000001', N'Chai hủ', 11),
('a687085b-5ddc-49b5-8724-e94bd31ba54f', '00000000-0000-0000-0000-000000000001', N'Nước ngọt', 12);

-- 3. User Seed
INSERT INTO [User] ([Id], [ShopId], [email], [username], [PasswordHash], [Role], [IsActive]) VALUES
('1', '00000000-0000-0000-0000-000000000001', 'staff@thecoffeecream.com', 'staff', '$2a$11$jg3NjAXxbBVCkOMHcUkWVuwOekndzS5MyHTmtPp8Q8gttwuo2/UaO', 'Staff', 1),
('2', '00000000-0000-0000-0000-000000000001', 'admin@thecoffeecream.com', 'admin', '$2a$11$wrTB9bhEyd8jUbxn48anc.vXJ56Z/wu0Gg9zX/UxpuVHVdjsZQwwq', 'Admin', 1),
('3', '00000000-0000-0000-0000-000000000001', 'superadmin@thecoffeecream.com', 'superadmin', '$2a$11$wrTB9bhEyd8jUbxn48anc.vXJ56Z/wu0Gg9zX/UxpuVHVdjsZQwwq', 'Super_Admin', 1);

-- 4. Product Seed
INSERT INTO [Product] ([Id], [ShopId], [CategoryId], [Code], [Name], [Cost], [Price], [ImageUrl], [IsActive], [IsTopping], [ToppingMapping]) VALUES
('ab312563-3889-48a5-a6c6-425fbbf3da53', '00000000-0000-0000-0000-000000000001', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00001', N'Cafe đen', 0, 17000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/19ab4aab241840218bd0c37d476e8bc6', 1, 0, 'b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213'),
('90ad4f33-185a-4102-b9e0-4c530b4a8e49', '00000000-0000-0000-0000-000000000001', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00002', N'Cafe Sữa', 0, 20000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/fe1eac213aea4d0baa8a5b3fbb77ebf0', 1, 0, 'b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213'),
('7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', '00000000-0000-0000-0000-000000000001', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00003', N'Bạc Xỉu', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/ce1c0465fe06481bbc400829aad976f6', 1, 0, 'bdf0dd62-999e-43a1-ad09-d3c0d4abb209;7c4fc531-5fcd-4892-b505-99815dac20cb'),
('b9bd6435-a4f6-4eac-ad5f-adeffaace50a', '00000000-0000-0000-0000-000000000001', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000055', N'Size M', 0, 5000, '', 1, 1, ''),
('71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', '00000000-0000-0000-0000-000000000001', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000056', N'Size L', 0, 10000, '', 1, 1, ''),
('ec676505-d248-4a18-9cd9-a6958914b713', '00000000-0000-0000-0000-000000000001', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP00065', N'UpSize L', 0, 5000, '', 1, 1, '');

-- (More products could be added, but these are enough for initial verification)
