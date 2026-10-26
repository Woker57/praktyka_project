using System.ComponentModel.DataAnnotations;
using TaskManager.Api.Models;

namespace TaskManager.Api.Dtos;

public record TaskDto(int Id, string Title, string? Description, string Status, string Priority, DateOnly? DueDate, DateTime CreatedAt, int UserId)
{
    public static TaskDto From(TaskItem task) =>
        new(task.Id, task.Title, task.Description, task.Status, task.Priority, task.DueDate, task.CreatedAt, task.UserId);
}

public record CreateTaskRequest(
    [Required(AllowEmptyStrings = false)] [MaxLength(200)] string Title,
    string? Description,
    [AllowedValues(TaskStatuses.Todo, TaskStatuses.InProgress, TaskStatuses.Done, null)] string? Status,
    [Required] int? UserId,
    [AllowedValues("low", "medium", "high", null)] string? Priority,
    DateOnly? DueDate);

public record UpdateTaskRequest(
    [Required(AllowEmptyStrings = false)] [MaxLength(200)] string Title,
    string? Description,
    [Required] [AllowedValues(TaskStatuses.Todo, TaskStatuses.InProgress, TaskStatuses.Done)] string Status,
    [Required] [AllowedValues("low", "medium", "high")] string Priority,
    DateOnly? DueDate);

public record UpdateStatusRequest(
    [Required] [AllowedValues(TaskStatuses.Todo, TaskStatuses.InProgress, TaskStatuses.Done)] string Status);
