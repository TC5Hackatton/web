import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Card } from "./card";

describe("Card", () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card]
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return empty array if cardClass is null", () => {
    component.cardClass = null;
    expect(component.resolvedClasses).toEqual([]);
  });

  it("should return cardClass if provided", () => {
    component.cardClass = "custom-class";
    expect(component.resolvedClasses).toBe("custom-class");
  });
});
