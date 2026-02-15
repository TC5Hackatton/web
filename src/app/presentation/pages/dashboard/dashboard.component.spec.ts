import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { provideRouter } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { of } from "rxjs";
import { Task } from "../../../domain/models/task.model";

// Mock Firebase
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("firebase/storage", () => ({ getStorage: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let getTasksUseCaseSpy: { execute: jest.Mock };
  let dialogSpy: { open: jest.Mock };

  beforeEach(async () => {
    getTasksUseCaseSpy = { execute: jest.fn().mockResolvedValue([]) };
    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null))
      })
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: GetTasksUseCase, useValue: getTasksUseCaseSpy },
        { provide: MatDialog, useValue: dialogSpy },
        provideRouter([])
      ]
    }).compileComponents();

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
        status: "todo",
        createdAt: new Date(),
        timeType: "tempo_fixo",
        timeSpend: 30
      },
      {
        id: "2",
        uid: "user1",
        title: "Task 2",
        status: "doing",
        createdAt: new Date(),
        timeType: "Cronometro",
        timeSpend: 0
      },
      {
        id: "3",
        uid: "user1",
        title: "Task 3",
        status: "done",
        createdAt: new Date(),
        timeType: "tempo_fixo",
        timeSpend: 15
      }
    ];
    getTasksUseCaseSpy.execute.mockResolvedValue(mockTasks);

    await component.loadData();

    expect(component.tasks).toEqual(mockTasks);
    expect(component.todoCount).toBe(1);
    expect(component.doingCount).toBe(1);
    expect(component.doneCount).toBe(1);
  });

  it("should open add task dialog", () => {
    component.openAddTaskDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
