export type TaskStatus = "todo" | "doing" | "done";

export class Task {
  constructor(
    public readonly id: string | undefined,
    public readonly uid: string,
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly timeType: "cronometro" | "tempo_fixo",
    public readonly timeValue: number,
    public readonly timeSpend: number,
    public readonly status: TaskStatus,
    public readonly createdAt: Date,
    public readonly statusChangedAt?: Date
  ) {}

  static create(params: {
    id?: string;
    uid: string;
    title: string;
    description?: string;
    timeType: "cronometro" | "tempo_fixo";
    timeValue: number;
    timeSpend: number;
    status: TaskStatus;
    createdAt: Date;
    statusChangedAt?: Date;
  }): Task {
    return new Task(
      params.id,
      params.uid,
      params.title,
      params.description,
      params.timeType,
      params.timeValue,
      params.timeSpend,
      params.status,
      params.createdAt,
      params.statusChangedAt
    );
  }

  copyWith(changes: Partial<Task>): Task {
    return new Task(
      "id" in changes ? changes.id : this.id,
      changes.uid !== undefined ? changes.uid : this.uid,
      changes.title !== undefined ? changes.title : this.title,
      "description" in changes ? changes.description : this.description,
      changes.timeType !== undefined ? changes.timeType : this.timeType,
      changes.timeValue !== undefined ? changes.timeValue : this.timeValue,
      changes.timeSpend !== undefined ? changes.timeSpend : this.timeSpend,
      changes.status !== undefined ? changes.status : this.status,
      changes.createdAt !== undefined ? changes.createdAt : this.createdAt,
      "statusChangedAt" in changes ? changes.statusChangedAt : this.statusChangedAt
    );
  }
}
