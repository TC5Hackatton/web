import { TestBed } from "@angular/core/testing";
import { SaveSettingsUseCase } from "./save-settings.usecase";
import { SettingsRepository } from "../../repositories/settings.repository";
import { of } from "rxjs";

describe("SaveSettingsUseCase", () => {
  let useCase: SaveSettingsUseCase;
  let repositorySpy: { saveSettings: jest.Mock };

  beforeEach(() => {
    repositorySpy = { saveSettings: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        SaveSettingsUseCase,
        { provide: SettingsRepository, useValue: repositorySpy }
      ]
    });

    useCase = TestBed.inject(SaveSettingsUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.saveSettings with the correct arguments", (done) => {
    repositorySpy.saveSettings.mockReturnValue(of(undefined));

    const partialSettings = { appearance: { dark_mode: true, high_contrast: false } };

    useCase.execute("uid-123", partialSettings).subscribe(() => {
      expect(repositorySpy.saveSettings).toHaveBeenCalledWith("uid-123", partialSettings);
      done();
    });
  });

  it("should complete without error on successful save", (done) => {
    repositorySpy.saveSettings.mockReturnValue(of(undefined));

    useCase.execute("uid-123", { timer: { amount_default: 30, pause_reminder: true } }).subscribe({
      complete: () => {
        expect(true).toBe(true);
        done();
      },
      error: () => {
        fail("Should not have thrown an error");
      }
    });
  });
});
