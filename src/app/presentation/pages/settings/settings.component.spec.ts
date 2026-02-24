import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsComponent } from "./settings.component";
import { AppSettingsService } from "../../services/app-settings.service";
import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { provideRouter } from "@angular/router";

describe("SettingsComponent", () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsServiceSpy: any;

  beforeEach(async () => {
    settingsServiceSpy = {
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
    };

    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [{ provide: AppSettingsService, useValue: settingsServiceSpy }, provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call updateAppearance when dark mode is toggled", () => {
    component.toggleDarkMode({ checked: true } as MatSlideToggleChange);
    expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ dark_mode: true });
  });

  it("should call updateAppearance when font size is changed", () => {
    component.changeFontSize({ value: "G" } as MatButtonToggleChange);
    expect(settingsServiceSpy.updateAppearance).toHaveBeenCalledWith({ font_size: "G" });
  });

  it("should call updateTimer when pomodoro time is changed", () => {
    component.changePomodoroTime({ value: "45" } as MatButtonToggleChange);
    expect(settingsServiceSpy.updateTimer).toHaveBeenCalledWith({ amount_default: 45 });
  });

  it("should call updateNotifications when sound is toggled", () => {
    component.toggleSound({ checked: false } as MatSlideToggleChange);
    expect(settingsServiceSpy.updateNotifications).toHaveBeenCalledWith({ sound_on: false });
  });
});
