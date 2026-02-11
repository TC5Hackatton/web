import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VerticalLogoComponent } from "./vertical-logo";

describe("VerticalLogoComponent", () => {
  let component: VerticalLogoComponent;
  let fixture: ComponentFixture<VerticalLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalLogoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalLogoComponent);
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
    fixture.componentRef.setInput("width", "200px");
    fixture.detectChanges();
    expect(component.width).toBe("200px");
  });
});
