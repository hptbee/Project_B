namespace TheCoffeeCream.Application.DTOs
{
    public class UserResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = "Staff";
        public bool IsActive { get; set; } = true;
    }

    public class UserUpsertRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string Role { get; set; } = "Staff";
        public bool IsActive { get; set; } = true;
    }
}
