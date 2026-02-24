import { TestBed } from "@angular/core/testing";
import { AppSettingsService } from "./app-settings.service";
import { GetSettingsUseCase } from "../../domain/usecases/settings/get-settings.usecase";
import { SaveSettingsUseCase } from "../../domain/usecases/settings/save-settings.usecase";
import { GetCurrentUserUseCase } from "../../domain/usecases/get-current-user.usecase";
import { RendererFactory2 } from "@angular/core";
import { of } from "rxjs";
import { UserSettings } from "../../domain/models/user-settings.model";

describe("AppSettingsService", () => {
  let service: AppSettingsService;
  let getSettingsUseCaseSpy: { execute: jest.Mock };
  let saveSettingsUseCaseSpy: { execute: jest.Mock };
  let getCurrentUserUseCaseSpy: { execute: jest.Mock };
  let rendererSpy: { addClass: jest.Mock; removeClass: jest.Mock };
  let rendererFactorySpy: { createRenderer: jest.Mock };

  const mockSettings: UserSettings = {
    uid: "user-123",
    appearance: { dark_mode: true, high_contrast: false, font_size: "M" },
    timer: { amount_default: 25, pause_reminder: false },
    notifications: { sound_on: true },
    focus: { hide_done: false, only_current: false },
    accessibility: { animations_decreased: false, simplified_mode: false }
  };

  beforeEach(() => {
    getSettingsUseCaseSpy = { execute: jest.fn() };
    saveSettingsUseCaseSpy = { execute: jest.fn() };
    getCurrentUserUseCaseSpy = { execute: jest.fn() };
    rendererSpy = { addClass: jest.fn(), removeClass: jest.fn() };
    rendererFactorySpy = { createRenderer: jest.fn().mockReturnValue(rendererSpy) };

    TestBed.configureTestingModule({
      providers: [
        AppSettingsService,
        { provide: GetSettingsUseCase, useValue: getSettingsUseCaseSpy },
        { provide: SaveSettingsUseCase, useValue: saveSettingsUseCaseSpy },
        { provide: GetCurrentUserUseCase, useValue: getCurrentUserUseCaseSpy },
        { provide: RendererFactory2, useValue: rendererFactorySpy }
      ]
    });

    getCurrentUserUseCaseSpy.execute.mockReturnValue({ id: "user-123" });
    getSettingsUseCaseSpy.execute.mockReturnValue(of(mockSettings));

    service = TestBed.inject(AppSettingsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should load settings on initialization", () => {
    expect(getCurrentUserUseCaseSpy.execute).toHaveBeenCalled();
    expect(getSettingsUseCaseSpy.execute).toHaveBeenCalledWith("user-123");
    expect(service.settings()).toEqual(mockSettings);
  });

  it("should apply theme classes to body", () => {
    service.applyTheme(mockSettings.appearance);
    expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "theme-dark");
    expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "font-size-m");
  });

  it("should update appearance and save", () => {
    saveSettingsUseCaseSpy.execute.mockReturnValue(of(undefined));

    service.updateAppearance({ dark_mode: false });

    expect(service.settings().appearance.dark_mode).toBe(false);
    expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith("user-123", {
      appearance: expect.objectContaining({ dark_mode: false })
    });
  });

  it("should update timer and save", () => {
    saveSettingsUseCaseSpy.execute.mockReturnValue(of(undefined));

    service.updateTimer({ amount_default: 50 });

    expect(service.settings().timer.amount_default).toBe(50);
    expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith("user-123", {
      timer: expect.objectContaining({ amount_default: 50 })
    });
  });
});
