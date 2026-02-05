using System;

namespace TheCoffeeCream.Application.Common
{
    public static class EnumUtilities
    {
        public static T ParseEnum<T>(string? value, T defaultValue) where T : struct
        {
            if (string.IsNullOrEmpty(value)) return defaultValue;
            return Enum.TryParse<T>(value, true, out var result) ? result : defaultValue;
        }

        public static T? ParseNullableEnum<T>(string? value) where T : struct
        {
            if (string.IsNullOrEmpty(value)) return null;
            return Enum.TryParse<T>(value, true, out var result) ? result : (T?)null;
        }
    }
}
