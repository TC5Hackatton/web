import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: "./breadcrumb.html",
  styleUrl: "./breadcrumb.scss"
})
export class BreadcrumbComponent {
  @Input({ required: true }) title!: string;
}
