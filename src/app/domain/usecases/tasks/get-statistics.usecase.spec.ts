import { TestBed } from "@angular/core/testing";
import { GetStatisticsUseCase } from "./get-statistics.usecase";
import { TaskRepository } from "../../repositories/task.repository";
import { Task } from "../../models/task.model";

describe("GetStatisticsUseCase", () => {
  let useCase: GetStatisticsUseCase;
  let taskRepositoryMock: jest.Mocked<TaskRepository>;

  const createMockTask = (
    id: string,
    status: "todo" | "doing" | "done",
    createdAt: Date,
    timeSpend = 0
  ) => {
    return Task.create({
      id,
      uid: "user123",
      title: `Task ${id}`,
      timeType: "cronometro",
      timeValue: 30,
      timeSpend,
      status,
      createdAt
    });
  };

  beforeEach(() => {
    taskRepositoryMock = {
      getTasks: jest.fn(),
      addTask: jest.fn(),
      updateTask: jest.fn(),
      getOldestTodoTask: jest.fn()
    } as jest.Mocked<TaskRepository>;

    TestBed.configureTestingModule({
      providers: [GetStatisticsUseCase, { provide: TaskRepository, useValue: taskRepositoryMock }]
    });

    useCase = TestBed.inject(GetStatisticsUseCase);
  });

  it("should calculate statistics correctly", async () => {
    const tasks = [
      createMockTask("1", "todo", new Date("2023-01-02"), 10),
      createMockTask("2", "todo", new Date("2023-01-01"), 20), // Oldest TODO
      createMockTask("3", "doing", new Date("2023-01-03"), 30),
      createMockTask("4", "done", new Date("2023-01-04"), 40),
      createMockTask("5", "done", new Date("2023-01-05"), 50)
    ];

    taskRepositoryMock.getTasks.mockResolvedValue(tasks);

    const result = await useCase.execute();

    expect(result.oldestTask?.id).toBe("2");
    expect(result.taskCounts.total).toBe(5);
    expect(result.taskCounts.todo).toBe(2);
    expect(result.taskCounts.doing).toBe(1);
    expect(result.taskCounts.done).toBe(2);
    expect(result.progress.completed).toBe(2);
    expect(result.progress.total).toBe(5);
    // Total time spend: 10 + 20 + 30 + 40 + 50 = 150 minutes = 2h 30min
    expect(result.totalFocusTime).toBe("2h 30min");
  });

  it("should handle empty task list", async () => {
    taskRepositoryMock.getTasks.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.oldestTask).toBeNull();
    expect(result.taskCounts.total).toBe(0);
    expect(result.totalFocusTime).toBe("0 min");
  });

  it("should format focus time correctly for less than 60 minutes", async () => {
    const tasks = [createMockTask("1", "done", new Date(), 45)];
    taskRepositoryMock.getTasks.mockResolvedValue(tasks);

    const result = await useCase.execute();

    expect(result.totalFocusTime).toBe("45 min");
  });

  it("should format focus time correctly for exact hours", async () => {
    const tasks = [createMockTask("1", "done", new Date(), 120)];
    taskRepositoryMock.getTasks.mockResolvedValue(tasks);

    const result = await useCase.execute();

    expect(result.totalFocusTime).toBe("2h");
  });
});
