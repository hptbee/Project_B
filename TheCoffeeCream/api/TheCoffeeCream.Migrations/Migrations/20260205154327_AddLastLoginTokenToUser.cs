using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheCoffeeCream.Migrations
{
    /// <inheritdoc />
    public partial class AddLastLoginTokenToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LastLoginToken",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");


            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: "1",
                column: "LastLoginToken",
                value: "");

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: "2",
                column: "LastLoginToken",
                value: "");

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: "3",
                column: "LastLoginToken",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginToken",
                table: "User");

        }
    }
}
