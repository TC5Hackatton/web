import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsComponent } from "./settings.component";
import { AppSettingsService } from "../../services/app-settings.service";
import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { provideRouter } from "@angular/router";

const makeSettingsServiceSpy = () => ({
  settings: signal({
    appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
    timer: { amount_default: 25, pause_reminder: false },
    notifications: { sound_on: true },
    focus: { hide_done: false, only_current: false },
    accessibility: { animations_decreased: false, simplified_mode: false }
  }),
  updateAppearance: jest.fn(),
  updateTimer: jest.fn(),
  updateNotifications: jest.fn(),
  updateAccessibility: jest.fn(),
  updateFocus: jest.fn()
});

describe("SettingsComponent", () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsServiceSpy: ReturnType<typeof makeSettingsServiceSpy>;

  beforeEach(async () => {
    settingsServiceSpy = makeSettingsServiceSpy();

    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [{ provide: AppSettingsService, useValue: settingsServiceSpy }, provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should expose settingsService publicly", () => {
    expect(component.settingsService).toBeDefined();
  });

  describe("Aparência", () => {
    it("should call updateAppearance with dark_mode: true when dark mode is enabled", () => {
      component.toggleDarkMode({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ dark_mode: true });
    });

    it("should call updateAppearance with dark_mode: false when dark mode is disabled", () => {
      component.toggleDarkMode({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ dark_mode: false });
    });

    it("should call updateAppearance with high_contrast: true when high contrast is enabled", () => {
      component.toggleHighContrast({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ high_contrast: true });
    });

    it("should call updateAppearance with high_contrast: false when high contrast is disabled", () => {
      component.toggleHighContrast({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ high_contrast: false });
    });

    it("should call updateAppearance with font_size 'P'", () => {
      component.changeFontSize({ value: "P" } as MatButtonToggleChange);
      expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ font_size: "P" });
    });

    it("should call updateAppearance with font_size 'M'", () => {
      component.changeFontSize({ value: "M" } as MatButtonToggleChange);
      expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ font_size: "M" });
    });

    it("should call updateAppearance with font_size 'G'", () => {
      component.changeFontSize({ value: "G" } as MatButtonToggleChange);
      expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ font_size: "G" });
    });
  });

  describe("Timer / Produtividade", () => {
    it("should call updateTimer with amount_default 25 when pomodoro time is 25", () => {
      component.changePomodoroTime({ value: "25" } as MatButtonToggleChange);
      expect(settingsServiceSpy.updateTimer).toHaveBeenCalledWith({ amount_default: 25 });
    });

    it("should call updateTimer with amount_default 45 when pomodoro time is 45", () => {
      component.changePomodoroTime({ value: "45" } as MatButtonToggleChange);
      expect(settingsServiceSpy.updateTimer).toHaveBeenCalledWith({ amount_default: 45 });
    });

    it("should call updateTimer with pause_reminder: true when pause reminder is enabled", () => {
      component.togglePauseReminder({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateTimer).toHaveBeenCalledWith({ pause_reminder: true });
    });

    it("should call updateTimer with pause_reminder: false when pause reminder is disabled", () => {
      component.togglePauseReminder({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateTimer).toHaveBeenCalledWith({ pause_reminder: false });
    });
  });

  describe("Notificações", () => {
    it("should call updateNotifications with sound_on: true when sound is enabled", () => {
      component.toggleSound({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateNotifications).toHaveBeenCalledWith({ sound_on: true });
    });

    it("should call updateNotifications with sound_on: false when sound is disabled", () => {
      component.toggleSound({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateNotifications).toHaveBeenCalledWith({ sound_on: false });
    });
  });

  describe("Acessibilidade", () => {
    it("should call updateAccessibility with animations_decreased: true", () => {
      component.toggleAnimationsDecreased({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAccessibility).toHaveBeenCalledWith({
        animations_decreased: true
      });
    });

    it("should call updateAccessibility with animations_decreased: false", () => {
      component.toggleAnimationsDecreased({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAccessibility).toHaveBeenCalledWith({
        animations_decreased: false
      });
    });

    it("should call updateAccessibility with simplified_mode: true", () => {
      component.toggleSimplifiedMode({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAccessibility).toHaveBeenCalledWith({
        simplified_mode: true
      });
    });

    it("should call updateAccessibility with simplified_mode: false", () => {
      component.toggleSimplifiedMode({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateAccessibility).toHaveBeenCalledWith({
        simplified_mode: false
      });
    });
  });

  describe("Foco", () => {
    it("should call updateFocus with hide_done: true when hide done is enabled", () => {
      component.toggleHideDone({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateFocus).toHaveBeenCalledWith({ hide_done: true });
    });

    it("should call updateFocus with hide_done: false when hide done is disabled", () => {
      component.toggleHideDone({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateFocus).toHaveBeenCalledWith({ hide_done: false });
    });

    it("should call updateFocus with only_current: true when focus mode is enabled", () => {
      component.toggleOnlyCurrent({ checked: true } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateFocus).toHaveBeenCalledWith({ only_current: true });
    });

    it("should call updateFocus with only_current: false when focus mode is disabled", () => {
      component.toggleOnlyCurrent({ checked: false } as MatSlideToggleChange);
      expect(settingsServiceSpy.updateFocus).toHaveBeenCalledWith({ only_current: false });
    });
  });
});
