import { Component } from "@angular/core";
import { DrawerHeaderComponent } from "./drawer-header/drawer-header.component";
import { DrawerFooterComponent } from "./drawer-footer/drawer-footer.component";

@Component({
  selector: "app-drawer",
  imports: [DrawerHeaderComponent, DrawerFooterComponent],
  templateUrl: "./drawer.html",
  styleUrl: "./drawer.scss"
})
export class Drawer {}
