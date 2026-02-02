using System;

namespace TheCoffeeCream.Application.DTOs
{
    public class UpdatePaymentMethodRequest
    {
        public string PaymentMethod { get; set; } = "CASH";
        public decimal CashAmount { get; set; }
        public decimal TransferAmount { get; set; }
    }
}
