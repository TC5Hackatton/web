import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";
import { provideRouter } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { of } from "rxjs";
import { GetCurrentUserUseCase } from "../../../domain/usecases/get-current-user.usecase";
import { GetStatisticsUseCase } from "../../../domain/usecases/tasks/get-statistics.usecase";
import { UserTaskStatistics } from "../../../domain/models/user-task-statistics.model";

jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("firebase/storage", () => ({ getStorage: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let getStatisticsUseCaseSpy: { execute: jest.Mock };
  let getCurrentUserUseCaseSpy: { execute: jest.Mock };
  let dialogSpy: { open: jest.Mock };

  beforeEach(async () => {
    getStatisticsUseCaseSpy = {
      execute: jest.fn().mockResolvedValue({
        oldestTask: null,
        progress: { completed: 0, total: 0 },
        totalFocusTime: "0 min",
        taskCounts: { todo: 0, doing: 0, done: 0, total: 0 }
      })
    };
    getCurrentUserUseCaseSpy = {
      execute: jest
        .fn()
        .mockReturnValue({ id: "user1", email: "test@example.com", name: "Test User" })
    };

    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null))
      })
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: GetStatisticsUseCase, useValue: getStatisticsUseCaseSpy },
        { provide: GetCurrentUserUseCase, useValue: getCurrentUserUseCaseSpy },
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

  it("should load statistics and user name on init", async () => {
    const mockStatistics: UserTaskStatistics = {
      oldestTask: {
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
      progress: { completed: 1, total: 3 },
      totalFocusTime: "45 min",
      taskCounts: { todo: 1, doing: 1, done: 1, total: 3 }
    };
    getStatisticsUseCaseSpy.execute.mockResolvedValue(mockStatistics);

    await component.loadData();

    expect(component.statistics).toEqual(mockStatistics);
    expect(component.userName).toBe("Test User");
  });

  it("should use email prefix if user name is missing", async () => {
    getCurrentUserUseCaseSpy.execute.mockReturnValue({ email: "john.doe@example.com" });
    await component.loadData();
    expect(component.userName).toBe("john.doe");
  });

  it("should open add task dialog", () => {
    component.openAddTaskDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
