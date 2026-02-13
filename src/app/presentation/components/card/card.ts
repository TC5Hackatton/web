import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-card",
  imports: [CommonModule, MatCardModule],
  templateUrl: "./card.html",
  styleUrl: "./card.scss"
})
export class Card {
  @Input() cardClass: string | string[] | null = null;

  get resolvedClasses() {
    return this.cardClass ?? [];
  }
}
