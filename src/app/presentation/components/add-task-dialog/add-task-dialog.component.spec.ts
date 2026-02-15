import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddTaskDialogComponent } from "./add-task-dialog.component";
import { MatDialogRef } from "@angular/material/dialog";
import { AddTaskUseCase } from "../../../domain/usecases/tasks/add-task.usecase";

// Mock Firebase
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("firebase/storage", () => ({ getStorage: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("AddTaskDialogComponent", () => {
  let component: AddTaskDialogComponent;
  let fixture: ComponentFixture<AddTaskDialogComponent>;
  let dialogRefSpy: { close: jest.Mock };
  let addTaskUseCaseSpy: { execute: jest.Mock };

  beforeEach(async () => {
    dialogRefSpy = { close: jest.fn() };
    addTaskUseCaseSpy = { execute: jest.fn().mockResolvedValue(undefined) };

    await TestBed.configureTestingModule({
      imports: [AddTaskDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: AddTaskUseCase, useValue: addTaskUseCaseSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should verify mandatory fields", async () => {
    component.taskTitle = "  "; // empty
    await component.onAdd();
    expect(addTaskUseCaseSpy.execute).not.toHaveBeenCalled();

    component.taskTitle = "Task 1";
    await component.onAdd();
    expect(addTaskUseCaseSpy.execute).toHaveBeenCalled();
  });

  it("should call UseCase and close dialog on valid submission", async () => {
    component.taskTitle = "New Task";
    component.taskDescription = "Desc";
    component.timeType = "tempo_fixo";
    component.timeSpent = 60;

    await component.onAdd();

    expect(addTaskUseCaseSpy.execute).toHaveBeenCalledWith(
      "New Task",
      "Desc",
      "tempo_fixo",
      60,
      "todo"
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it("should close dialog with false on cancel", () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
