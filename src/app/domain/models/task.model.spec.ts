import { Task } from "./task.model";

describe("Task Model", () => {
  const mockParams = {
    id: "1",
    uid: "user123",
    title: "Test Task",
    description: "Description",
    timeType: "cronometro" as const,
    timeValue: 30,
    timeSpend: 10,
    status: "todo" as const,
    createdAt: new Date("2023-01-01T00:00:00Z")
  };

  it("should create a task using static create method", () => {
    const task = Task.create(mockParams);
    expect(task.id).toBe(mockParams.id);
    expect(task.title).toBe(mockParams.title);
    expect(task.status).toBe(mockParams.status);
  });

  it("should create a task using constructor", () => {
    const task = new Task(
      mockParams.id,
      mockParams.uid,
      mockParams.title,
      mockParams.description,
      mockParams.timeType,
      mockParams.timeValue,
      mockParams.timeSpend,
      mockParams.status,
      mockParams.createdAt
    );
    expect(task.id).toBe(mockParams.id);
    expect(task.title).toBe(mockParams.title);
  });

  describe("copyWith", () => {
    it("should return a new task with updated properties", () => {
      const task = Task.create(mockParams);
      const updatedTask = task.copyWith({ title: "Updated Title", status: "doing" });

      expect(updatedTask.title).toBe("Updated Title");
      expect(updatedTask.status).toBe("doing");
      expect(updatedTask.id).toBe(task.id);
      expect(updatedTask.uid).toBe(task.uid);
    });

    it("should handle undefined and null values in copyWith", () => {
      const task = Task.create(mockParams);
      const updatedTask = task.copyWith({ id: undefined, description: undefined });

      expect(updatedTask.id).toBeUndefined();
      expect(updatedTask.description).toBeUndefined();
    });

    it("should keep existing values if not provided in copyWith", () => {
      const task = Task.create(mockParams);
      const updatedTask = task.copyWith({});

      expect(updatedTask).not.toBe(task); // Should be a new instance
      expect(updatedTask.title).toBe(task.title);
      expect(updatedTask.status).toBe(task.status);
    });
  });
});
