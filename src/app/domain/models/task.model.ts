export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id?: string;
  uid: string; // ID do usuário dono da tarefa
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
}
