import { TestBed } from "@angular/core/testing";
import { UpdateTaskStatusUseCase } from "./update-task-status.usecase";
import { TaskRepository } from "../../repositories/task.repository";

describe("UpdateTaskStatusUseCase", () => {
  let useCase: UpdateTaskStatusUseCase;
  let repositorySpy: { updateTaskStatus: jest.Mock };

  beforeEach(() => {
    repositorySpy = { updateTaskStatus: jest.fn() };

    TestBed.configureTestingModule({
      providers: [UpdateTaskStatusUseCase, { provide: TaskRepository, useValue: repositorySpy }]
    });

    useCase = TestBed.inject(UpdateTaskStatusUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.updateTaskStatus", async () => {
    const id = "123";
    const status = "done";
    await useCase.execute(id, status);
    expect(repositorySpy.updateTaskStatus).toHaveBeenCalledWith(id, status);
  });
});
