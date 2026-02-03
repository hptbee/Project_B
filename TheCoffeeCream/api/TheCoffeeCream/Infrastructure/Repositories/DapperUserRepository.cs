using System.Data;
using Dapper;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class DapperUserRepository : IUserRepository
    {
        private readonly DapperContext _context;

        public DapperUserRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(User user)
        {
            var query = @"
                INSERT INTO [User] ([Id], [email], [username], [PasswordHash], [Role], [IsActive])
                VALUES (@Id, @Email, @Username, @PasswordHash, @Role, @IsActive)
            ";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, user);
            }
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            using (var connection = _context.CreateConnection())
            {
                return await connection.QueryAsync<User>("SELECT * FROM [User]");
            }
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            var query = "SELECT * FROM [User] WHERE [Id] = @Id";
            using (var connection = _context.CreateConnection())
            {
                return await connection.QuerySingleOrDefaultAsync<User>(query, new { Id = id });
            }
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            var query = "SELECT * FROM [User] WHERE [username] = @Username"; 
            // Postgres case sensitivity check: 'username' column in init_db is lowercase? 
            // In init_db.sql: "username" TEXT. (Case sensitive if created with quotes). 
            // Correct.
            using (var connection = _context.CreateConnection())
            {
                return await connection.QuerySingleOrDefaultAsync<User>(query, new { Username = username });
            }
        }

        public async Task ToggleActiveAsync(string id)
        {
            var query = "UPDATE [User] SET [IsActive] = [IsActive] ^ 1 WHERE [Id] = @Id";
            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { Id = id });
            }
        }

        public async Task UpdateAsync(User user)
        {
            var query = @"
                UPDATE [User] 
                SET 
                    [email] = @Email, 
                    [username] = @Username, 
                    [PasswordHash] = @PasswordHash, 
                    [Role] = @Role, 
                    [IsActive] = @IsActive 
                WHERE [Id] = @Id
            ";
            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, user);
            }
        }
    }
}
