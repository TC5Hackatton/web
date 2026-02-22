export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id?: string;
  uid: string; // ID do usuário dono da tarefa
  title: string;
  description?: string;
  timeType: "cronometro" | "tempo_fixo";
  timeValue: number; // Tempo estimado/planeado (adicionado)
  timeSpend: number; // Tempo total já gasto na execução
  statusChangedAt?: Date; // Guarda a hora exata em que o status mudou para "doing"
  status: TaskStatus;
  createdAt: Date;
}
