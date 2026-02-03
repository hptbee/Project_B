using System.Threading.Tasks;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
