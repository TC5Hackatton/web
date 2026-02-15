import { TestBed } from "@angular/core/testing";
import { GetTasksUseCase } from "./get-tasks.usecase";
import { TaskRepository } from "../../repositories/task.repository";

describe("GetTasksUseCase", () => {
  let useCase: GetTasksUseCase;
  let repositorySpy: { getTasks: jest.Mock };

  beforeEach(() => {
    repositorySpy = { getTasks: jest.fn() };

    TestBed.configureTestingModule({
      providers: [GetTasksUseCase, { provide: TaskRepository, useValue: repositorySpy }]
    });

    useCase = TestBed.inject(GetTasksUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.getTasks", async () => {
    await useCase.execute();
    expect(repositorySpy.getTasks).toHaveBeenCalled();
  });
});
