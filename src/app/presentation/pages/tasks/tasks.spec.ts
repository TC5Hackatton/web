import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TasksPage } from "./tasks";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { UpdateTaskStatusUseCase } from "../../../domain/usecases/tasks/update-task-status.usecase";
import { MatDialog } from "@angular/material/dialog";
import { provideRouter } from "@angular/router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { AppSettingsService } from "../../services/app-settings.service";
import { signal, NO_ERRORS_SCHEMA } from "@angular/core";
import { Task } from "../../../domain/models/task.model";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

const makeTask = (overrides: Partial<Task> = {}): Task =>
  Task.create({
    id: "task-id-1",
    uid: "user-123",
    title: "Tarefa de teste",
    description: "Descrição",
    timeType: "cronometro",
    timeValue: 1500,
    timeSpend: 0,
    status: "todo",
    createdAt: new Date("2024-01-01"),
    ...overrides
  });

const makeAppSettingsMock = () => ({
  focusSettings: signal({ hide_done: false, only_current: false }),
  updateFocus: jest.fn()
});

describe("TasksPage", () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;
  let getTasksUseCaseSpy: { execute: jest.Mock };
  let updateTaskStatusUseCaseSpy: { execute: jest.Mock };
  let dialogSpy: { open: jest.Mock };

  const TASKS = {
    todo: makeTask({ id: "t1", status: "todo", title: "Fazer" }),
    doing: makeTask({ id: "t2", status: "doing", title: "Fazendo" }),
    done: makeTask({ id: "t3", status: "done", title: "Feito" })
  };

  beforeEach(async () => {
    getTasksUseCaseSpy = {
      execute: jest.fn().mockResolvedValue([TASKS.todo, TASKS.doing, TASKS.done])
    };
    updateTaskStatusUseCaseSpy = { execute: jest.fn().mockResolvedValue(undefined) };
    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null))
      })
    };

    await TestBed.configureTestingModule({
      imports: [TasksPage, NoopAnimationsModule],
      providers: [
        { provide: GetTasksUseCase, useValue: getTasksUseCaseSpy },
        { provide: UpdateTaskStatusUseCase, useValue: updateTaskStatusUseCaseSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: AppSettingsService, useValue: makeAppSettingsMock() },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(TasksPage, {
        set: { providers: [{ provide: MatDialog, useValue: dialogSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => jest.clearAllMocks());
  describe("Criação", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should start with empty signals before loadTasks resolves", () => {
      expect(component.todo).toBeDefined();
      expect(component.doing).toBeDefined();
      expect(component.done).toBeDefined();
    });
  });

  describe("loadTasks()", () => {
    it("should call getTasksUseCase on init", () => {
      expect(getTasksUseCaseSpy.execute).toHaveBeenCalled();
    });

    it("should separate tasks by status into the correct signals", async () => {
      await component.loadTasks();
      expect(component.todo().length).toBe(1);
      expect(component.todo()[0].title).toBe("Fazer");

      expect(component.doing().length).toBe(1);
      expect(component.doing()[0].title).toBe("Fazendo");

      expect(component.done().length).toBe(1);
      expect(component.done()[0].title).toBe("Feito");
    });

    it("should set all signals to empty when there are no tasks", async () => {
      getTasksUseCaseSpy.execute.mockResolvedValue([]);
      await component.loadTasks();

      expect(component.todo()).toEqual([]);
      expect(component.doing()).toEqual([]);
      expect(component.done()).toEqual([]);
    });

    it("should handle multiple tasks in the same status", async () => {
      const todos = [
        makeTask({ id: "a", status: "todo" }),
        makeTask({ id: "b", status: "todo" }),
        makeTask({ id: "c", status: "todo" })
      ];
      getTasksUseCaseSpy.execute.mockResolvedValue(todos);
      await component.loadTasks();

      expect(component.todo().length).toBe(3);
      expect(component.doing().length).toBe(0);
      expect(component.done().length).toBe(0);
    });
  });

  describe("openAddTaskDialog()", () => {
    it("should open the dialog", () => {
      component.openAddTaskDialog();
      expect(dialogSpy.open).toHaveBeenCalled();
    });

    it("should open the dialog with width 400px", () => {
      component.openAddTaskDialog();
      const [, config] = dialogSpy.open.mock.calls[0];
      expect(config).toEqual({ width: "400px" });
    });

    it("should reload tasks when dialog closes with a truthy result", async () => {
      dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) });
      getTasksUseCaseSpy.execute.mockResolvedValue([]);

      component.openAddTaskDialog();
      await fixture.whenStable();

      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(2);
    });

    it("should NOT reload tasks when dialog closes with a falsy result", async () => {
      dialogSpy.open.mockReturnValue({ afterClosed: () => of(null) });

      component.openAddTaskDialog();
      await fixture.whenStable();

      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe("onStart()", () => {
    it("should call updateTaskStatusUseCase with status 'doing'", async () => {
      await component.onStart(TASKS.todo);
      expect(updateTaskStatusUseCaseSpy.execute).toHaveBeenCalledWith(TASKS.todo, "doing");
    });

    it("should reload tasks after calling onStart", async () => {
      const callsBefore = getTasksUseCaseSpy.execute.mock.calls.length;
      await component.onStart(TASKS.todo);
      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(callsBefore + 1);
    });
  });

  describe("onFinish()", () => {
    it("should call updateTaskStatusUseCase with status 'done'", async () => {
      await component.onFinish(TASKS.doing);
      expect(updateTaskStatusUseCaseSpy.execute).toHaveBeenCalledWith(TASKS.doing, "done");
    });

    it("should reload tasks after calling onFinish", async () => {
      const callsBefore = getTasksUseCaseSpy.execute.mock.calls.length;
      await component.onFinish(TASKS.doing);
      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(callsBefore + 1);
    });
  });

  describe("onPause()", () => {
    it("should call updateTaskStatusUseCase with status 'todo'", async () => {
      await component.onPause(TASKS.doing);
      expect(updateTaskStatusUseCaseSpy.execute).toHaveBeenCalledWith(TASKS.doing, "todo");
    });

    it("should reload tasks after calling onPause", async () => {
      const callsBefore = getTasksUseCaseSpy.execute.mock.calls.length;
      await component.onPause(TASKS.doing);
      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(callsBefore + 1);
    });
  });

  describe("drop()", () => {
    it("should call moveItemInArray when dropping within the same container", () => {
      const data = [TASKS.todo];
      const container = { id: "todo", data } as unknown as CdkDragDrop<Task[]>["container"];
      const event = {
        previousContainer: container,
        container,
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<Task[]>;

      component.drop(event);
      expect(updateTaskStatusUseCaseSpy.execute).not.toHaveBeenCalled();
    });

    it("should call updateTaskStatusUseCase and reload when dropping to a different container", async () => {
      const taskWithId = makeTask({ id: "task-with-id", status: "todo" });
      const srcData = [taskWithId];
      const destData: Task[] = [];

      const previousContainer = {
        id: "todo",
        data: srcData
      } as unknown as CdkDragDrop<Task[]>["container"];

      const container = {
        id: "doing",
        data: destData
      } as unknown as CdkDragDrop<Task[]>["container"];

      const event = {
        previousContainer,
        container,
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<Task[]>;

      component.drop(event);
      await fixture.whenStable();

      expect(updateTaskStatusUseCaseSpy.execute).toHaveBeenCalled();
    });

    it("should NOT call updateTaskStatusUseCase when task has no id", () => {
      const taskWithoutId = makeTask({ id: undefined, status: "todo" });
      const srcData = [taskWithoutId];
      const destData: Task[] = [];

      const previousContainer = {
        id: "todo",
        data: srcData
      } as unknown as CdkDragDrop<Task[]>["container"];

      const container = {
        id: "doing",
        data: destData
      } as unknown as CdkDragDrop<Task[]>["container"];

      const event = {
        previousContainer,
        container,
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<Task[]>;

      component.drop(event);
      expect(updateTaskStatusUseCaseSpy.execute).not.toHaveBeenCalled();
    });
  });
});
