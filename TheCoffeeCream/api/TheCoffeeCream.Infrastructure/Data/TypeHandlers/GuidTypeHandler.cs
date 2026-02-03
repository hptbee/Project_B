using System.Data;
using Dapper;

namespace TheCoffeeCream.Infrastructure.Data.TypeHandlers
{
    public class GuidTypeHandler : SqlMapper.TypeHandler<Guid>
    {
        public override void SetValue(IDbDataParameter parameter, Guid value)
        {
            // Send Guid as string to match TEXT column type in Postgres
            parameter.Value = value.ToString();
            parameter.DbType = DbType.String;
        }

        public override Guid Parse(object value)
        {
            return Guid.Parse(value.ToString()!);
        }
    }
}
