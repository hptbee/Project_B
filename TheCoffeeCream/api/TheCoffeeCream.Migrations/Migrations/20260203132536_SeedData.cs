using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TheCoffeeCream.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [OrderItem]");
            migrationBuilder.Sql("DELETE FROM [Order]");
            migrationBuilder.Sql("DELETE FROM [Product]");
            migrationBuilder.Sql("DELETE FROM [Category]");
            migrationBuilder.Sql("DELETE FROM [User]");
            migrationBuilder.Sql("DELETE FROM [Shop]");
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Order",
                columns: new[] { "Id", "CashAmount", "ClientOrderId", "CreatedAt", "DiscountType", "DiscountValue", "IsActive", "Note", "OrderType", "PaymentMethod", "ShopId", "Status", "TableNumber", "TransferAmount" },
                values: new object[,]
                {
                    { new Guid("0bc99059-430e-43f4-a8ee-e498634b7354"), 20000m, new Guid("ad229094-bc9c-4a51-bd2d-f3e9aacf9960"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 11, 9, 583, DateTimeKind.Unspecified).AddTicks(6898), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 0m },
                    { new Guid("1b64331b-0eb7-462f-bbaf-170c5cc41866"), 27000m, new Guid("9330ac5c-2f14-43f6-87e2-853050e92ea4"), new DateTimeOffset(new DateTime(2026, 2, 1, 2, 52, 6, 267, DateTimeKind.Unspecified).AddTicks(9971), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 0m },
                    { new Guid("2dfe3322-f5e8-4dc0-9e50-4ff930eaf036"), 0m, new Guid("ab0b5752-a808-4ba8-8355-272e0ef28080"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 12, 55, 385, DateTimeKind.Unspecified).AddTicks(9409), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "TRANSFER", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 30000m },
                    { new Guid("48018d15-0ef5-40bb-ba37-8c6b574ef11d"), 38000m, new Guid("68f785c6-e67a-483a-b3b9-76a7967d8d94"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 10, 59, 847, DateTimeKind.Unspecified).AddTicks(10), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 0m },
                    { new Guid("5023276e-e38f-45fb-b82f-6aad4abb5c84"), 33000m, new Guid("674390a7-d2ce-4772-9ed7-868f702ee0de"), new DateTimeOffset(new DateTime(2026, 2, 1, 2, 51, 36, 475, DateTimeKind.Unspecified).AddTicks(6926), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 0m },
                    { new Guid("5a1bdc7a-d97e-4dcf-96c5-34d9bbc13f36"), 0m, new Guid("b7e65632-fecd-401d-baf1-a17c8aba290b"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 11, 54, 309, DateTimeKind.Unspecified).AddTicks(3889), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "TRANSFER", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 66000m },
                    { new Guid("79511ba5-3a1d-4554-adbb-98db3022b5d4"), 0m, new Guid("da2e20bb-ab4d-4aaf-ba42-f709b3d8c0e5"), new DateTimeOffset(new DateTime(2026, 2, 2, 12, 34, 28, 0, DateTimeKind.Unspecified), new TimeSpan(0, 7, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "TRANSFER", "00000000-0000-0000-0000-000000000001", "SUCCESS", 1, 162000m },
                    { new Guid("88040bdc-861d-4418-aa55-f254a7a2525b"), 27000m, new Guid("d05e146b-b3d6-47c0-9a49-052d684d35b4"), new DateTimeOffset(new DateTime(2026, 2, 2, 6, 43, 45, 941, DateTimeKind.Unspecified).AddTicks(6375), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 1, 0m },
                    { new Guid("af45f7e3-71cd-4203-8218-f33db17cf37f"), 32000m, new Guid("75c1f412-0dd6-4035-b324-0c3eeb9e83dc"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 13, 7, 9, DateTimeKind.Unspecified).AddTicks(1873), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 0m },
                    { new Guid("b94061e9-d7f8-41a4-8fce-b4083d48d923"), 0m, new Guid("7a7a41bc-4554-42c3-9405-231998299ab3"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 11, 19, 947, DateTimeKind.Unspecified).AddTicks(5490), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "TRANSFER", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 27000m },
                    { new Guid("d369ce93-a94e-4309-8ebd-5a4a48f50223"), 88000m, new Guid("eba284e9-7242-423a-9311-1c44eaaa791e"), new DateTimeOffset(new DateTime(2026, 1, 31, 14, 42, 59, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 1, 0m },
                    { new Guid("e65f17fc-d1c0-4856-91d3-fdbcb8e65fe9"), 38000m, new Guid("17326de9-b394-4ccf-8e46-4f5bce5e8db7"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 10, 12, 294, DateTimeKind.Unspecified).AddTicks(465), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 0m },
                    { new Guid("f01f0f26-1163-4d94-8a28-2877d7f08678"), 31000m, new Guid("219dd05a-6b27-4495-b7a3-953a7960aff6"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 10, 31, 147, DateTimeKind.Unspecified).AddTicks(379), new TimeSpan(0, 0, 0, 0, 0)), "FIXED", 0m, true, "", "DINE_IN", "CASH", "00000000-0000-0000-0000-000000000001", "SUCCESS", 0, 0m }
                });

            migrationBuilder.InsertData(
                table: "Shop",
                columns: new[] { "Id", "Address", "Code", "CreatedAt", "Email", "ExpiryDate", "IsActive", "LogoUrl", "Name", "PhoneNumber", "StartDate", "SubscriptionPlan", "TaxCode" },
                values: new object[] { "00000000-0000-0000-0000-000000000001", "Default Address", "DEFAULT", new DateTimeOffset(new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "admin@thecoffeecream.com", new DateTimeOffset(new DateTime(2124, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), true, "", "The Coffee Cream", "0123456789", new DateTimeOffset(new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "LIFETIME", "" });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "email", "IsActive", "PasswordHash", "Role", "ShopId", "username" },
                values: new object[,]
                {
                    { "1", "staff@thecoffeecream.com", true, "$2a$11$jg3NjAXxbBVCkOMHcUkWVuwOekndzS5MyHTmtPp8Q8gttwuo2/UaO", "Staff", "00000000-0000-0000-0000-000000000001", "staff" },
                    { "2", "admin@thecoffeecream.com", true, "$2a$11$wrTB9bhEyd8jUbxn48anc.vXJ56Z/wu0Gg9zX/UxpuVHVdjsZQwwq", "Admin", "00000000-0000-0000-0000-000000000001", "admin" },
                    { "3", "superadmin@thecoffeecream.com", true, "$2a$11$wrTB9bhEyd8jUbxn48anc.vXJ56Z/wu0Gg9zX/UxpuVHVdjsZQwwq", "Super_Admin", "00000000-0000-0000-0000-000000000001", "superadmin" }
                });

            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "Id", "IsActive", "Name", "Rank", "ShopId" },
                values: new object[,]
                {
                    { new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), false, "Trà trái cây", 6, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"), false, "Latte", 5, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), false, "Cafe", 1, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), false, "Trending", 8, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), false, "TOPPING", 13, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"), false, "Món khác", 9, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"), false, "Cacao", 4, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), false, "Specialty", 2, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), false, "Khác", 14, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), false, "Trà Sữa", 3, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"), false, "Nước ngọt", 12, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), false, "Bánh", 7, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), false, "Chai hủ", 11, "00000000-0000-0000-0000-000000000001" },
                    { new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), false, "Món Nóng", 10, "00000000-0000-0000-0000-000000000001" }
                });

            migrationBuilder.InsertData(
                table: "OrderItem",
                columns: new[] { "Id", "CreatedAt", "DiscountType", "DiscountValue", "IsActive", "Name", "Note", "OrderId", "ProductId", "Quantity", "ShopId", "UnitPrice", "Toppings" },
                values: new object[,]
                {
                    { new Guid("109a5a0e-0a30-426d-b2ec-f742ef01fd15"), new DateTimeOffset(new DateTime(2026, 2, 1, 2, 51, 36, 475, DateTimeKind.Unspecified).AddTicks(6835), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Bạc Xỉu", "", new Guid("5023276e-e38f-45fb-b82f-6aad4abb5c84"), new Guid("7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8"), 1, "00000000-0000-0000-0000-000000000001", 27000m, "Size M - Bạc Xỉu|SP000057|6000|bdf0dd62-999e-43a1-ad09-d3c0d4abb209" },
                    { new Guid("1fb5cb15-4b94-492f-ac57-97ff8c5297a6"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 10, 12, 294, DateTimeKind.Unspecified).AddTicks(390), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Bạc Xỉu Kem Muối", "", new Guid("e65f17fc-d1c0-4856-91d3-fdbcb8e65fe9"), new Guid("0f221ecf-21f6-432c-9503-e0887e55fa9f"), 1, "00000000-0000-0000-0000-000000000001", 33000m, "UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("22e15546-40ca-4d8e-b74b-ee3665a731d7"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 11, 54, 309, DateTimeKind.Unspecified).AddTicks(3834), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe Sữa", "", new Guid("5a1bdc7a-d97e-4dcf-96c5-34d9bbc13f36"), new Guid("90ad4f33-185a-4102-b9e0-4c530b4a8e49"), 1, "00000000-0000-0000-0000-000000000001", 20000m, "Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("253c28e0-fbcf-41b5-b68b-dbe99ebfb9b2"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 12, 55, 385, DateTimeKind.Unspecified).AddTicks(9353), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe Sữa", "", new Guid("2dfe3322-f5e8-4dc0-9e50-4ff930eaf036"), new Guid("90ad4f33-185a-4102-b9e0-4c530b4a8e49"), 1, "00000000-0000-0000-0000-000000000001", 20000m, "Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("2ae9b0d6-ef2d-4069-806f-a5f11e326d9f"), new DateTimeOffset(new DateTime(2026, 2, 1, 2, 52, 6, 267, DateTimeKind.Unspecified).AddTicks(9857), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe đen", "", new Guid("1b64331b-0eb7-462f-bbaf-170c5cc41866"), new Guid("ab312563-3889-48a5-a6c6-425fbbf3da53"), 1, "00000000-0000-0000-0000-000000000001", 17000m, "Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("4565424a-6343-4748-ab78-41174fddb4db"), new DateTimeOffset(new DateTime(2026, 1, 31, 14, 42, 59, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe đen", "", new Guid("d369ce93-a94e-4309-8ebd-5a4a48f50223"), new Guid("ab312563-3889-48a5-a6c6-425fbbf3da53"), 4, "00000000-0000-0000-0000-000000000001", 17000m, "Size M|SP000055|5000|b9bd6435-a4f6-4eac-ad5f-adeffaace50a" },
                    { new Guid("561ffcb9-2ee1-4e4e-8d76-3f959b81f113"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 10, 59, 846, DateTimeKind.Unspecified).AddTicks(9926), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Matcha Latte", "", new Guid("48018d15-0ef5-40bb-ba37-8c6b574ef11d"), new Guid("7be13434-8eca-4794-ba08-f30a1267de37"), 1, "00000000-0000-0000-0000-000000000001", 27000m, "UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("768e8219-e676-416b-8578-75c2ecd9c581"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 11, 9, 583, DateTimeKind.Unspecified).AddTicks(6800), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe Sữa", "", new Guid("0bc99059-430e-43f4-a8ee-e498634b7354"), new Guid("90ad4f33-185a-4102-b9e0-4c530b4a8e49"), 1, "00000000-0000-0000-0000-000000000001", 20000m, "" },
                    { new Guid("7e70a8d9-77da-449f-8123-690a50567211"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 11, 54, 309, DateTimeKind.Unspecified).AddTicks(3819), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe Kem Cafe", "", new Guid("5a1bdc7a-d97e-4dcf-96c5-34d9bbc13f36"), new Guid("6746ceed-0719-43c2-ad21-0eff24b4397d"), 1, "00000000-0000-0000-0000-000000000001", 31000m, "UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("8725529d-9554-469d-9826-78f3d55ee508"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 10, 31, 147, DateTimeKind.Unspecified).AddTicks(280), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe Kem Cafe", "", new Guid("f01f0f26-1163-4d94-8a28-2877d7f08678"), new Guid("6746ceed-0719-43c2-ad21-0eff24b4397d"), 1, "00000000-0000-0000-0000-000000000001", 31000m, "" },
                    { new Guid("b8f1a7c8-c7a8-424e-b4f4-097e51de7e4e"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 11, 19, 947, DateTimeKind.Unspecified).AddTicks(5435), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Bạc Xỉu", "", new Guid("b94061e9-d7f8-41a4-8fce-b4083d48d923"), new Guid("7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8"), 1, "00000000-0000-0000-0000-000000000001", 27000m, "" },
                    { new Guid("d0f4bcb6-91dd-4ace-aeab-186cdc7ee79e"), new DateTimeOffset(new DateTime(2026, 2, 2, 12, 34, 28, 0, DateTimeKind.Unspecified), new TimeSpan(0, 7, 0, 0, 0)), null, 0m, true, "Cafe đen", "", new Guid("79511ba5-3a1d-4554-adbb-98db3022b5d4"), new Guid("ab312563-3889-48a5-a6c6-425fbbf3da53"), 6, "00000000-0000-0000-0000-000000000001", 17000m, "Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("dd91d0a5-9697-4f04-910a-a15a90db1f84"), new DateTimeOffset(new DateTime(2026, 2, 2, 6, 43, 45, 941, DateTimeKind.Unspecified).AddTicks(6293), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Cafe đen", "", new Guid("88040bdc-861d-4418-aa55-f254a7a2525b"), new Guid("ab312563-3889-48a5-a6c6-425fbbf3da53"), 1, "00000000-0000-0000-0000-000000000001", 17000m, "Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("ec6fef75-4d87-4f1d-8730-95ab563bd5e7"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 13, 7, 9, DateTimeKind.Unspecified).AddTicks(1819), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Matcha Latte", "", new Guid("af45f7e3-71cd-4203-8218-f33db17cf37f"), new Guid("7be13434-8eca-4794-ba08-f30a1267de37"), 1, "00000000-0000-0000-0000-000000000001", 27000m, "UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("ee55d594-89e4-4ec1-a73c-7ff9e4977509"), new DateTimeOffset(new DateTime(2026, 2, 1, 3, 10, 59, 846, DateTimeKind.Unspecified).AddTicks(9943), new TimeSpan(0, 0, 0, 0, 0)), null, 0m, true, "Trân châu đường đen", "", new Guid("48018d15-0ef5-40bb-ba37-8c6b574ef11d"), new Guid("9060af17-9a7c-494c-8f53-99ecc77bf60f"), 1, "00000000-0000-0000-0000-000000000001", 6000m, "" }
                });

            migrationBuilder.InsertData(
                table: "Product",
                columns: new[] { "Id", "CategoryId", "Code", "Cost", "ImageUrl", "IsActive", "IsTopping", "Name", "Price", "ShopId", "ToppingMapping" },
                values: new object[,]
                {
                    { new Guid("00440a8a-46fb-4fe7-a84d-b394c0366172"), new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"), "SP-00032", 0m, "", true, false, "Cacao Kem Cafe", 36000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("007183c7-8fba-43b9-adfc-238a63dd7df9"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP000077", 0m, "", true, false, "Cà phê sữa nóng", 27000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("0e411c9e-fbac-4659-95be-1a28ffcd9d0b"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000068", 0m, "", true, false, "Ly giấy", 3000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("0f221ecf-21f6-432c-9503-e0887e55fa9f"), new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), "SP-00012", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/a0b0997b4aaa4026b3de092157d07ada", true, false, "Bạc Xỉu Kem Muối", 33000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("10a54543-8afb-4df1-b5be-0f0758d8c5b2"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP-00016", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/6b83f3e2d4124d6db7a48318a781b18f", true, false, "Trà Sữa mật ong", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("114895a2-9db4-418b-a6a5-fb9533ed31df"), new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), "SP-00010", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/a49d48e0e6c942cbae719df06d813b30", true, false, "Cafe Kem Muối", 31000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("128ee0a0-58cd-4a8c-9c16-669bb13bd317"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP000009", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/09/cafehuynhvanbanh/images/6082d7c94b344534b80f0fd0ade5931a", true, false, "Trà Đào", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("12e75a1d-1983-4333-b58b-8eebb68da485"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00019", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/b59d3298b28e4b11a450fb0446b2cb59", true, false, "Trà Cam Dâu Tây", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("145744cd-189c-4d0d-bf57-c0331c497e31"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000098", 10m, "", true, false, "Bánh Tráng Hành Phi", 7000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("146a5cc5-aa57-43fc-af71-ffe66ac47385"), new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), "SP-00013", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/72987776a81b4a9f8729fb34963ba3bc", true, false, "Bạc Xỉu Kem Trứng", 33000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("14c0d157-1153-4755-9482-f6896439347c"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP-00004", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/875d769b87e9444dbda8739141004e14", true, false, "Sữa tươi Cafe", 27000m, "00000000-0000-0000-0000-000000000001", "71bcd18c-4a4b-4bf8-98d6-f4b8b4817213;b9bd6435-a4f6-4eac-ad5f-adeffaace50a" },
                    { new Guid("16e3dacf-e433-49ae-b018-ffcffabe4cf1"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00056", 0m, "", true, false, "Hủ Kem Muối", 80000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("17035377-5532-4444-b1b0-f44ce78d3322"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000071", 0m, "", true, false, "Thuốc lá Sài Gòn Bạc", 18000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("19118b14-781c-482f-820c-838585e41cce"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00068", 0m, "", true, true, "Kem Trứng", 16000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("1a31f823-fa6b-41bf-bf1e-c72673cf5624"), new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"), "SP-00044", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/4580383fc3314938808909b090b7cd86", true, false, "Bánh que Kem Trứng", 25000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("1f2a0019-95d9-4cbc-80db-5c40d165bce6"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP000019", 26m, "", true, false, "Trà sữa khoai môn", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("208ad30c-ffd2-49e4-95f8-99de88bbf2c0"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00023", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/97a461f0ec254bdaa5b04b0459b197ef", true, false, "Trà Long Nhãn", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("20b5778c-cb09-4194-8fc8-ea900d1abab9"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000067", 0m, "", true, true, "Pha máy", 2000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("211bf531-1fa8-4902-924d-30d29bb07dfc"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP-00060", 0m, "", true, true, "Đào", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("233410ca-66b9-47a4-8a55-8f98850282ec"), new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"), "SP000049", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2025/05/cafehuynhvanbanh/images/ec9f31efa56f43d1af435a24b65232aa", true, false, "Matcha Latte Dâu", 27000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("28218217-be9b-4554-89e0-cee61a074ea9"), new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), "SP-00011", 0m, "", true, false, "Bạc Xỉu Kem Cafe", 33000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("282208c6-3989-4ef8-a2cf-d91a9a1e80b2"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00061", 0m, "", true, true, "Nhãn", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("295cb803-d8b6-4579-bb50-0596b2e11ad4"), new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"), "SP-00048", 0m, "", true, false, "Sting", 14000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("29ca5d65-3974-4719-9d99-7e9b7d7a2e30"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000097", 0m, "", true, false, "Trân Châu Hoàng Kim", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("2c9db8fd-3005-4bc0-b976-e50e6b2d1795"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00017", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/05deadc4d0ab428681745606b557afec", true, true, "Trà Tắc", 16000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("2d73c896-8bf7-4bcc-b034-20310b5dfea3"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00057", 0m, "", true, false, "Hủ Kem Cafe", 80000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("2f929c03-306a-4c1a-b6ee-a56f55d51a6b"), new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"), "SP-00033", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/a341dd57e8ab480ab88f0fadeec6807b", true, false, "Cacao Kem Muối", 36000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("30c8b484-b8c2-4184-a2fa-e7395f9fdf7b"), new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"), "SP-00037", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/fce52367fa334836a28b190b5ba79ddf", true, false, "Cam Vắt", 21000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("34c2a734-a92f-46c2-b5d9-25496f80f0b3"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP000075", 0m, "", true, false, "Cà phê nóng", 19000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("387a4034-7f4e-4a8d-9efc-a2753025a0db"), new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"), "SP-00049", 0m, "", true, false, "Nước suối", 8000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("3cb55a6b-7101-48ad-abb9-a32308b36939"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000066", 8m, "", true, false, "bánh snack", 8000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("404a6736-9040-440e-a572-6c890c0637b1"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP000052", 0m, "", true, false, "Sữa tươi cf nóng", 29000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("427f6159-bfe5-45be-a214-ef7809e4500d"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP-00031", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/e5717957817a4f1b8c78f02925a52217", true, false, "Cacao Nóng", 29000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("455b33bb-9306-4f5e-b28d-35d311e58339"), new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"), "SP-00050", 0m, "", true, false, "Coca/Pepsi", 14000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("4686c33c-dc50-4b14-8c07-7def6e5f5b3a"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000025", 0m, "", true, false, "Matcha Sữa Hạt", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("4778f715-539c-4f26-834e-ff4c2d2d317c"), new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"), "SP-00043", 0m, "", true, false, "Bánh que Kem Cafe", 26000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("4daf624d-ee1e-4c1a-9b56-f74ba3c98e00"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP000007", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/09/cafehuynhvanbanh/images/5aee77c786294f9182352e7533574ea7", true, false, "Bạc xỉu nóng", 29000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("4f18ac42-4bbf-4e41-9302-498f8b78d097"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP000051", 0m, "", true, false, "Khoai môn Latte Nóng", 29000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("4faa1638-1017-487a-b32c-2b26750d4991"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP000020", 26m, "", true, false, "Trà sữa matcha", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("5003f111-aebc-49b9-b2f2-ea314fc6f3f1"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000073", 0m, "", true, false, "Tắc mật ong nóng", 23000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("50f636b8-378b-45e5-a8c1-b4938544257e"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP000037", 0m, "", true, false, "Trà Gừng Nóng", 20000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("5fdcb4e2-a2c9-49dd-979e-4d2208ed51ba"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP00020", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/acc839cd12e443618e156ded79f5fdd4", true, false, "Trà Dâu", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("6133f30a-d55f-4960-a0a0-472861fa4b82"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000028", 32m, "", true, false, "Khoai Môn Sữa Hạt", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("65b38984-b052-455c-81e9-737f45f88f24"), new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"), "SP-00046", 0m, "", true, false, "C2 - Boncha - Olong", 14000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("6667ab35-f248-4309-8c72-55438246246b"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00052", 0m, "", true, false, "Hủ Kem Trứng", 80000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("6746ceed-0719-43c2-ad21-0eff24b4397d"), new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), "SP-00009", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/129c9eea1df84867ada63f5eb7a63ea2", true, false, "Cafe Kem Cafe", 31000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("6ba76c7d-41a4-4fc3-9314-6dcae92de859"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000031", 5m, "", true, false, "Trà đá", 5000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("6d447ba0-ef3d-4b24-b761-c4fb2e2fa48d"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00024", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/bcacad82215e40c492a8ab3594354851", true, false, "Trà Việt Quất", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("6ee6f009-54f8-4f50-8510-24fc5a4f8303"), new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"), "SP-00034", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/8677b562142c4458ab20797b15f5df01", true, false, "Cacao Kem Trứng", 36000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("706a36cb-dbf3-420e-9dc0-a214d1c3691e"), new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"), "SP000016", 0m, "", true, false, "Cacao Latte", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("71bcd18c-4a4b-4bf8-98d6-f4b8b4817213"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000056", 0m, "", true, true, "Size L", 10000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("7985c414-63ac-436c-91b6-cd312cfac0a6"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP000023", 0m, "", true, false, "Matcha Latte Nóng", 29000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("7b18d1e8-b500-47fd-8d31-3e3f73462367"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000050", 0m, "", true, false, "Trà đá đường dằn 10ml cf", 10000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("7be13434-8eca-4794-ba08-f30a1267de37"), new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"), "SP000014", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2025/05/cafehuynhvanbanh/images/d82cd8a409c24907975c885baded0acd", true, false, "Matcha Latte", 27000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("7c4fc531-5fcd-4892-b505-99815dac20cb"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000058", 0m, "", true, true, "Size L - Bạc Xỉu", 12000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("7da34025-08ac-4874-8e1b-8e6531a13069"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP-00063", 0m, "", true, false, "Tẩy đá", 2000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("7e651fc8-3601-45a0-9fa0-550c4cf5724b"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000047", 0m, "", true, false, "Xì ke", 12000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP-00003", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/ce1c0465fe06481bbc400829aad976f6", true, false, "Bạc Xỉu", 27000m, "00000000-0000-0000-0000-000000000001", "bdf0dd62-999e-43a1-ad09-d3c0d4abb209;7c4fc531-5fcd-4892-b505-99815dac20cb" },
                    { new Guid("7ec520df-3415-4219-9805-de907b24f626"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000006", 0m, "", true, false, "Cafe sữa gấu", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("7fc72b45-adf1-44d6-b2bf-d93af275dd01"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00062", 0m, "", true, true, "Vải", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("833c5666-83f1-4612-b64d-36fc42605a50"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP-00015", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/6344aa1d2e0a4ba28db518b161999233", true, false, "Trà Sữa bạc hà", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("87b9f742-5e2a-4ced-8102-ad0787555a23"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP-00006", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/1355e61f546c43b88e762d1da6d3d406", true, false, "Cafe Sữa Dừa", 27000m, "00000000-0000-0000-0000-000000000001", "b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("8a45f672-854e-4660-955d-96dabd6a30c8"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000008", 0m, "", true, false, "Lon Sữa Gấu bán lẻ", 16000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("8b78b57c-c14d-453f-951c-d4f9f4c6b947"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP000035", 0m, "", true, false, "Olong Lài Sữa", 28000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("8c0840dd-c8cd-4a38-bc28-fd594db4773a"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00022", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/c9cb45cb233346538f3e0c99f115d13d", true, false, "Trà Cam Đào Nhài", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("9060af17-9a7c-494c-8f53-99ecc77bf60f"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00069", 0m, "", true, true, "Trân châu đường đen", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("90ad4f33-185a-4102-b9e0-4c530b4a8e49"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP-00002", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/fe1eac213aea4d0baa8a5b3fbb77ebf0", true, false, "Cafe Sữa", 20000m, "00000000-0000-0000-0000-000000000001", "b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("911cc8b5-144c-42b8-b51a-ad42a21d096a"), new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"), "SP-00035", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/daec0ce07ce64ae6ac0e6d7cc3a8b906", true, false, "Cacao topping", 36000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("91c24d16-e899-4890-b746-8175c4f7ca81"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00014", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/2dc975c2c4844d3bab18d33dfcfe88ab", true, false, "Trà Tắc mật ong", 21000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("9218e983-dd30-436c-9eef-4de76e7d40e1"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000069", 0m, "", true, false, "Thuốc lá 3 số bạc", 28000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("9241f243-efc9-4f4d-8b93-cda314fc12a7"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000041", 8m, "", true, false, "Bánh Tráng Dẻo Khô Gà", 7000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("9510f1d2-0576-4129-aca5-e4e354b95a02"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000091", 0m, "", true, false, "Đậu phộng", 4000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("96c25787-d618-4e62-a462-ced4a309bcfa"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP-00005", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/6c1975985b3a400aa9fb3aa55cb4987f", true, false, "Sữa tươi Cafe bạc hà", 27000m, "00000000-0000-0000-0000-000000000001", "71bcd18c-4a4b-4bf8-98d6-f4b8b4817213;b9bd6435-a4f6-4eac-ad5f-adeffaace50a" },
                    { new Guid("9884c88a-fc64-450e-ba7b-2268d7647286"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP000022", 0m, "", true, false, "Cacao latte Nóng", 29000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("9bde306e-a812-4335-a35d-9e37d09eed16"), new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"), "SP000017", 0m, "", true, false, "Khoai Môn Latte", 27000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("9e21e714-0035-4447-83d5-0ef1a762801c"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP-00029", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/55b97d8141a143f48504ddbde6f830d8", true, false, "Trà Sữa Kem Trứng", 31000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("9f2c80d0-7f69-4d63-87bb-34e85313e6a9"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00072", 0m, "", true, true, "Dâu", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("a19e6312-94fc-45a7-8d2f-06c42d7e23ba"), new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"), "SP000054", 35m, "", true, false, "Cacao sữa dừa kem trứng", 36000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("a1e103b8-2a0e-4a8d-a9d2-f1e4aa3e3523"), new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"), "SP000072", 0m, "", true, false, "Trà Gạo Rang Machiato", 28000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("a5ffc906-f201-4c8c-815a-26d0bb31f9e7"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000060", 36m, "", true, false, "Matcha Gấu Dâu", 36000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("ab312563-3889-48a5-a6c6-425fbbf3da53"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP-00001", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/19ab4aab241840218bd0c37d476e8bc6", true, false, "Cafe đen", 17000m, "00000000-0000-0000-0000-000000000001", "b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213" },
                    { new Guid("afe1a263-2aaa-4a8d-99e8-3310b8286f22"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000093", 0m, "", true, false, "Bánh Tráng khô Bò", 7000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b02a9a82-88a9-496c-b2e9-acce68133be8"), new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"), "SP000005", 0m, "", true, false, "Sữa Tươi Trân Châu Đường Đen", 31000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b02b3f35-afa1-4e11-b5d8-cd0efbeec1c3"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00071", 0m, "", true, true, "Trân châu trắng", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b15b2e56-01bf-480a-b40f-f80cb84ccff7"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP-00064", 0m, "", true, false, "Bánh que thêm", 10000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b254080b-879d-4239-8461-cabf3ddc63b1"), new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), "SP-00008", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/c65e76bc509f4b34a55cbbf951ac8465", true, false, "Cafe Kem Trứng", 31000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("b2665338-4d54-41ba-a9ea-c6f80ece03db"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000070", 0m, "", true, false, "Thuốc lá 3 số thường", 18000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b3a1f3a7-8eb0-4d0a-ae24-89aa164ce5b6"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00053", 0m, "", true, false, "Chai Cafe Kem Muối 500ml", 150000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b67f41a3-8896-42c8-87c7-b5732fb1388f"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00055", 0m, "", true, false, "Chai Cafe Kem Muối 250ml", 80000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b6a5c2ba-a68f-4d0a-97cf-e9ae53a818bc"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00027", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/51c1c3530f5a48bfb7a94ba66f2fb9d0", true, false, "Trà Vải", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("b71d8749-4482-423e-8d50-c64175cefe27"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000092", 0m, "", true, false, "Socola", 4000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("b9bd6435-a4f6-4eac-ad5f-adeffaace50a"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000055", 0m, "", true, true, "Size M", 5000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("bb88ac8d-7fe9-4b87-81fd-6872cb5fcbdf"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000013", 35m, "", true, false, "Cacao sữa gấu", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("bdf0dd62-999e-43a1-ad09-d3c0d4abb209"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000057", 0m, "", true, true, "Size M - Bạc Xỉu", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("be2f1018-c45c-4a8f-9fca-3faef620de52"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00021", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/3d32a355018f40be90e5fbaf741af686", true, false, "Trà Dâu Đào Nhài", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("c1cfd26a-6f15-4b24-ade0-d9a27d15f2a5"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000061", 10m, "", true, false, "áo mưa", 10000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("c44f061f-091b-4a8b-8938-d9953394f77f"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000033", 0m, "", true, false, "Cà phê bột", 10000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("c81c2167-fd27-466d-a956-566418001890"), new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"), "SP-00047", 0m, "", true, false, "Bò húc", 15000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("cb856642-aea9-4725-b56d-80579409f353"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00058", 0m, "", true, false, "Chai Cafe Kem Trứng 250ML", 80000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("cbf166c3-e277-45c9-b6ea-735914b94fea"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP000024", 20m, "", true, false, "Trà Sữa Truyền Thống", 21000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("ccd1e85e-75d5-44d4-b716-e141ea11d9d2"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00018", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/337ada042073495dace75e8118499b3f", true, false, "Trà Bí Đao Hạt Chia", 16000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("d1bed7bb-2deb-4086-b380-48afed37d365"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000040", 8m, "", true, false, "BT Muối Tắc - Sa Tế Hồng Hạnh", 10000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("d21d7c76-1f6d-417b-bdb5-305d0f651214"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00051", 0m, "", true, false, "Chai Cafe Kem Trứng - 500ml", 150000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("d2e2aef1-25fb-4a80-8475-ca1e9eb37499"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00067", 0m, "", true, true, "Kem Cafe", 16000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("d3069ed2-2fd4-4834-8855-5e88b0db9c58"), new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"), "SP-00054", 0m, "", true, false, "Chai Cafe Kem Cafe 500ml", 150000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("d34f81b6-7fe4-43f3-baea-560bc3e185b5"), new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"), "SP000048", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2025/05/cafehuynhvanbanh/images/26cd66b9b4ef41e0a267084915ad60eb", true, false, "Matcha Latte Đào", 27000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("d3be58c8-2245-4343-9858-0ea661f45c5d"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00070", 0m, "", true, true, "Thạch Cafe", 6000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("d44db9fd-1b4d-4f36-a35e-c9fca970c349"), new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"), "SP000059", 19m, "", true, false, "Cà Phê Kem Vip", 40000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("d57b2b4a-d47f-4814-8aaf-a2e900b30dce"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP000012", 0m, "", true, false, "Hạt chia", 2000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("d5e81e81-c3c3-4062-bc49-e593a59fcbbd"), new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"), "SP000038", 12m, "", true, false, "BT Muối bò - Sa Tế", 10000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("dbfa31a8-b73e-4d54-8cc0-b52486218d45"), new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"), "SP000032", 0m, "", true, false, "Cà phê sữa cốt dừa nóng", 25000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("dc5413f1-75cc-48d6-8631-556fa4a074a5"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000086", 0m, "", true, false, "thuốc malu 20k", 20000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("dce87e70-908c-450e-bb38-650e3bf42f5a"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000027", 0m, "", true, false, "Cà Phê Sữa Hạt", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("e26ec092-0bd2-4234-b53e-2c3814947f4d"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000026", 0m, "", true, false, "Cacao sữa hạt", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("e399ac78-d443-4b4c-b864-2b84b7bae3a9"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00066", 0m, "", true, true, "Kem Muối", 16000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("e420babb-5f14-4ab0-aede-33f0c9b1575d"), new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"), "SP000083", 0m, "", true, false, "Hột quẹt", 5000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("e6bd85b9-496e-4822-9579-507e473bcbd4"), new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"), "SP-00042", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/7ff345f76db342b89c77069079442d68", true, false, "Cam xí muội", 35000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("e8bec0cb-bf7b-4a99-9869-159eaa1a4188"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000021", 0m, "", true, false, "Khoai Môn Sữa Gấu", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("eb047eea-b3cf-4324-9a97-6fec1fabb126"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP-00030", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/757ebd134e654615959a0b9cd516a97c", true, false, "Trà Sữa Trân Châu", 26000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("ec676505-d248-4a18-9cd9-a6958914b713"), new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"), "SP00065", 0m, "", true, true, "UpSize L", 5000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("f0375bb2-4de4-4c3e-aecb-a2f9f657524e"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP-00059", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/53f5642fb646499a9c5fd5e27dfab2b6", true, false, "Gói cafe 500 gram", 115000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("f1cbce95-25d3-4024-a0d3-a7e9c1c22752"), new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"), "SP-00045", 0m, "", true, false, "Bánh que Kem Muối", 26000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("f5de696e-6723-4573-934f-739001501fec"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP-00026", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/d7f1cf37b2bd44dab943a46579f858c3", true, false, "Trà Sữa Kem Muối", 31000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("f780a926-c1f9-4441-82ff-f098dc2d5a56"), new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"), "SP000053", 0m, "", true, false, "Olong gạo rang", 28000m, "00000000-0000-0000-0000-000000000001", "ec676505-d248-4a18-9cd9-a6958914b713" },
                    { new Guid("f93222da-7a28-48d2-b9b4-39bd8095edea"), new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"), "SP000015", 0m, "", true, false, "Matcha Sữa Gấu", 33000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("f9f47107-cc85-4f79-a034-f8af086de65c"), new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"), "SP-00028", 0m, "https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/892f5479d0e64fc2a43b5c9af40e6dfc", true, false, "Trà đào cam sả", 35000m, "00000000-0000-0000-0000-000000000001", "" },
                    { new Guid("fccbca47-b3df-4ba0-aa03-1a3ba874263f"), new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"), "SP000045", 0m, "", true, false, "Cà Phê Matcha", 27000m, "00000000-0000-0000-0000-000000000001", "" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("109a5a0e-0a30-426d-b2ec-f742ef01fd15"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("1fb5cb15-4b94-492f-ac57-97ff8c5297a6"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("22e15546-40ca-4d8e-b74b-ee3665a731d7"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("253c28e0-fbcf-41b5-b68b-dbe99ebfb9b2"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("2ae9b0d6-ef2d-4069-806f-a5f11e326d9f"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("4565424a-6343-4748-ab78-41174fddb4db"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("561ffcb9-2ee1-4e4e-8d76-3f959b81f113"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("768e8219-e676-416b-8578-75c2ecd9c581"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("7e70a8d9-77da-449f-8123-690a50567211"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("8725529d-9554-469d-9826-78f3d55ee508"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("b8f1a7c8-c7a8-424e-b4f4-097e51de7e4e"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("d0f4bcb6-91dd-4ace-aeab-186cdc7ee79e"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("dd91d0a5-9697-4f04-910a-a15a90db1f84"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("ec6fef75-4d87-4f1d-8730-95ab563bd5e7"));

            migrationBuilder.DeleteData(
                table: "OrderItem",
                keyColumn: "Id",
                keyValue: new Guid("ee55d594-89e4-4ec1-a73c-7ff9e4977509"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("00440a8a-46fb-4fe7-a84d-b394c0366172"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("007183c7-8fba-43b9-adfc-238a63dd7df9"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("0e411c9e-fbac-4659-95be-1a28ffcd9d0b"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("0f221ecf-21f6-432c-9503-e0887e55fa9f"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("10a54543-8afb-4df1-b5be-0f0758d8c5b2"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("114895a2-9db4-418b-a6a5-fb9533ed31df"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("128ee0a0-58cd-4a8c-9c16-669bb13bd317"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("12e75a1d-1983-4333-b58b-8eebb68da485"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("145744cd-189c-4d0d-bf57-c0331c497e31"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("146a5cc5-aa57-43fc-af71-ffe66ac47385"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("14c0d157-1153-4755-9482-f6896439347c"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("16e3dacf-e433-49ae-b018-ffcffabe4cf1"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("17035377-5532-4444-b1b0-f44ce78d3322"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("19118b14-781c-482f-820c-838585e41cce"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("1a31f823-fa6b-41bf-bf1e-c72673cf5624"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("1f2a0019-95d9-4cbc-80db-5c40d165bce6"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("208ad30c-ffd2-49e4-95f8-99de88bbf2c0"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("20b5778c-cb09-4194-8fc8-ea900d1abab9"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("211bf531-1fa8-4902-924d-30d29bb07dfc"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("233410ca-66b9-47a4-8a55-8f98850282ec"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("28218217-be9b-4554-89e0-cee61a074ea9"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("282208c6-3989-4ef8-a2cf-d91a9a1e80b2"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("295cb803-d8b6-4579-bb50-0596b2e11ad4"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("29ca5d65-3974-4719-9d99-7e9b7d7a2e30"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("2c9db8fd-3005-4bc0-b976-e50e6b2d1795"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("2d73c896-8bf7-4bcc-b034-20310b5dfea3"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("2f929c03-306a-4c1a-b6ee-a56f55d51a6b"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("30c8b484-b8c2-4184-a2fa-e7395f9fdf7b"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("34c2a734-a92f-46c2-b5d9-25496f80f0b3"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("387a4034-7f4e-4a8d-9efc-a2753025a0db"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("3cb55a6b-7101-48ad-abb9-a32308b36939"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("404a6736-9040-440e-a572-6c890c0637b1"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("427f6159-bfe5-45be-a214-ef7809e4500d"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("455b33bb-9306-4f5e-b28d-35d311e58339"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("4686c33c-dc50-4b14-8c07-7def6e5f5b3a"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("4778f715-539c-4f26-834e-ff4c2d2d317c"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("4daf624d-ee1e-4c1a-9b56-f74ba3c98e00"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("4f18ac42-4bbf-4e41-9302-498f8b78d097"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("4faa1638-1017-487a-b32c-2b26750d4991"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("5003f111-aebc-49b9-b2f2-ea314fc6f3f1"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("50f636b8-378b-45e5-a8c1-b4938544257e"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("5fdcb4e2-a2c9-49dd-979e-4d2208ed51ba"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("6133f30a-d55f-4960-a0a0-472861fa4b82"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("65b38984-b052-455c-81e9-737f45f88f24"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("6667ab35-f248-4309-8c72-55438246246b"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("6746ceed-0719-43c2-ad21-0eff24b4397d"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("6ba76c7d-41a4-4fc3-9314-6dcae92de859"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("6d447ba0-ef3d-4b24-b761-c4fb2e2fa48d"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("6ee6f009-54f8-4f50-8510-24fc5a4f8303"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("706a36cb-dbf3-420e-9dc0-a214d1c3691e"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("71bcd18c-4a4b-4bf8-98d6-f4b8b4817213"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7985c414-63ac-436c-91b6-cd312cfac0a6"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7b18d1e8-b500-47fd-8d31-3e3f73462367"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7be13434-8eca-4794-ba08-f30a1267de37"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7c4fc531-5fcd-4892-b505-99815dac20cb"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7da34025-08ac-4874-8e1b-8e6531a13069"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7e651fc8-3601-45a0-9fa0-550c4cf5724b"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7ec520df-3415-4219-9805-de907b24f626"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("7fc72b45-adf1-44d6-b2bf-d93af275dd01"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("833c5666-83f1-4612-b64d-36fc42605a50"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("87b9f742-5e2a-4ced-8102-ad0787555a23"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("8a45f672-854e-4660-955d-96dabd6a30c8"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("8b78b57c-c14d-453f-951c-d4f9f4c6b947"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("8c0840dd-c8cd-4a38-bc28-fd594db4773a"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9060af17-9a7c-494c-8f53-99ecc77bf60f"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("90ad4f33-185a-4102-b9e0-4c530b4a8e49"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("911cc8b5-144c-42b8-b51a-ad42a21d096a"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("91c24d16-e899-4890-b746-8175c4f7ca81"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9218e983-dd30-436c-9eef-4de76e7d40e1"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9241f243-efc9-4f4d-8b93-cda314fc12a7"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9510f1d2-0576-4129-aca5-e4e354b95a02"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("96c25787-d618-4e62-a462-ced4a309bcfa"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9884c88a-fc64-450e-ba7b-2268d7647286"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9bde306e-a812-4335-a35d-9e37d09eed16"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9e21e714-0035-4447-83d5-0ef1a762801c"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("9f2c80d0-7f69-4d63-87bb-34e85313e6a9"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("a19e6312-94fc-45a7-8d2f-06c42d7e23ba"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("a1e103b8-2a0e-4a8d-a9d2-f1e4aa3e3523"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("a5ffc906-f201-4c8c-815a-26d0bb31f9e7"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("ab312563-3889-48a5-a6c6-425fbbf3da53"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("afe1a263-2aaa-4a8d-99e8-3310b8286f22"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b02a9a82-88a9-496c-b2e9-acce68133be8"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b02b3f35-afa1-4e11-b5d8-cd0efbeec1c3"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b15b2e56-01bf-480a-b40f-f80cb84ccff7"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b254080b-879d-4239-8461-cabf3ddc63b1"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b2665338-4d54-41ba-a9ea-c6f80ece03db"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b3a1f3a7-8eb0-4d0a-ae24-89aa164ce5b6"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b67f41a3-8896-42c8-87c7-b5732fb1388f"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b6a5c2ba-a68f-4d0a-97cf-e9ae53a818bc"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b71d8749-4482-423e-8d50-c64175cefe27"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("b9bd6435-a4f6-4eac-ad5f-adeffaace50a"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("bb88ac8d-7fe9-4b87-81fd-6872cb5fcbdf"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("bdf0dd62-999e-43a1-ad09-d3c0d4abb209"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("be2f1018-c45c-4a8f-9fca-3faef620de52"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("c1cfd26a-6f15-4b24-ade0-d9a27d15f2a5"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("c44f061f-091b-4a8b-8938-d9953394f77f"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("c81c2167-fd27-466d-a956-566418001890"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("cb856642-aea9-4725-b56d-80579409f353"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("cbf166c3-e277-45c9-b6ea-735914b94fea"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("ccd1e85e-75d5-44d4-b716-e141ea11d9d2"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d1bed7bb-2deb-4086-b380-48afed37d365"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d21d7c76-1f6d-417b-bdb5-305d0f651214"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d2e2aef1-25fb-4a80-8475-ca1e9eb37499"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d3069ed2-2fd4-4834-8855-5e88b0db9c58"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d34f81b6-7fe4-43f3-baea-560bc3e185b5"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d3be58c8-2245-4343-9858-0ea661f45c5d"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d44db9fd-1b4d-4f36-a35e-c9fca970c349"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d57b2b4a-d47f-4814-8aaf-a2e900b30dce"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("d5e81e81-c3c3-4062-bc49-e593a59fcbbd"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("dbfa31a8-b73e-4d54-8cc0-b52486218d45"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("dc5413f1-75cc-48d6-8631-556fa4a074a5"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("dce87e70-908c-450e-bb38-650e3bf42f5a"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("e26ec092-0bd2-4234-b53e-2c3814947f4d"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("e399ac78-d443-4b4c-b864-2b84b7bae3a9"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("e420babb-5f14-4ab0-aede-33f0c9b1575d"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("e6bd85b9-496e-4822-9579-507e473bcbd4"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("e8bec0cb-bf7b-4a99-9869-159eaa1a4188"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("eb047eea-b3cf-4324-9a97-6fec1fabb126"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("ec676505-d248-4a18-9cd9-a6958914b713"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("f0375bb2-4de4-4c3e-aecb-a2f9f657524e"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("f1cbce95-25d3-4024-a0d3-a7e9c1c22752"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("f5de696e-6723-4573-934f-739001501fec"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("f780a926-c1f9-4441-82ff-f098dc2d5a56"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("f93222da-7a28-48d2-b9b4-39bd8095edea"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("f9f47107-cc85-4f79-a034-f8af086de65c"));

            migrationBuilder.DeleteData(
                table: "Product",
                keyColumn: "Id",
                keyValue: new Guid("fccbca47-b3df-4ba0-aa03-1a3ba874263f"));

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "3");

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"));

            migrationBuilder.DeleteData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("0bc99059-430e-43f4-a8ee-e498634b7354"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("1b64331b-0eb7-462f-bbaf-170c5cc41866"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("2dfe3322-f5e8-4dc0-9e50-4ff930eaf036"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("48018d15-0ef5-40bb-ba37-8c6b574ef11d"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("5023276e-e38f-45fb-b82f-6aad4abb5c84"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("5a1bdc7a-d97e-4dcf-96c5-34d9bbc13f36"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("79511ba5-3a1d-4554-adbb-98db3022b5d4"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("88040bdc-861d-4418-aa55-f254a7a2525b"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("af45f7e3-71cd-4203-8218-f33db17cf37f"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("b94061e9-d7f8-41a4-8fce-b4083d48d923"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("d369ce93-a94e-4309-8ebd-5a4a48f50223"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("e65f17fc-d1c0-4856-91d3-fdbcb8e65fe9"));

            migrationBuilder.DeleteData(
                table: "Order",
                keyColumn: "Id",
                keyValue: new Guid("f01f0f26-1163-4d94-8a28-2877d7f08678"));

            migrationBuilder.DeleteData(
                table: "Shop",
                keyColumn: "Id",
                keyValue: "00000000-0000-0000-0000-000000000001");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Category");
        }
    }
}
