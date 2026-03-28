using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheCoffeeCream.Migrations
{
    /// <inheritdoc />
    public partial class MarkCategoriesActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"),
                column: "IsActive",
                value: true);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"),
                column: "IsActive",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("05ab0a7a-8a5c-43d1-93dc-bef44fa28908"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("1d4b6612-5cd7-4c9f-9fda-8209e95da2ae"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("23a13583-3794-4fa1-8704-ba54916dff7d"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("2bfba6b7-c0eb-47dd-a06b-14fda34023ae"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("485e5bd2-e0f6-4a56-9f20-cd1707db60f1"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("5d49224a-7fd8-436f-a9a7-b04cf681f706"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("6138ec79-4292-4747-81aa-d0e4d308efda"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("6648dbe7-e96c-4e74-87c9-854747e94ae5"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("97f21f46-4f5e-4979-8d66-c5e666e50aa4"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("a687085b-5ddc-49b5-8724-e94bd31ba54f"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("ad8147f8-cccf-420f-bc55-d3d2491dfa81"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("added61a-03d3-465e-8ebf-9f90b729c2b5"),
                column: "IsActive",
                value: false);

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: new Guid("cf121efe-0380-48eb-82ba-5f26c6f67fab"),
                column: "IsActive",
                value: false);
        }
    }
}
