namespace Server.Models.ControllerModels
{
    public class IsRegisteredRequest
    {
        public required long CourseId { get; set; }
    }

    public class RegisterCourseRequest
    {
        public required long CourseId { get; set; }
        public string? Email { get; set; }
        public required string PaymentMethod { get; set; }
        public required string CreditCardNumber { get; set; }
        public required string CVV { get; set; }
        public required DateTime ExpiredDate { get; set; }
    }

    public class RegisterWithCCErrors
    {
        public string? PaymentMethodError { get; set; }
        public string? CreditCardNumberError { get; set; }
        public string? CVVError { get; set; }
        public string? ExpiredDateError { get; set; }
    }

}