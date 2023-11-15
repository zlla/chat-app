namespace ChatApp.Models.DTO
{
    public class JobOpportunityDTO
    {
        public long JobID { get; set; }
        public string? JobTitle { get; set; }
        public string? JobDescription { get; set; }
        public string? JobRequirements { get; set; }
        public decimal? Salary { get; set; }
        public DateTime PostingDate { get; set; }
        public DateTime ApplicationDeadline { get; set; }
        public string? JobLocation { get; set; }
        public string? IndustryType { get; set; }
        public int? SelectedByAdmin { get; set; }
        public string? LinkImage { get; set; }
    }
}