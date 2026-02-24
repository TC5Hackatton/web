import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HorizontalLogoComponent } from "./horizontal-logo";
import { AppSettingsService } from "../../services/app-settings.service";
import { signal } from "@angular/core";

describe("HorizontalLogoComponent", () => {
  let component: HorizontalLogoComponent;
  let fixture: ComponentFixture<HorizontalLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalLogoComponent],
      providers: [
        {
          provide: AppSettingsService,
          useValue: {
            settings: signal({ appearance: { dark_mode: false } })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('should have default width "auto"', () => {
    expect(component.width).toBe("auto");
  });

  it("should accept custom width", () => {
    fixture.componentRef.setInput("width", "100px");
    fixture.detectChanges();
    expect(component.width).toBe("100px");
  });
});
