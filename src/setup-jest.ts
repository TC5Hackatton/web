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
