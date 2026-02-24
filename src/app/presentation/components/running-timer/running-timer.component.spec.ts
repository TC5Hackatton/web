import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks
} from "@angular/core/testing";
import { RunningTimerComponent } from "./running-timer.component";
import { Task } from "../../../domain/models/task.model";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  uid: "user-1",
  title: "Test Task",
  description: "",
  timeType: "tempo_fixo",
  timeValue: 25,
  timeSpend: 0,
  status: "doing",
  statusChangedAt: new Date(),
  createdAt: new Date(),
  ...overrides
});

describe("RunningTimerComponent", () => {
  let component: RunningTimerComponent;
  let fixture: ComponentFixture<RunningTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningTimerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RunningTimerComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    fixture.componentRef.setInput("task", makeTask());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("when task is in 'doing' status", () => {
    it("should start the interval timer on init", fakeAsync(() => {
      const startedAt = new Date(Date.now() - 61_000);
      fixture.componentRef.setInput("task", makeTask({ statusChangedAt: startedAt }));
      fixture.detectChanges();

      tick(1000);

      expect(component.minutes).toBeGreaterThanOrEqual(1);
      discardPeriodicTasks();
    }));

    it("should format seconds with leading zero", fakeAsync(() => {
      const startedAt = new Date(Date.now() - 5_000);
      fixture.componentRef.setInput("task", makeTask({ statusChangedAt: startedAt }));
      fixture.detectChanges();

      tick(0);

      expect(component.secondsStr).toMatch(/^\d{2}$/);
      discardPeriodicTasks();
    }));
  });

  describe("when task is NOT in 'doing' status", () => {
    it("should NOT start the interval timer", fakeAsync(() => {
      const task = makeTask({ status: "todo", statusChangedAt: undefined });
      fixture.componentRef.setInput("task", task);
      fixture.detectChanges();

      expect(component.minutes).toBe(0);
      expect(component.secondsStr).toBe("00");
    }));
  });

  describe("when task has no statusChangedAt", () => {
    it("should NOT update elapsed time", fakeAsync(() => {
      const task = makeTask({ status: "doing", statusChangedAt: undefined });
      fixture.componentRef.setInput("task", task);
      fixture.detectChanges();

      expect(component.minutes).toBe(0);
      expect(component.secondsStr).toBe("00");
    }));
  });

  describe("ngOnDestroy", () => {
    it("should clear the interval on destroy", fakeAsync(() => {
      const startedAt = new Date(Date.now() - 1_000);
      fixture.componentRef.setInput("task", makeTask({ statusChangedAt: startedAt }));
      fixture.detectChanges();

      const clearSpy = jest.spyOn(window, "clearInterval");
      fixture.destroy();

      expect(clearSpy).toHaveBeenCalled();
    }));
  });
});
