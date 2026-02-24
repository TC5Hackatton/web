import { TestBed } from "@angular/core/testing";
import { FirebaseSettingsRepository } from "./firebase-settings.repository";
import { SettingsRepository } from "../../domain/repositories/settings.repository";

jest.mock("firebase/app", () => ({ initializeApp: jest.fn() }));
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  onSnapshot: jest.fn()
}));
jest.mock("../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

import { doc, setDoc, onSnapshot } from "firebase/firestore";

describe("FirebaseSettingsRepository", () => {
  let repository: FirebaseSettingsRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirebaseSettingsRepository,
        { provide: SettingsRepository, useClass: FirebaseSettingsRepository }
      ]
    });
    repository = TestBed.inject(FirebaseSettingsRepository);
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(repository).toBeTruthy();
  });

  describe("getSettings", () => {
    it("should emit UserSettings when document exists", (done) => {
      const fakeSettings = {
        uid: "uid-123",
        appearance: { dark_mode: true, high_contrast: false, font_size: "M" as const },
        timer: { amount_default: 25, pause_reminder: false },
        notifications: { sound_on: true },
        focus: { hide_done: false, only_current: false },
        accessibility: { animations_decreased: false, simplified_mode: false }
      };

      const mockSnap = {
        exists: () => true,
        data: () => fakeSettings,
        id: "uid-123"
      };

      (doc as jest.Mock).mockReturnValue({});
      (onSnapshot as jest.Mock).mockImplementation((_ref: unknown, cb: (snap: unknown) => void) => {
        cb(mockSnap);
        return jest.fn();
      });

      repository.getSettings("uid-123").subscribe((settings) => {
        expect(settings).toEqual({ ...fakeSettings, id: "uid-123" });
        done();
      });
    });

    it("should emit null when document does not exist", (done) => {
      const mockSnap = { exists: () => false };

      (doc as jest.Mock).mockReturnValue({});
      (onSnapshot as jest.Mock).mockImplementation((_ref: unknown, cb: (snap: unknown) => void) => {
        cb(mockSnap);
        return jest.fn();
      });

      repository.getSettings("uid-missing").subscribe((settings) => {
        expect(settings).toBeNull();
        done();
      });
    });

    it("should emit error on snapshot error", (done) => {
      const mockError = new Error("Firestore error");

      (doc as jest.Mock).mockReturnValue({});
      (onSnapshot as jest.Mock).mockImplementation(
        (_ref: unknown, _cb: unknown, errCb: (e: Error) => void) => {
          errCb(mockError);
          return jest.fn();
        }
      );

      repository.getSettings("uid-error").subscribe({
        error: (err) => {
          expect(err).toBe(mockError);
          done();
        }
      });
    });
  });

  describe("saveSettings", () => {
    it("should call setDoc with correct arguments", (done) => {
      const fakeDocRef = {};
      (doc as jest.Mock).mockReturnValue(fakeDocRef);
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      const settings = { appearance: { dark_mode: true, high_contrast: false } };

      repository.saveSettings("uid-123", settings).subscribe(() => {
        expect(doc).toHaveBeenCalled();
        expect(setDoc).toHaveBeenCalledWith(fakeDocRef, settings, { merge: true });
        done();
      });
    });
  });
});
