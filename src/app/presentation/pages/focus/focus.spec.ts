import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FocusPage } from "./focus";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { UpdateTaskStatusUseCase } from "../../../domain/usecases/tasks/update-task-status.usecase";
import { MatDialog } from "@angular/material/dialog";
import { provideRouter } from "@angular/router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { AppSettingsService } from "../../services/app-settings.service";
import { computed, NO_ERRORS_SCHEMA, signal } from "@angular/core";
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

const makeSettingsServiceSpy = (focusOverrides: object = {}) => {
  const settingsSignal = signal({
    appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
    timer: { amount_default: 25, pause_reminder: false },
    notifications: { sound_on: true },
    focus: { hide_done: false, only_current: false, ...focusOverrides },
    accessibility: { animations_decreased: false, simplified_mode: false }
  });
  return {
    settings: settingsSignal,
    focusSettings: computed(() => settingsSignal().focus),
    updateAppearance: jest.fn(),
    updateTimer: jest.fn(),
    updateNotifications: jest.fn(),
    updateAccessibility: jest.fn(),
    updateFocus: jest.fn()
  };
};

describe("FocusPage", () => {
  let component: FocusPage;
  let fixture: ComponentFixture<FocusPage>;
  let getTasksUseCaseSpy: { execute: jest.Mock };
  let updateTaskStatusUseCaseSpy: { execute: jest.Mock };
  let dialogSpy: { open: jest.Mock };
  let settingsServiceSpy: ReturnType<typeof makeSettingsServiceSpy>;

  const TASKS = {
    todo: makeTask({ id: "t1", status: "todo", title: "Fazer" }),
    doing: makeTask({ id: "t2", status: "doing", title: "Fazendo" }),
    done: makeTask({ id: "t3", status: "done", title: "Feito" })
  };

  const setupModule = async (focusOverrides: object = {}) => {
    getTasksUseCaseSpy = {
      execute: jest.fn().mockResolvedValue([TASKS.todo, TASKS.doing, TASKS.done])
    };
    updateTaskStatusUseCaseSpy = { execute: jest.fn().mockResolvedValue(undefined) };
    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null))
      })
    };
    settingsServiceSpy = makeSettingsServiceSpy(focusOverrides);

    await TestBed.configureTestingModule({
      imports: [FocusPage, NoopAnimationsModule],
      providers: [
        { provide: AppSettingsService, useValue: settingsServiceSpy },
        { provide: GetTasksUseCase, useValue: getTasksUseCaseSpy },
        { provide: UpdateTaskStatusUseCase, useValue: updateTaskStatusUseCaseSpy },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(FocusPage, {
        set: { providers: [{ provide: MatDialog, useValue: dialogSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(FocusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  describe("Criação", () => {
    beforeEach(async () => setupModule());

    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize todo, doing and done signals", () => {
      expect(component.todo).toBeDefined();
      expect(component.doing).toBeDefined();
      expect(component.done).toBeDefined();
    });

    it("should expose focusMode from settingsService", () => {
      expect(component.focusMode).toBeDefined();
      expect(component.focusMode()).toEqual({ hide_done: false, only_current: false });
    });
  });

  describe("focusMode", () => {
    it("should reflect hide_done: true when set in settings", async () => {
      await setupModule({ hide_done: true, only_current: false });
      expect(component.focusMode().hide_done).toBe(true);
    });

    it("should reflect only_current: true when set in settings", async () => {
      await setupModule({ hide_done: false, only_current: true });
      expect(component.focusMode().only_current).toBe(true);
    });

    it("should reflect both flags false by default", async () => {
      await setupModule();
      expect(component.focusMode().hide_done).toBe(false);
      expect(component.focusMode().only_current).toBe(false);
    });
  });

  describe("loadTasks()", () => {
    beforeEach(async () => setupModule());

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

    it("should handle multiple tasks with the same status", async () => {
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

    it("should reload tasks correctly after a status update", async () => {
      // Substitui o mock para simular nova distribuição após uma mudança de status
      const updatedTasks = [
        makeTask({ id: "t2", status: "doing", title: "Fazendo" }),
        makeTask({ id: "t3", status: "done", title: "Feito" })
      ];
      getTasksUseCaseSpy.execute.mockResolvedValue(updatedTasks);

      await component.loadTasks();

      expect(component.todo().length).toBe(0);
      expect(component.doing().length).toBe(1);
      expect(component.done().length).toBe(1);
    });
  });

  describe("openAddTaskDialog()", () => {
    beforeEach(async () => setupModule());

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

    it("should NOT reload tasks when dialog closes with false", async () => {
      dialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });

      component.openAddTaskDialog();
      await fixture.whenStable();

      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe("onStart()", () => {
    beforeEach(async () => setupModule());

    it("should call updateTaskStatusUseCase with status 'doing'", async () => {
      await component.onStart(TASKS.todo);
      expect(updateTaskStatusUseCaseSpy.execute).toHaveBeenCalledWith(TASKS.todo, "doing");
    });

    it("should reload tasks after calling onStart", async () => {
      const callsBefore = getTasksUseCaseSpy.execute.mock.calls.length;
      await component.onStart(TASKS.todo);
      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(callsBefore + 1);
    });

    it("should update the doing signal after onStart", async () => {
      getTasksUseCaseSpy.execute.mockResolvedValue([
        makeTask({ id: "t1", status: "doing", title: "Agora fazendo" })
      ]);
      await component.onStart(TASKS.todo);
      expect(component.doing()[0].title).toBe("Agora fazendo");
    });
  });

  describe("onFinish()", () => {
    beforeEach(async () => setupModule());

    it("should call updateTaskStatusUseCase with status 'done'", async () => {
      await component.onFinish(TASKS.doing);
      expect(updateTaskStatusUseCaseSpy.execute).toHaveBeenCalledWith(TASKS.doing, "done");
    });

    it("should reload tasks after calling onFinish", async () => {
      const callsBefore = getTasksUseCaseSpy.execute.mock.calls.length;
      await component.onFinish(TASKS.doing);
      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(callsBefore + 1);
    });

    it("should update the done signal after onFinish", async () => {
      getTasksUseCaseSpy.execute.mockResolvedValue([
        makeTask({ id: "t2", status: "done", title: "Finalizada" })
      ]);
      await component.onFinish(TASKS.doing);
      expect(component.done()[0].title).toBe("Finalizada");
    });
  });

  describe("onPause()", () => {
    beforeEach(async () => setupModule());

    it("should call updateTaskStatusUseCase with status 'todo'", async () => {
      await component.onPause(TASKS.doing);
      expect(updateTaskStatusUseCaseSpy.execute).toHaveBeenCalledWith(TASKS.doing, "todo");
    });

    it("should reload tasks after calling onPause", async () => {
      const callsBefore = getTasksUseCaseSpy.execute.mock.calls.length;
      await component.onPause(TASKS.doing);
      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(callsBefore + 1);
    });

    it("should move task back to todo signal after onPause", async () => {
      getTasksUseCaseSpy.execute.mockResolvedValue([
        makeTask({ id: "t2", status: "todo", title: "Pausada" })
      ]);
      await component.onPause(TASKS.doing);
      expect(component.todo()[0].title).toBe("Pausada");
      expect(component.doing().length).toBe(0);
    });
  });

  describe("drop()", () => {
    beforeEach(async () => setupModule());

    it("should NOT call updateTaskStatusUseCase when dropping within the same container", () => {
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

    it("should call updateTaskStatusUseCase when dropping to a different container", async () => {
      const taskWithId = makeTask({ id: "drag-task", status: "todo" });
      const srcData = [taskWithId];
      const destData: Task[] = [];

      const previousContainer = { id: "todo", data: srcData } as unknown as CdkDragDrop<
        Task[]
      >["container"];
      const container = { id: "doing", data: destData } as unknown as CdkDragDrop<
        Task[]
      >["container"];

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

    it("should call updateTaskStatusUseCase with the correct new status", async () => {
      const taskWithId = makeTask({ id: "drag-task", status: "todo" });
      const srcData = [taskWithId];
      const destData: Task[] = [];

      const previousContainer = { id: "todo", data: srcData } as unknown as CdkDragDrop<
        Task[]
      >["container"];
      const container = { id: "done", data: destData } as unknown as CdkDragDrop<
        Task[]
      >["container"];

      const event = {
        previousContainer,
        container,
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<Task[]>;

      component.drop(event);
      await fixture.whenStable();

      const [, status] = updateTaskStatusUseCaseSpy.execute.mock.calls[0];
      expect(status).toBe("done");
    });

    it("should NOT call updateTaskStatusUseCase when the task has no id", () => {
      const taskWithoutId = makeTask({ id: undefined, status: "todo" });
      const srcData = [taskWithoutId];
      const destData: Task[] = [];

      const previousContainer = { id: "todo", data: srcData } as unknown as CdkDragDrop<
        Task[]
      >["container"];
      const container = { id: "doing", data: destData } as unknown as CdkDragDrop<
        Task[]
      >["container"];

      const event = {
        previousContainer,
        container,
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<Task[]>;

      component.drop(event);
      expect(updateTaskStatusUseCaseSpy.execute).not.toHaveBeenCalled();
    });

    it("should reload tasks after a successful cross-container drop", async () => {
      const taskWithId = makeTask({ id: "drag-task", status: "todo" });
      const srcData = [taskWithId];
      const destData: Task[] = [];

      const previousContainer = { id: "todo", data: srcData } as unknown as CdkDragDrop<
        Task[]
      >["container"];
      const container = { id: "doing", data: destData } as unknown as CdkDragDrop<
        Task[]
      >["container"];

      const event = {
        previousContainer,
        container,
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<Task[]>;

      const callsBefore = getTasksUseCaseSpy.execute.mock.calls.length;
      component.drop(event);
      await fixture.whenStable();

      expect(getTasksUseCaseSpy.execute).toHaveBeenCalledTimes(callsBefore + 1);
    });
  });
});
