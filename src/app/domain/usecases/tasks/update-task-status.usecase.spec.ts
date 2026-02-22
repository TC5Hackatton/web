import { TestBed } from "@angular/core/testing";
import { Task } from "../../models/task.model";
import { TaskRepository } from "../../repositories/task.repository";
import { UpdateTaskStatusUseCase } from "./update-task-status.usecase";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  uid: "user-1",
  title: "Tarefa de Teste",
  description: "Descrição",
  timeType: "cronometro",
  timeValue: 100,
  timeSpend: 10,
  status: "todo",
  createdAt: new Date("2024-01-01"),
  ...overrides
});

describe("UpdateTaskStatusUseCase", () => {
  let useCase: UpdateTaskStatusUseCase;
  let repositorySpy: { updateTask: jest.Mock };

  beforeEach(() => {
    repositorySpy = { updateTask: jest.fn().mockResolvedValue(undefined) };

    TestBed.configureTestingModule({
      providers: [UpdateTaskStatusUseCase, { provide: TaskRepository, useValue: repositorySpy }]
    });

    useCase = TestBed.inject(UpdateTaskStatusUseCase);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should set statusChangedAt when moving to 'doing'", async () => {
    const now = new Date("2024-01-01T12:00:00.000Z");
    jest.setSystemTime(now);

    const task = makeTask({ status: "todo" });
    await useCase.execute(task, "doing");

    expect(repositorySpy.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "doing",
        statusChangedAt: now
      })
    );
  });

  it("should accumulate timeSpend when moving from 'doing' to 'done'", async () => {
    const startTime = new Date("2024-01-01T12:00:00.000Z");
    const finishTime = new Date("2024-01-01T12:01:00.000Z"); // 1 minuto depois
    jest.setSystemTime(finishTime);

    const task = makeTask({ status: "doing", timeSpend: 10, statusChangedAt: startTime });
    await useCase.execute(task, "done");

    expect(repositorySpy.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "done",
        timeSpend: 11, // 10 originais + 1 minuto decorrido
        statusChangedAt: undefined
      })
    );
  });

  it("should accumulate timeSpend when pausing (moving from 'doing' to 'todo')", async () => {
    const startTime = new Date("2024-01-01T12:00:00.000Z");
    const pauseTime = new Date("2024-01-01T12:00:30.000Z"); // 30s depois (0.5 min)
    jest.setSystemTime(pauseTime);

    const task = makeTask({ status: "doing", timeSpend: 10, statusChangedAt: startTime });
    await useCase.execute(task, "todo");

    expect(repositorySpy.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "todo",
        timeSpend: 10.5,
        statusChangedAt: undefined
      })
    );
  });

  it("should not change timeSpend if statusChangedAt is missing in 'doing' state", async () => {
    const task = makeTask({ status: "doing", timeSpend: 10, statusChangedAt: undefined });
    await useCase.execute(task, "done");

    expect(repositorySpy.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "done",
        timeSpend: 10 // sem alteração
      })
    );
  });

  it("should round timeSpend to 2 decimal places when leaving 'doing'", async () => {
    const startTime = new Date("2024-01-01T12:00:00.000Z");
    // 13 segundos = 0.2166... minutos → 10 + 0.22 = 10.22
    const finishTime = new Date("2024-01-01T12:00:13.000Z");
    jest.setSystemTime(finishTime);

    const task = makeTask({ status: "doing", timeSpend: 10, statusChangedAt: startTime });
    await useCase.execute(task, "done");

    expect(repositorySpy.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        timeSpend: 10.22
      })
    );
  });
});
