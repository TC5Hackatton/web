import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { SettingsRepository } from "../../repositories/settings.repository";
import { UserSettings } from "../../models/user-settings.model";

@Injectable({ providedIn: "root" })
export class SaveSettingsUseCase {
  private settingsRepository = inject(SettingsRepository);

  execute(uid: string, settings: Partial<UserSettings>): Observable<void> {
    return this.settingsRepository.saveSettings(uid, settings);
  }
}
