import { TestBed } from "@angular/core/testing";
import { GetSettingsUseCase } from "./get-settings.usecase";
import { SettingsRepository } from "../../repositories/settings.repository";
import { of } from "rxjs";
import { UserSettings } from "../../models/user-settings.model";

describe("GetSettingsUseCase", () => {
  let useCase: GetSettingsUseCase;
  let repositorySpy: { getSettings: jest.Mock };

  const mockSettings: UserSettings = {
    uid: "uid-123",
    appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
    timer: { amount_default: 25, pause_reminder: false },
    notifications: { sound_on: true },
    focus: { hide_done: false, only_current: false },
    accessibility: { animations_decreased: false, simplified_mode: false }
  };

  beforeEach(() => {
    repositorySpy = { getSettings: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        GetSettingsUseCase,
        { provide: SettingsRepository, useValue: repositorySpy }
      ]
    });

    useCase = TestBed.inject(GetSettingsUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.getSettings with the correct uid", (done) => {
    repositorySpy.getSettings.mockReturnValue(of(mockSettings));

    useCase.execute("uid-123").subscribe((settings) => {
      expect(repositorySpy.getSettings).toHaveBeenCalledWith("uid-123");
      expect(settings).toEqual(mockSettings);
      done();
    });
  });

  it("should emit null when settings do not exist", (done) => {
    repositorySpy.getSettings.mockReturnValue(of(null));

    useCase.execute("uid-not-found").subscribe((settings) => {
      expect(settings).toBeNull();
      done();
    });
  });
});
