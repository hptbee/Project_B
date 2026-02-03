using System.Data;
using Dapper;

namespace TheCoffeeCream.Infrastructure.Data.TypeHandlers
{
    public class DateTimeOffsetTypeHandler : SqlMapper.TypeHandler<DateTimeOffset>
    {
        public override void SetValue(IDbDataParameter parameter, DateTimeOffset value)
        {
            // Postgres TEXT column expects string.
            // Using "O" (ISO 8601) preserves offset: 2026-02-02T14:39:52.0000000+07:00
            parameter.Value = value.ToString("O");
            parameter.DbType = DbType.String; 
        }

        public override DateTimeOffset Parse(object value)
        {
            return DateTimeOffset.Parse(value.ToString()!);
        }
    }
}
