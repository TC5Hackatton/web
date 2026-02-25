import { Task, TaskStatus } from "../../domain/models/task.model";
import { TaskDTO } from "../dtos/task-dto";

export class TaskMapper {
  static fromDtoToDomain(dto: TaskDTO): Task {
    const statusChangedAt = dto.statusChangedAt;
    const createdAt = dto.createdAt;

    return Task.create({
      id: dto.id,
      uid: dto.uid,
      title: dto.title,
      description: dto.description,
      timeType: dto.timeType,
      timeValue: dto.timeValue,
      timeSpend: dto.timeSpend,
      status: dto.status as TaskStatus,
      statusChangedAt:
        statusChangedAt && "toDate" in statusChangedAt
          ? statusChangedAt.toDate()
          : (statusChangedAt as Date | undefined),
      createdAt: createdAt && "toDate" in createdAt ? createdAt.toDate() : (createdAt as Date)
    });
  }

  static fromDomainToDto(domain: Task): TaskDTO {
    return {
      id: domain.id,
      uid: domain.uid || "",
      title: domain.title,
      description: domain.description,
      timeType: domain.timeType,
      timeValue: domain.timeValue,
      timeSpend: domain.timeSpend,
      status: domain.status,
      statusChangedAt: domain.statusChangedAt || null,
      createdAt: domain.createdAt
    };
  }
}
