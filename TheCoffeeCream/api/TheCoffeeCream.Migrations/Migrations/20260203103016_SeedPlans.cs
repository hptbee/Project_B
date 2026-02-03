using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TheCoffeeCream.Migrations
{
    /// <inheritdoc />
    public partial class SeedPlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Plan",
                columns: new[] { "Id", "Code", "Description", "DurationDays", "IsActive", "Name", "Price" },
                values: new object[,]
                {
                    { "1", "TRIAL_15_DAYS", "Free trial for new users", 15, true, "Trial (15 Days)", 0m },
                    { "2", "BASIC_30_DAYS", "Basic monthly subscription", 30, true, "Basic (30 Days)", 500000m },
                    { "3", "PREMIUM_6_MONTHS", "Premium half-year subscription", 180, true, "Premium (6 Months)", 2500000m },
                    { "4", "PREMIUM_1_YEAR", "Premium annual subscription", 365, true, "Premium (1 Year)", 4500000m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Plan",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "Plan",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "Plan",
                keyColumn: "Id",
                keyValue: "3");

            migrationBuilder.DeleteData(
                table: "Plan",
                keyColumn: "Id",
                keyValue: "4");
        }
    }
}
