export interface TaskDTO {
  id?: string;
  uid: string;
  title: string;
  description?: string;
  timeType: "cronometro" | "tempo_fixo";
  timeValue: number;
  timeSpend: number;
  status: "todo" | "doing" | "done";
  statusChangedAt?: { toDate: () => Date } | Date | null;
  createdAt: { toDate: () => Date } | Date;
}
