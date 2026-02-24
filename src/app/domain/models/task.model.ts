export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id?: string;
  uid: string; // ID do usuário dono da tarefa
  title: string;
  description?: string;
  timeType: "cronometro" | "tempo_fixo";
  timeValue: number;
  timeSpend: number;
  statusChangedAt?: Date;
  status: TaskStatus;
  createdAt: Date;
}
