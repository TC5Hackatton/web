import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TasksPage } from "./tasks";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { UpdateTaskStatusUseCase } from "../../../domain/usecases/tasks/update-task-status.usecase";
import { MatDialog } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";

jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("TasksPage", () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;
  let getTasksUseCaseSpy: { execute: jest.Mock };
  let updateTaskStatusUseCaseSpy: { execute: jest.Mock };
  let dialogSpy: { open: jest.Mock };

  beforeEach(async () => {
    getTasksUseCaseSpy = { execute: jest.fn().mockResolvedValue([]) };
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
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load tasks on init", async () => {
    expect(getTasksUseCaseSpy.execute).toHaveBeenCalled();
  });

  it("should open add task dialog", () => {
    component.openAddTaskDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
