import { Component, Input } from "@angular/core";

@Component({
  selector: "app-vertical-logo",
  standalone: true,
  templateUrl: "./vertical-logo.html"
})
export class VerticalLogoComponent {
  @Input() width = "auto";
}
