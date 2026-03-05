import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { SignOutUseCase } from "../../../../domain/usecases/sign-out.usecase";

@Component({
  selector: "app-drawer-footer",
  imports: [MatIcon, RouterModule],
  templateUrl: "./drawer-footer.component.html",
  styleUrl: "./drawer-footer.component.scss"
})
export class DrawerFooterComponent {
  private router = inject(Router);
  private signOutUseCase = inject(SignOutUseCase);

  logout() {
    this.signOutUseCase.execute().subscribe(() => {
      this.router.navigate(["/login"]);
    });
  }
}
