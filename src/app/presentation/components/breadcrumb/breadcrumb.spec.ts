import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BreadcrumbComponent } from "./breadcrumb";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideRouter } from "@angular/router";

describe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("title", "Início");
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should accept a title input", () => {
    expect(component.title).toBe("Início");
  });

  it("should update title when input changes", () => {
    fixture.componentRef.setInput("title", "Tarefas");
    fixture.detectChanges();
    expect(component.title).toBe("Tarefas");
  });
});
