import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddTaskDialogComponent } from "./add-task-dialog.component";
import { MatDialogRef } from "@angular/material/dialog";
import { AddTaskUseCase } from "../../../domain/usecases/tasks/add-task.usecase";
import { AppSettingsService } from "../../services/app-settings.service";
import { signal } from "@angular/core";

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
  let settingsServiceStub: Partial<AppSettingsService>;

  beforeEach(async () => {
    dialogRefSpy = { close: jest.fn() };
    addTaskUseCaseSpy = { execute: jest.fn().mockResolvedValue(undefined) };
    settingsServiceStub = {
      settings: signal({
        uid: "test-uid",
        appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
        timer: { amount_default: 25, pause_reminder: false },
        notifications: { sound_on: true },
        focus: { hide_done: false, only_current: false },
        accessibility: { animations_decreased: false, simplified_mode: false }
      }) as AppSettingsService["settings"]
    };

    await TestBed.configureTestingModule({
      imports: [AddTaskDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: AddTaskUseCase, useValue: addTaskUseCaseSpy },
        { provide: AppSettingsService, useValue: settingsServiceStub }
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
    component.taskTitle = "  ";
    await component.onAdd();
    expect(addTaskUseCaseSpy.execute).not.toHaveBeenCalled();

    component.taskTitle = "Task 1";
    await component.onAdd();
    expect(addTaskUseCaseSpy.execute).toHaveBeenCalled();
  });

  it("should pre-select timeValue with the Pomodoro default from settings", () => {
    expect(component.timeValue).toBe(25);
  });

  it("should expose the four Pomodoro options", () => {
    expect(component.pomodoroOptions).toEqual([15, 25, 35, 45]);
  });

  it("should call UseCase with timeValue when tipo is tempo_fixo and close dialog", async () => {
    component.taskTitle = "New Task";
    component.taskDescription = "Desc";
    component.timeType = "tempo_fixo";
    component.timeValue = 35;

    await component.onAdd();

    expect(addTaskUseCaseSpy.execute).toHaveBeenCalledWith(
      "New Task",
      "Desc",
      "tempo_fixo",
      35,
      0,
      "todo"
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it("should pass timeValue = 0 when tipo is cronometro", async () => {
    component.taskTitle = "Cronometro Task";
    component.taskDescription = "";
    component.timeType = "cronometro";
    component.timeValue = 45;

    await component.onAdd();

    expect(addTaskUseCaseSpy.execute).toHaveBeenCalledWith(
      "Cronometro Task",
      "",
      "cronometro",
      0,
      0,
      "todo"
    );
  });

  it("should close dialog with false on cancel", () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
