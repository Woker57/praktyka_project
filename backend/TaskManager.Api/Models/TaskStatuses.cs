namespace TaskManager.Api.Models;

// Wartości zgodne z frontendem (frontend/tasks.js).
public static class TaskStatuses
{
    public const string Todo = "todo";
    public const string InProgress = "in_progress";
    public const string Done = "done";

    public static readonly string[] All = [Todo, InProgress, Done];

    public static bool IsValid(string? status) => status is not null && All.Contains(status);
}
