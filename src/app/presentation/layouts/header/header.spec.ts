import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Header } from "./header";

describe("Header", () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle isInputMode", () => {
    expect(component.isInputMode).toBe(true);
    component.toggleArrow();
    expect(component.isInputMode).toBe(false);
    component.toggleArrow();
    expect(component.isInputMode).toBe(true);
  });
});
