import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { HorizontalLogoComponent } from "../../components/horizontal-logo/horizontal-logo";

@Component({
  selector: "app-header",
  imports: [MatIcon, MatToolbar, HorizontalLogoComponent],
  templateUrl: "./header.html",
  styleUrl: "./header.scss"
})
export class Header {
  isInputMode = true;

  toggleArrow() {
    this.isInputMode = !this.isInputMode;
  }
}
