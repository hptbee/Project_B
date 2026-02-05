using FluentAssertions;
using TheCoffeeCream.Application.Common;
using TheCoffeeCream.Domain.Entities;
using Xunit;

namespace TheCoffeeCream.Tests
{
    public class EnumUtilitiesTests
    {
        [Theory]
        [InlineData("DINE_IN", OrderType.DINE_IN)]
        [InlineData("dine_in", OrderType.DINE_IN)]
        [InlineData("TAKE_AWAY", OrderType.TAKE_AWAY)]
        [InlineData("INVALID", OrderType.DINE_IN)]
        [InlineData("", OrderType.DINE_IN)]
        [InlineData(null, OrderType.DINE_IN)]
        public void ParseEnum_ShouldReturnExpectedValue(string? input, OrderType expected)
        {
            // Act
            var result = EnumUtilities.ParseEnum<OrderType>(input, OrderType.DINE_IN);

            // Assert
            result.Should().Be(expected);
        }

        [Theory]
        [InlineData("PERCENTAGE", DiscountType.PERCENTAGE)]
        [InlineData("fixed", DiscountType.FIXED)]
        [InlineData("INVALID", null)]
        [InlineData("", null)]
        [InlineData(null, null)]
        public void ParseNullableEnum_ShouldReturnExpectedValue(string? input, DiscountType? expected)
        {
            // Act
            var result = EnumUtilities.ParseNullableEnum<DiscountType>(input);

            // Assert
            result.Should().Be(expected);
        }
    }
}
