import { setupZoneTestEnv } from "jest-preset-angular/setup-env/zone";

setupZoneTestEnv();

if (typeof globalThis.fetch === "undefined") {
  (globalThis as any).fetch = jest.fn();
}
if (typeof globalThis.Request === "undefined") {
  (globalThis as any).Request = jest.fn();
}
if (typeof globalThis.Response === "undefined") {
  (globalThis as any).Response = jest.fn();
}
if (typeof globalThis.Headers === "undefined") {
  (globalThis as any).Headers = jest.fn();
}
