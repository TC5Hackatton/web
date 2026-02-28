import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { provideRouter } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { of } from "rxjs";
import { Task } from "../../../domain/models/task.model";
import { GetCurrentUserUseCase } from "../../../domain/usecases/get-current-user.usecase";
import { GetOldestTodoTaskUseCase } from "../../../domain/usecases/tasks/get-oldest-todo-task.usecase";
import { AppSettingsService } from "../../services/app-settings.service";
import { signal } from "@angular/core";

jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("firebase/storage", () => ({ getStorage: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let getTasksUseCaseSpy: { execute: jest.Mock };
  let getOldestTodoTaskUseCaseSpy: { execute: jest.Mock };
  let getCurrentUserUseCaseSpy: { execute: jest.Mock };
  let dialogSpy: { open: jest.Mock };

  beforeEach(async () => {
    getTasksUseCaseSpy = { execute: jest.fn().mockResolvedValue([]) };
    getOldestTodoTaskUseCaseSpy = { execute: jest.fn().mockResolvedValue(null) };
    getCurrentUserUseCaseSpy = { execute: jest.fn().mockReturnValue({ id: "user1" }) };

    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null))
      })
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: GetTasksUseCase, useValue: getTasksUseCaseSpy },
        { provide: GetOldestTodoTaskUseCase, useValue: getOldestTodoTaskUseCaseSpy },
        { provide: GetCurrentUserUseCase, useValue: getCurrentUserUseCaseSpy },

        {
          provide: AppSettingsService,
          useValue: {
            settings: signal({ appearance: { dark_mode: false } }),
            loadSettings: jest.fn()
          }
        },
        { provide: MatDialog, useValue: dialogSpy },
        provideRouter([])
      ]
    })
      .overrideComponent(DashboardComponent, {
        set: { providers: [{ provide: MatDialog, useValue: dialogSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load tasks and calculate metrics on init", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        uid: "user1",
        title: "Task 1",
        description: "Desc 1",
        status: "todo",
        createdAt: new Date(),
        timeType: "tempo_fixo",
        timeValue: 30,
        timeSpend: 0,
        copyWith: jest.fn()
      },
      {
        id: "2",
        uid: "user1",
        title: "Task 2",
        description: "Desc 2",
        status: "doing",
        createdAt: new Date(),
        timeType: "cronometro",
        timeValue: 0,
        timeSpend: 0,
        copyWith: jest.fn()
      },
      {
        id: "3",
        uid: "user1",
        title: "Task 3",
        description: "Desc 3",
        status: "done",
        createdAt: new Date(),
        timeType: "tempo_fixo",
        timeValue: 15,
        timeSpend: 15,
        copyWith: jest.fn()
      }
    ];
    const mockOldestTask: Task = mockTasks[0];
    getTasksUseCaseSpy.execute.mockResolvedValue(mockTasks);
    getOldestTodoTaskUseCaseSpy.execute.mockResolvedValue(mockOldestTask);

    await component.loadData();

    expect(component.tasks).toEqual(mockTasks);
    expect(component.oldestTask).toEqual(mockOldestTask);
    expect(component.doneTasks).toBe("1/3");
  });

  it("should open add task dialog", () => {
    component.openAddTaskDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
