export type FontSize = "P" | "M" | "G";

export interface AppearanceSettings {
  dark_mode: boolean;
  high_contrast: boolean;
  font_size?: FontSize;
}

export interface TimerSettings {
  amount_default?: number;
  pause_reminder: boolean;
}

export interface NotificationSettings {
  sound_on: boolean;
}

export interface FocusSettings {
  hide_done: boolean;
  only_current: boolean;
}

export interface AccessibilitySettings {
  animations_decreased: boolean;
  simplified_mode: boolean;
}

export interface UserSettings {
  id?: string;
  uid: string;
  appearance: AppearanceSettings;
  timer: TimerSettings;
  notifications: NotificationSettings;
  focus: FocusSettings;
  accessibility: AccessibilitySettings;
}
