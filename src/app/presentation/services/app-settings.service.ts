import { Injectable, inject, signal, effect, Renderer2, RendererFactory2 } from "@angular/core";
import { GetSettingsUseCase } from "../../domain/usecases/settings/get-settings.usecase";
import { SaveSettingsUseCase } from "../../domain/usecases/settings/save-settings.usecase";
import { GetCurrentUserUseCase } from "../../domain/usecases/get-current-user.usecase";
import {
  UserSettings,
  AppearanceSettings,
  TimerSettings,
  NotificationSettings,
  FocusSettings,
  AccessibilitySettings
} from "../../domain/models/user-settings.model";

const DEFAULT_SETTINGS: UserSettings = {
  uid: "",
  appearance: {
    dark_mode: false,
    high_contrast: false,
    font_size: "M"
  },
  timer: {
    amount_default: 25,
    pause_reminder: false
  },
  notifications: {
    sound_on: true
  },
  focus: {
    hide_done: false,
    only_current: false
  },
  accessibility: {
    animations_decreased: false,
    simplified_mode: false
  }
};

@Injectable({ providedIn: "root" })
export class AppSettingsService {
  private getSettingsUseCase = inject(GetSettingsUseCase);
  private saveSettingsUseCase = inject(SaveSettingsUseCase);
  private getCurrentUserUseCase = inject(GetCurrentUserUseCase);
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  settings = signal<UserSettings>(DEFAULT_SETTINGS);

  constructor() {
    this.loadSettings();

    effect(() => {
      const s = this.settings();
      if (s?.appearance) {
        this.applyTheme(s.appearance);
      }
    });
  }

  loadSettings() {
    const user = this.getCurrentUserUseCase.execute();
    if (user?.id) {
      this.getSettingsUseCase.execute(user.id).subscribe((data) => {
        if (data) {
          const merged: UserSettings = {
            uid: user.id,
            appearance: { ...DEFAULT_SETTINGS.appearance, ...data.appearance },
            timer: { ...DEFAULT_SETTINGS.timer, ...data.timer },
            notifications: { ...DEFAULT_SETTINGS.notifications, ...data.notifications },
            focus: { ...DEFAULT_SETTINGS.focus, ...data.focus },
            accessibility: { ...DEFAULT_SETTINGS.accessibility, ...data.accessibility }
          };
          this.settings.set(merged);
        } else {
          this.settings.update((s) => ({ ...s, uid: user.id }));
          this.saveSettingsUseCase.execute(user.id, this.settings()).subscribe();
        }
      });
    }
  }

  updateAppearance(changes: Partial<AppearanceSettings>) {
    this.updateSection("appearance", changes);
  }

  updateTimer(changes: Partial<TimerSettings>) {
    this.updateSection("timer", changes);
  }

  updateNotifications(changes: Partial<NotificationSettings>) {
    this.updateSection("notifications", changes);
  }

  updateFocus(changes: Partial<FocusSettings>) {
    this.updateSection("focus", changes);
  }

  updateAccessibility(changes: Partial<AccessibilitySettings>) {
    this.updateSection("accessibility", changes);
  }

  private updateSection<K extends Exclude<keyof UserSettings, "id" | "uid">>(
    section: K,
    changes: Partial<UserSettings[K]>
  ) {
    const currentUser = this.settings().uid;
    if (!currentUser) return;

    this.settings.update((current) => {
      const currentSection = current[section] || {};
      const updatedSettings = {
        ...current,
        [section]: { ...currentSection, ...changes }
      };

      this.saveSettingsUseCase
        .execute(currentUser, { [section]: updatedSettings[section] })
        .subscribe();

      return updatedSettings;
    });
  }

  applyTheme(appearance: AppearanceSettings) {
    const body = document.body;

    if (appearance.dark_mode) {
      this.renderer.addClass(body, "theme-dark");
      this.renderer.removeClass(body, "theme-light");
    } else {
      this.renderer.addClass(body, "theme-light");
      this.renderer.removeClass(body, "theme-dark");
    }

    this.renderer.removeClass(body, "font-size-p");
    this.renderer.removeClass(body, "font-size-m");
    this.renderer.removeClass(body, "font-size-g");
    const fontSize = (appearance.font_size || "M").toLowerCase();
    this.renderer.addClass(body, `font-size-${fontSize}`);

    if (appearance.high_contrast) {
      this.renderer.addClass(body, "high-contrast");
    } else {
      this.renderer.removeClass(body, "high-contrast");
    }
  }
}
