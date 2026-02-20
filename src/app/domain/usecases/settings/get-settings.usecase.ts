import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { SettingsRepository } from "../../repositories/settings.repository";
import { UserSettings } from "../../models/user-settings.model";

@Injectable({ providedIn: "root" })
export class GetSettingsUseCase {
  private settingsRepository = inject(SettingsRepository);

  execute(uid: string): Observable<UserSettings | null> {
    return this.settingsRepository.getSettings(uid);
  }
}
