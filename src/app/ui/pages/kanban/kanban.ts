import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule
} from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from "@angular/material/sidenav";
import { Header } from "../../../shared/components/header/header";

interface Task {
  id: string;
  title: string;
  tag?: string;
}

@Component({
  selector: "app-kanban",
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    Header,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent
  ],
  templateUrl: "./kanban.html",
  styleUrl: "./kanban.scss"
})
export class KanbanPage {
  todo = signal<Task[]>([
    { id: "1", title: "Definir cores", tag: "Design" },
    { id: "2", title: "Criar repositório", tag: "Dev" }
  ]);

  doing = signal<Task[]>([{ id: "3", title: "Desenvolver Login", tag: "Dev" }]);

  done = signal<Task[]>([{ id: "4", title: "Briefing inicial", tag: "Gestão" }]);

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
