using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheCoffeeCream.Migrations
{
    /// <inheritdoc />
    public partial class AddShopTaxFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ServiceChargeRate",
                table: "Shop",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SurchargeRate",
                table: "Shop",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "VatRate",
                table: "Shop",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "Shop",
                keyColumn: "Id",
                keyValue: "00000000-0000-0000-0000-000000000001",
                columns: new[] { "ServiceChargeRate", "SurchargeRate", "VatRate" },
                values: new object[] { 0m, 0m, 0m });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceChargeRate",
                table: "Shop");

            migrationBuilder.DropColumn(
                name: "SurchargeRate",
                table: "Shop");

            migrationBuilder.DropColumn(
                name: "VatRate",
                table: "Shop");
        }
    }
}
