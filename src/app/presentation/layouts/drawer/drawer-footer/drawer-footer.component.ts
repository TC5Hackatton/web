import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-drawer-footer",
  imports: [MatIcon, RouterModule],
  templateUrl: "./drawer-footer.component.html",
  styleUrl: "./drawer-footer.component.scss"
})
export class DrawerFooterComponent {
  private router = inject(Router);
  logout() {
    this.router.navigate(["/login"]);
  }
}
