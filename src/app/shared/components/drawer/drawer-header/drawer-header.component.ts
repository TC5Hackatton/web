import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-drawer-header",
  imports: [MatIcon, RouterModule],
  templateUrl: "./drawer-header.component.html",
  styleUrl: "./drawer-header.component.scss"
})
export class DrawerHeaderComponent {}
