import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Header } from "./header";
import { AppSettingsService } from "../../services/app-settings.service";
import { signal } from "@angular/core";

describe("Header", () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        {
          provide: AppSettingsService,
          useValue: {
            settings: signal({
              appearance: { dark_mode: false },
              focus: { only_current: false }
            }),
            updateAppearance: jest.fn(),
            updateFocus: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle focus mode", () => {
    const settingsService = TestBed.inject(AppSettingsService);
    const updateFocusSpy = jest.spyOn(settingsService, "updateFocus");

    component.toggleFocus();

    expect(updateFocusSpy).toHaveBeenCalledWith({ only_current: true });
    expect(component.isFocusMode).toBe(true);
  });

  it("should toggle dark mode", () => {
    const settingsService = TestBed.inject(AppSettingsService);
    const updateAppearanceSpy = jest.spyOn(settingsService, "updateAppearance");

    component.toggleDarkMode();

    expect(updateAppearanceSpy).toHaveBeenCalledWith({ dark_mode: true });
  });
});
