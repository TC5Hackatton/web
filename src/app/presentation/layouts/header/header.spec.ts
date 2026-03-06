import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Header } from "./header";
import { AppSettingsService } from "../../services/app-settings.service";
import { Signal, WritableSignal, signal, computed } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { of, Observable } from "rxjs";
import { UserSettings, FocusSettings } from "../../../domain/models/user-settings.model";

describe("Header", () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let settingsServiceMock: {
    settings: WritableSignal<UserSettings>;
    focusSettings: Signal<FocusSettings>;
    updateAppearance: jest.Mock;
    updateFocus: jest.Mock;
  };
  let routerMock: {
    url: string;
    navigate: jest.Mock;
    events: Observable<NavigationEnd>;
  };
  let getTasksUseCaseMock: {
    execute: jest.Mock;
  };

  const DEFAULT_MOCK_SETTINGS: UserSettings = {
    uid: "user-123",
    appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
    timer: { amount_default: 25, pause_reminder: false },
    notifications: { sound_on: true },
    focus: { hide_done: false, only_current: false },
    accessibility: { animations_decreased: false, simplified_mode: false }
  };

  beforeEach(async () => {
    const settingsSignal = signal<UserSettings>(DEFAULT_MOCK_SETTINGS);

    settingsServiceMock = {
      settings: settingsSignal,
      focusSettings: computed(() => settingsSignal().focus),
      updateAppearance: jest.fn(),
      updateFocus: jest.fn()
    };

    routerMock = {
      url: "/dashboard",
      navigate: jest.fn(),
      events: of(new NavigationEnd(1, "/dashboard", "/dashboard"))
    };

    getTasksUseCaseMock = {
      execute: jest.fn().mockResolvedValue([])
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: AppSettingsService, useValue: settingsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: GetTasksUseCase, useValue: getTasksUseCaseMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle focus mode and navigate to focus page when not already there", () => {
    routerMock.url = "/dashboard";
    settingsServiceMock.settings.set({
      ...DEFAULT_MOCK_SETTINGS,
      focus: { ...DEFAULT_MOCK_SETTINGS.focus, only_current: false }
    });

    component.toggleFocus();

    expect(settingsServiceMock.updateFocus).toHaveBeenCalledWith({ only_current: true });
    expect(routerMock.navigate).toHaveBeenCalledWith(["/focus-mode"]);
  });

  it("should navigate back to dashboard if already on focus page", () => {
    routerMock.url = "/focus-mode";
    settingsServiceMock.settings.set({
      ...DEFAULT_MOCK_SETTINGS,
      focus: { ...DEFAULT_MOCK_SETTINGS.focus, only_current: true }
    });

    component.toggleFocus();

    expect(settingsServiceMock.updateFocus).toHaveBeenCalledWith({ only_current: false });
    expect(routerMock.navigate).toHaveBeenCalledWith(["/tasks"]);
  });
});
