import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-drawer-footer",
  imports: [MatIcon, RouterModule],
  templateUrl: "./drawer-footer.component.html",
  styleUrl: "./drawer-footer.component.scss"
})
export class DrawerFooterComponent {}
