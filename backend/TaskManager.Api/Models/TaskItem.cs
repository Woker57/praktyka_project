namespace TaskManager.Api.Models;

public class TaskItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Status { get; set; } = TaskStatuses.Todo;

    public string Priority { get; set; } = "medium";
    public DateOnly? DueDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public List<Comment> Comments { get; set; } = [];
}
