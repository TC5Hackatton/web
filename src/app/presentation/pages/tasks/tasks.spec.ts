import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TasksPage } from "./tasks";
import { TaskService } from "../../core/services/task.service";
// import { signal } from "@angular/core";

// Mock Firebase
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../../api/firebase", () => ({ auth: {}, db: {} }));

describe("TasksPage", () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;
  let taskServiceSpy: { getTasks: jest.Mock; updateTaskStatus: jest.Mock };

  beforeEach(async () => {
    taskServiceSpy = {
      getTasks: jest.fn().mockResolvedValue([]),
      updateTaskStatus: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TasksPage],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
