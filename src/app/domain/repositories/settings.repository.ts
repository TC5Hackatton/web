import { Observable } from "rxjs";
import { UserSettings } from "../models/user-settings.model";

export abstract class SettingsRepository {
  abstract getSettings(uid: string): Observable<UserSettings | null>;
  abstract saveSettings(uid: string, settings: Partial<UserSettings>): Observable<void>;
}
