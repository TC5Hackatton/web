import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideRouter } from "@angular/router";
import { of } from "rxjs";
import { Drawer } from "./drawer";
import { SignOutUseCase } from "../../../domain/usecases/sign-out.usecase";

describe("Drawer", () => {
  let component: Drawer;
  let fixture: ComponentFixture<Drawer>;
  let signOutUseCaseSpy: { execute: jest.Mock };

  beforeEach(async () => {
    signOutUseCaseSpy = { execute: jest.fn().mockReturnValue(of(void 0)) };

    await TestBed.configureTestingModule({
      imports: [Drawer],
      providers: [{ provide: SignOutUseCase, useValue: signOutUseCaseSpy }, provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Drawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
