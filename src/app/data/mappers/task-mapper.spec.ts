import { TaskMapper } from "./task-mapper";
import { Task, TaskStatus } from "../../domain/models/task.model";
import { TaskDTO } from "../dtos/task-dto";

describe("TaskMapper", () => {
  const mockDate = new Date("2023-01-01T00:00:00Z");
  const mockTimestamp = { toDate: () => mockDate };

  const mockDto: TaskDTO = {
    id: "1",
    uid: "user123",
    title: "Test Task",
    description: "Description",
    timeType: "cronometro",
    timeValue: 30,
    timeSpend: 10,
    status: "todo",
    statusChangedAt: mockTimestamp,
    createdAt: mockTimestamp
  };

  const mockDomain = Task.create({
    id: "1",
    uid: "user123",
    title: "Test Task",
    description: "Description",
    timeType: "cronometro",
    timeValue: 30,
    timeSpend: 10,
    status: "todo" as TaskStatus,
    statusChangedAt: mockDate,
    createdAt: mockDate
  });

  describe("fromDtoToDomain", () => {
    it("should map DTO to Domain with Timestamp", () => {
      const result = TaskMapper.fromDtoToDomain(mockDto);
      expect(result.id).toBe(mockDto.id);
      expect(result.createdAt).toEqual(mockDate);
      expect(result.statusChangedAt).toEqual(mockDate);
    });

    it("should map DTO to Domain with Date", () => {
      const dtoWithDate: TaskDTO = {
        ...mockDto,
        statusChangedAt: mockDate,
        createdAt: mockDate
      };
      const result = TaskMapper.fromDtoToDomain(dtoWithDate);
      expect(result.createdAt).toEqual(mockDate);
      expect(result.statusChangedAt).toEqual(mockDate);
    });

    it("should handle null statusChangedAt", () => {
      const dtoWithNull: TaskDTO = {
        ...mockDto,
        statusChangedAt: null
      };
      const result = TaskMapper.fromDtoToDomain(dtoWithNull);
      expect(result.statusChangedAt).toBeNull();
    });
  });

  describe("fromDomainToDto", () => {
    it("should map Domain to DTO", () => {
      const result = TaskMapper.fromDomainToDto(mockDomain);
      expect(result.id).toBe(mockDomain.id);
      expect(result.title).toBe(mockDomain.title);
      expect(result.createdAt).toEqual(mockDomain.createdAt);
      expect(result.statusChangedAt).toEqual(mockDomain.statusChangedAt);
    });

    it("should handle empty uid in domain", () => {
      const domainWithEmptyUid = mockDomain.copyWith({ uid: "" });
      const result = TaskMapper.fromDomainToDto(domainWithEmptyUid);
      expect(result.uid).toBe("");
    });
  });
});
