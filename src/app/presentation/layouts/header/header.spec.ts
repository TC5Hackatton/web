import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Header } from "./header";
import { AppSettingsService } from "../../services/app-settings.service";
import { signal } from "@angular/core";
import { Router } from "@angular/router";

describe("Header", () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let settingsService: any;
  let router: any;

  beforeEach(async () => {
    // stubbed settings service with focus flag
    settingsService = {
      settings: signal({
        appearance: { dark_mode: false },
        focus: { only_current: false }
      }),
      updateAppearance: jest.fn(),
      updateFocus: jest.fn()
    };

    // simple router stub; supply minimal events observable so subscription won't crash
    router = {
      url: "",
      navigate: jest.fn(),
      events: { subscribe: jest.fn() }
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: AppSettingsService, useValue: settingsService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle focus mode and navigate to focus page when not already there", () => {
    // start out of focus mode
    router.url = "/dashboard";
    settingsService.settings().focus.only_current = false;
    component.isFocusMode = false; // ensure consistent

    component.toggleFocus();

    expect(settingsService.updateFocus).toHaveBeenCalledWith({ only_current: true });
    expect(component.isFocusMode).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(["/focus-mode"]);
  });

  it("should navigate back to dashboard if already on focus page", () => {
    // simulate already in focus settings and route
    router.url = "/focus-mode";
    settingsService.settings().focus.only_current = true;
    component.isFocusMode = true;

    component.toggleFocus();

    expect(settingsService.updateFocus).toHaveBeenCalledWith({ only_current: false });
    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  });
});
