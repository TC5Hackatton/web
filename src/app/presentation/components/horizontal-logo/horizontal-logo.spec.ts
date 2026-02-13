import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HorizontalLogoComponent } from "./horizontal-logo";

describe("HorizontalLogoComponent", () => {
  let component: HorizontalLogoComponent;
  let fixture: ComponentFixture<HorizontalLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalLogoComponent]
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
