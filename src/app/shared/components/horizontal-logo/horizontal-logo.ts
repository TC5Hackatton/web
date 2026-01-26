import { Component, Input } from "@angular/core";

@Component({
  selector: "app-horizontal-logo",
  standalone: true,
  templateUrl: "./horizontal-logo.html"
})
export class HorizontalLogoComponent {
  @Input() width = "auto";
}
