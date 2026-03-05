import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FocusPage } from "./focus";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { UpdateTaskStatusUseCase } from "../../../domain/usecases/tasks/update-task-status.usecase";
import { MatDialog } from "@angular/material/dialog";
import { provideRouter } from "@angular/router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { AppSettingsService } from "../../services/app-settings.service";
import { signal, computed } from "@angular/core";

jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("FocusPage", () => {
  let component: FocusPage;
  let fixture: ComponentFixture<FocusPage>;
  let getTasksUseCaseSpy: { execute: jest.Mock };
  let updateTaskStatusUseCaseSpy: { execute: jest.Mock };
  let dialogSpy: { open: jest.Mock };
  let settingsServiceSpy: {
    settings: ReturnType<typeof signal<unknown>>;
    focusSettings: ReturnType<typeof computed>;
    updateAppearance: jest.Mock;
    updateTimer: jest.Mock;
    updateNotifications: jest.Mock;
    updateAccessibility: jest.Mock;
    updateFocus: jest.Mock;
  };

  beforeEach(async () => {
    getTasksUseCaseSpy = { execute: jest.fn().mockResolvedValue([]) };
    updateTaskStatusUseCaseSpy = { execute: jest.fn().mockResolvedValue(undefined) };
    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null))
      })
    };

    const settingsSignal = signal({
      appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
      timer: { amount_default: 25, pause_reminder: false },
      notifications: { sound_on: true },
      focus: { hide_done: false, only_current: false },
      accessibility: { animations_decreased: false, simplified_mode: false }
    });

    settingsServiceSpy = {
      settings: settingsSignal,
      focusSettings: computed(() => settingsSignal().focus),
      updateAppearance: jest.fn(),
      updateTimer: jest.fn(),
      updateNotifications: jest.fn(),
      updateAccessibility: jest.fn(),
      updateFocus: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FocusPage, NoopAnimationsModule],
      providers: [
        { provide: AppSettingsService, useValue: settingsServiceSpy },
        { provide: GetTasksUseCase, useValue: getTasksUseCaseSpy },
        { provide: UpdateTaskStatusUseCase, useValue: updateTaskStatusUseCaseSpy },
        provideRouter([])
      ]
    })
      .overrideComponent(FocusPage, {
        set: { providers: [{ provide: MatDialog, useValue: dialogSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(FocusPage);
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
