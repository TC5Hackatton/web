import { TestBed } from "@angular/core/testing";
import { AppSettingsService } from "./app-settings.service";
import { GetSettingsUseCase } from "../../domain/usecases/settings/get-settings.usecase";
import { SaveSettingsUseCase } from "../../domain/usecases/settings/save-settings.usecase";
import { GetCurrentUserUseCase } from "../../domain/usecases/get-current-user.usecase";
import { RendererFactory2 } from "@angular/core";
import { of } from "rxjs";
import { UserSettings } from "../../domain/models/user-settings.model";

const makeUserSettings = (overrides: Partial<UserSettings> = {}): UserSettings => ({
  uid: "user-123",
  appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
  timer: { amount_default: 25, pause_reminder: false },
  notifications: { sound_on: true },
  focus: { hide_done: false, only_current: false },
  accessibility: { animations_decreased: false, simplified_mode: false },
  ...overrides
});

describe("AppSettingsService", () => {
  let service: AppSettingsService;
  let getSettingsUseCaseSpy: { execute: jest.Mock };
  let saveSettingsUseCaseSpy: { execute: jest.Mock };
  let getCurrentUserUseCaseSpy: { execute: jest.Mock };
  let rendererSpy: { addClass: jest.Mock; removeClass: jest.Mock };

  const setup = (userOverride?: { id?: string } | null, settingsOverride?: UserSettings | null) => {
    const localGetSettings = { execute: jest.fn() };
    const localSaveSettings = { execute: jest.fn().mockReturnValue(of(undefined)) };
    const localGetCurrentUser = { execute: jest.fn() };
    const localRenderer = { addClass: jest.fn(), removeClass: jest.fn() };
    const localRendererFactory = { createRenderer: jest.fn().mockReturnValue(localRenderer) };

    localGetCurrentUser.execute.mockReturnValue(
      userOverride !== undefined ? userOverride : { id: "user-123" }
    );
    localGetSettings.execute.mockReturnValue(
      of(settingsOverride !== undefined ? settingsOverride : makeUserSettings())
    );

    TestBed.configureTestingModule({
      providers: [
        AppSettingsService,
        { provide: GetSettingsUseCase, useValue: localGetSettings },
        { provide: SaveSettingsUseCase, useValue: localSaveSettings },
        { provide: GetCurrentUserUseCase, useValue: localGetCurrentUser },
        { provide: RendererFactory2, useValue: localRendererFactory }
      ]
    });

    service = TestBed.inject(AppSettingsService);

    getSettingsUseCaseSpy = localGetSettings;
    saveSettingsUseCaseSpy = localSaveSettings;
    getCurrentUserUseCaseSpy = localGetCurrentUser;
    rendererSpy = localRenderer;

    return {
      getSettingsUseCaseSpy: localGetSettings,
      saveSettingsUseCaseSpy: localSaveSettings,
      getCurrentUserUseCaseSpy: localGetCurrentUser,
      rendererSpy: localRenderer
    };
  };

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  describe("Criação e inicialização", () => {
    it("should be created", () => {
      setup();
      expect(service).toBeTruthy();
    });

    it("should load settings on initialization when user is logged in", () => {
      setup();
      expect(getCurrentUserUseCaseSpy.execute).toHaveBeenCalled();
      expect(getSettingsUseCaseSpy.execute).toHaveBeenCalledWith("user-123");
    });

    it("should populate the settings signal with loaded data", () => {
      const custom = makeUserSettings({
        appearance: { dark_mode: true, high_contrast: false, font_size: "G" }
      });
      setup(undefined, custom);
      expect(service.settings().appearance.dark_mode).toBe(true);
      expect(service.settings().appearance.font_size).toBe("G");
    });

    it("should NOT call getSettingsUseCase when there is no logged-in user", () => {
      const { getSettingsUseCaseSpy: localSpy } = setup(null);
      expect(localSpy.execute).not.toHaveBeenCalled();
    });

    it("should save default settings and update uid when Firestore returns null", () => {
      setup(undefined, null);
      expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({ uid: "user-123" })
      );
    });

    it("should expose focusSettings as a computed derived from settings", () => {
      setup();
      expect(service.focusSettings()).toEqual({ hide_done: false, only_current: false });
    });
  });

  describe("updateAppearance()", () => {
    beforeEach(() => setup());

    it("should update dark_mode in the settings signal", () => {
      service.updateAppearance({ dark_mode: true });
      expect(service.settings().appearance.dark_mode).toBe(true);
    });

    it("should update high_contrast in the settings signal", () => {
      service.updateAppearance({ high_contrast: true });
      expect(service.settings().appearance.high_contrast).toBe(true);
    });

    it("should update font_size in the settings signal", () => {
      service.updateAppearance({ font_size: "G" });
      expect(service.settings().appearance.font_size).toBe("G");
    });

    it("should save updated appearance to Firestore", () => {
      service.updateAppearance({ dark_mode: true });
      expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          appearance: expect.objectContaining({ dark_mode: true })
        })
      );
    });

    it("should preserve existing appearance fields when partially updating", () => {
      service.updateAppearance({ dark_mode: true });
      expect(service.settings().appearance.font_size).toBe("M");
    });
  });

  describe("updateTimer()", () => {
    beforeEach(() => setup());

    it("should update amount_default in the settings signal", () => {
      service.updateTimer({ amount_default: 50 });
      expect(service.settings().timer.amount_default).toBe(50);
    });

    it("should update pause_reminder in the settings signal", () => {
      service.updateTimer({ pause_reminder: true });
      expect(service.settings().timer.pause_reminder).toBe(true);
    });

    it("should save updated timer to Firestore", () => {
      service.updateTimer({ amount_default: 45 });
      expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          timer: expect.objectContaining({ amount_default: 45 })
        })
      );
    });
  });

  describe("updateNotifications()", () => {
    beforeEach(() => setup());

    it("should update sound_on to false in the settings signal", () => {
      service.updateNotifications({ sound_on: false });
      expect(service.settings().notifications.sound_on).toBe(false);
    });

    it("should update sound_on to true in the settings signal", () => {
      service.updateNotifications({ sound_on: true });
      expect(service.settings().notifications.sound_on).toBe(true);
    });

    it("should save updated notifications to Firestore", () => {
      service.updateNotifications({ sound_on: false });
      expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          notifications: expect.objectContaining({ sound_on: false })
        })
      );
    });
  });

  describe("updateFocus()", () => {
    beforeEach(() => setup());

    it("should update hide_done in the settings signal", () => {
      service.updateFocus({ hide_done: true });
      expect(service.settings().focus.hide_done).toBe(true);
    });

    it("should update only_current in the settings signal", () => {
      service.updateFocus({ only_current: true });
      expect(service.settings().focus.only_current).toBe(true);
    });

    it("should save updated focus settings to Firestore", () => {
      service.updateFocus({ hide_done: true });
      expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          focus: expect.objectContaining({ hide_done: true })
        })
      );
    });

    it("should also update focusSettings computed signal", () => {
      service.updateFocus({ only_current: true });
      expect(service.focusSettings().only_current).toBe(true);
    });
  });

  describe("updateAccessibility()", () => {
    beforeEach(() => setup());

    it("should update animations_decreased in the settings signal", () => {
      service.updateAccessibility({ animations_decreased: true });
      expect(service.settings().accessibility.animations_decreased).toBe(true);
    });

    it("should update simplified_mode in the settings signal", () => {
      service.updateAccessibility({ simplified_mode: true });
      expect(service.settings().accessibility.simplified_mode).toBe(true);
    });

    it("should save updated accessibility settings to Firestore", () => {
      service.updateAccessibility({ simplified_mode: true });
      expect(saveSettingsUseCaseSpy.execute).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          accessibility: expect.objectContaining({ simplified_mode: true })
        })
      );
    });
  });

  describe("applyTheme()", () => {
    beforeEach(() => setup());

    it("should add 'theme-dark' and remove 'theme-light' when dark_mode is true", () => {
      service.applyTheme({ dark_mode: true, high_contrast: false, font_size: "M" });
      expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "theme-dark");
      expect(rendererSpy.removeClass).toHaveBeenCalledWith(expect.anything(), "theme-light");
    });

    it("should add 'theme-light' and remove 'theme-dark' when dark_mode is false", () => {
      service.applyTheme({ dark_mode: false, high_contrast: false, font_size: "M" });
      expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "theme-light");
      expect(rendererSpy.removeClass).toHaveBeenCalledWith(expect.anything(), "theme-dark");
    });

    it("should add the correct font-size class — font-size-p for 'P'", () => {
      service.applyTheme({ dark_mode: false, high_contrast: false, font_size: "P" });
      expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "font-size-p");
    });

    it("should add the correct font-size class — font-size-m for 'M'", () => {
      service.applyTheme({ dark_mode: false, high_contrast: false, font_size: "M" });
      expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "font-size-m");
    });

    it("should add the correct font-size class — font-size-g for 'G'", () => {
      service.applyTheme({ dark_mode: false, high_contrast: false, font_size: "G" });
      expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "font-size-g");
    });

    it("should remove all font-size classes before adding the correct one", () => {
      service.applyTheme({ dark_mode: false, high_contrast: false, font_size: "G" });
      expect(rendererSpy.removeClass).toHaveBeenCalledWith(expect.anything(), "font-size-p");
      expect(rendererSpy.removeClass).toHaveBeenCalledWith(expect.anything(), "font-size-m");
      expect(rendererSpy.removeClass).toHaveBeenCalledWith(expect.anything(), "font-size-g");
    });

    it("should add 'high-contrast' class when high_contrast is true", () => {
      service.applyTheme({ dark_mode: false, high_contrast: true, font_size: "M" });
      expect(rendererSpy.addClass).toHaveBeenCalledWith(expect.anything(), "high-contrast");
    });

    it("should remove 'high-contrast' class when high_contrast is false", () => {
      service.applyTheme({ dark_mode: false, high_contrast: false, font_size: "M" });
      expect(rendererSpy.removeClass).toHaveBeenCalledWith(expect.anything(), "high-contrast");
    });
  });
});
