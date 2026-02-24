import { TestBed } from "@angular/core/testing";
import { AddTaskUseCase } from "./add-task.usecase";
import { TaskRepository } from "../../repositories/task.repository";

describe("AddTaskUseCase", () => {
  let useCase: AddTaskUseCase;
  let repositorySpy: { addTask: jest.Mock };

  beforeEach(() => {
    repositorySpy = { addTask: jest.fn() };

    TestBed.configureTestingModule({
      providers: [AddTaskUseCase, { provide: TaskRepository, useValue: repositorySpy }]
    });

    useCase = TestBed.inject(AddTaskUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.addTask with correct arguments", async () => {
    const title = "New Task";
    const desc = "Desc";
    const timeType = "tempo_fixo";
    const timeValue = 60;
    const timeSpent = 0;
    const status = "todo";

    await useCase.execute(title, desc, timeType, timeValue, timeSpent, status);

    expect(repositorySpy.addTask).toHaveBeenCalledWith(
      title,
      desc,
      timeType,
      timeValue,
      timeSpent,
      status
    );
  });
});
