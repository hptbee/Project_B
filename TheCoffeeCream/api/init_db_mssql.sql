-- SQL Server Initialization Script

-- Table: Category
IF OBJECT_ID(N'[Category]', N'U') IS NOT NULL DROP TABLE [Category];
CREATE TABLE [Category] (
    [Id] NVARCHAR(450) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(MAX),
    [Rank] INT,
    [IsActive] BIT
);

INSERT INTO [Category] ([Id], [Name], [Rank], [IsActive])
VALUES
('6648dbe7-e96c-4e74-87c9-854747e94ae5', N'Khác', 14, 0),
('ad8147f8-cccf-420f-bc55-d3d2491dfa81', N'Bánh', 7, 0),
('2bfba6b7-c0eb-47dd-a06b-14fda34023ae', N'TOPPING', 13, 0),
('1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', N'Cafe', 1, 0),
('6138ec79-4292-4747-81aa-d0e4d308efda', N'Specialty', 2, 0),
('485e5bd2-e0f6-4a56-9f20-cd1707db60f1', N'Món khác', 9, 0),
('23a13583-3794-4fa1-8704-ba54916dff7d', N'Trending', 8, 0),
('5d49224a-7fd8-436f-a9a7-b04cf681f706', N'Cacao', 4, 0),
('97f21f46-4f5e-4979-8d66-c5e666e50aa4', N'Trà Sữa', 3, 0),
('cf121efe-0380-48eb-82ba-5f26c6f67fab', N'Món Nóng', 10, 0),
('05ab0a7a-8a5c-43d1-93dc-bef44fa28908', N'Latte', 5, 0),
('00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', N'Trà trái cây', 6, 0),
('added61a-03d3-465e-8ebf-9f90b729c2b5', N'Chai hủ', 11, 0),
('a687085b-5ddc-49b5-8724-e94bd31ba54f', N'Nước ngọt', 12, 0);

-- Table: Product
IF OBJECT_ID(N'[Product]', N'U') IS NOT NULL DROP TABLE [Product];
CREATE TABLE [Product] (
    [Id] NVARCHAR(450) NOT NULL PRIMARY KEY,
    [CategoryId] NVARCHAR(450),
    [Code] NVARCHAR(MAX),
    [Name] NVARCHAR(MAX),
    [Cost] INT,
    [Price] INT,
    [ImageUrl] NVARCHAR(MAX),
    [IsActive] BIT,
    [IsTopping] BIT,
    [ToppingMapping] NVARCHAR(MAX),
    CONSTRAINT fk_product_category FOREIGN KEY ([CategoryId]) REFERENCES [Category]([Id])
);

-- Insert Data for Product (Sample subset)
INSERT INTO [Product] ([Id], [CategoryId], [Code], [Name], [Cost], [Price], [ImageUrl], [IsActive], [IsTopping], [ToppingMapping])
VALUES
('ab312563-3889-48a5-a6c6-425fbbf3da53', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00001', N'Cafe đen', 0, 17000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/19ab4aab241840218bd0c37d476e8bc6', 1, 0, 'b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213'),
('90ad4f33-185a-4102-b9e0-4c530b4a8e49', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00002', N'Cafe Sữa', 0, 20000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/fe1eac213aea4d0baa8a5b3fbb77ebf0', 1, 0, 'b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213'),
('b9bd6435-a4f6-4eac-ad5f-adeffaace50a', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00055', N'Size M', 0, 5000, NULL, 1, 1, NULL),
('71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00056', N'Size L', 0, 10000, NULL, 1, 1, NULL);


-- Table: Order
IF OBJECT_ID(N'[Order]', N'U') IS NOT NULL DROP TABLE [Order];
CREATE TABLE [Order] (
    [Id] NVARCHAR(450) NOT NULL PRIMARY KEY,
    [ClientOrderId] NVARCHAR(MAX),
    [CreatedAt] DATETIMEOFFSET,
    [OrderType] NVARCHAR(MAX),
    [TableNumber] INT,
    [PaymentMethod] NVARCHAR(MAX),
    [CashAmount] INT,
    [TransferAmount] INT,
    [DiscountType] NVARCHAR(MAX),
    [DiscountValue] INT,
    [DiscountAmount] INT,
    [SubTotal] INT,
    [Total] INT,
    [Status] NVARCHAR(MAX),
    [Note] NVARCHAR(MAX),
    [IsActive] BIT
);

-- Table: OrderItem
IF OBJECT_ID(N'[OrderItem]', N'U') IS NOT NULL DROP TABLE [OrderItem];
CREATE TABLE [OrderItem] (
    [Id] NVARCHAR(450) NOT NULL PRIMARY KEY,
    [OrderId] NVARCHAR(450),
    [CreatedAt] DATETIMEOFFSET,
    [ProductId] NVARCHAR(450),
    [Name] NVARCHAR(MAX),
    [UnitPrice] INT,
    [Quantity] INT,
    [DiscountType] NVARCHAR(MAX),
    [DiscountValue] INT,
    [DiscountAmount] INT,
    [Total] INT,
    [Toppings] NVARCHAR(MAX),
    [Note] NVARCHAR(MAX),
    [IsActive] BIT,
    CONSTRAINT fk_orderitem_order FOREIGN KEY ([OrderId]) REFERENCES [Order]([Id]),
    CONSTRAINT fk_orderitem_product FOREIGN KEY ([ProductId]) REFERENCES [Product]([Id])
);

-- Table: User
IF OBJECT_ID(N'[User]', N'U') IS NOT NULL DROP TABLE [User];
CREATE TABLE [User] (
    [Id] NVARCHAR(450) NOT NULL PRIMARY KEY,
    [email] NVARCHAR(MAX),
    [username] NVARCHAR(MAX),
    [PasswordHash] NVARCHAR(MAX),
    [Role] NVARCHAR(MAX),
    [IsActive] BIT
);

INSERT INTO [User] ([Id], [email], [username], [PasswordHash], [Role], [IsActive])
VALUES
('1', 'staff@thecoffeecream.com', 'staff', '$2a$11$jg3NjAXxbBVCkOMHcUkWVuwOekndzS5MyHTmtPp8Q8gttwuo2/UaO', 'Staff', 1),
('2', 'admin@thecoffeecream.com', 'admin', '$2a$11$wrTB9bhEyd8jUbxn48anc.vXJ56Z/wu0Gg9zX/UxpuVHVdjsZQwwq', 'Admin', 1);
