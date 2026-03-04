import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { DrawerFooterComponent } from "./drawer-footer.component";
import { SignOutUseCase } from "../../../../domain/usecases/sign-out.usecase";
import { of } from "rxjs";

describe("DrawerFooterComponent", () => {
  let component: DrawerFooterComponent;
  let fixture: ComponentFixture<DrawerFooterComponent>;

  let signOutUseCaseSpy: { execute: jest.Mock };

  beforeEach(async () => {
    signOutUseCaseSpy = { execute: jest.fn().mockReturnValue(of(void 0)) };

    await TestBed.configureTestingModule({
      imports: [DrawerFooterComponent],
      providers: [provideRouter([]), { provide: SignOutUseCase, useValue: signOutUseCaseSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call signOutUseCase and navigate to login on logout", () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, "navigate");
    component.logout();
    expect(signOutUseCaseSpy.execute).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(["/login"]);
  });
});
