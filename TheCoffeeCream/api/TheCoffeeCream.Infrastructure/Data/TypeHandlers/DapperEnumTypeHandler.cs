using System.Data;
using Dapper;

namespace TheCoffeeCream.Infrastructure.Data.TypeHandlers
{
    public class DapperEnumTypeHandler<T> : SqlMapper.TypeHandler<T> where T : struct, Enum
    {
        public override void SetValue(IDbDataParameter parameter, T value)
        {
            parameter.Value = value.ToString();
        }

        public override T Parse(object value)
        {
            if (value == null || value is DBNull) return default;
            return Enum.Parse<T>(value.ToString()!, true);
        }
    }
}
