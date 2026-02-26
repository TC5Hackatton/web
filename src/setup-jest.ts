declare const jest: any;
import { setupZoneTestEnv } from "jest-preset-angular/setup-env/zone";

setupZoneTestEnv();

if (typeof globalThis.fetch === "undefined") {
  (globalThis as unknown as Record<string, unknown>)["fetch"] = jest.fn();
}
if (typeof globalThis.Request === "undefined") {
  (globalThis as unknown as Record<string, unknown>)["Request"] = jest.fn();
}
if (typeof globalThis.Response === "undefined") {
  (globalThis as unknown as Record<string, unknown>)["Response"] = jest.fn();
}
if (typeof globalThis.Headers === "undefined") {
  (globalThis as unknown as Record<string, unknown>)["Headers"] = jest.fn();
}

// Mock Firebase to avoid initialization errors in pipeline unit tests
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn().mockReturnValue({}),
  getApps: jest.fn().mockReturnValue([]),
  getApp: jest.fn().mockReturnValue({})
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: null
  }),
  onAuthStateChanged: jest.fn().mockReturnValue(jest.fn())
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn().mockReturnValue({})
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn().mockReturnValue({})
}));
