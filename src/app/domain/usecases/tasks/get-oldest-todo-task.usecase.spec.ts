import { TestBed } from "@angular/core/testing";
import { Task } from "../../models/task.model";
import { TaskRepository } from "../../repositories/task.repository";
import { GetOldestTodoTaskUseCase } from "./get-oldest-todo-task.usecase";

describe("GetOldestTodoTaskUseCase", () => {
  let useCase: GetOldestTodoTaskUseCase;
  let repositorySpy: { getOldestTodoTask: jest.Mock };

  beforeEach(() => {
    repositorySpy = { getOldestTodoTask: jest.fn() };

    TestBed.configureTestingModule({
      providers: [GetOldestTodoTaskUseCase, { provide: TaskRepository, useValue: repositorySpy }]
    });

    useCase = TestBed.inject(GetOldestTodoTaskUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.getOldestTodoTask", async () => {
    const mockTask: Task = {
      id: "1",
      uid: "user-1",
      title: "Tarefa antiga",
      description: "Primeira tarefa",
      timeType: "cronometro",
      timeValue: 30,
      timeSpend: 0,
      status: "todo",
      createdAt: new Date("2024-01-01")
    };
    repositorySpy.getOldestTodoTask.mockResolvedValue(mockTask);

    const result = await useCase.execute();

    expect(repositorySpy.getOldestTodoTask).toHaveBeenCalled();
    expect(result).toEqual(mockTask);
  });

  it("should return null when no todo tasks exist", async () => {
    repositorySpy.getOldestTodoTask.mockResolvedValue(null);

    const result = await useCase.execute();

    expect(result).toBeNull();
  });
});
