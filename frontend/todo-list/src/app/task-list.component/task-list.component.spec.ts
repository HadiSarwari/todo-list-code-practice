import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TaskListComponent } from './task-list.component';
import { TaskTileComponent } from '../task-tile.component/task-tile.component';
import { TaskDataService } from '../services/task-data.service';
import { Task } from '../models/task.model';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

function makeTask(id: number, task = `T${id}`, checked = false): Task {
  return { id, task, checked } as Task;
}

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  let svc: jasmine.SpyObj<TaskDataService>;

  beforeEach(async () => {
    svc = jasmine.createSpyObj<TaskDataService>('TaskDataService', ['getTasks','addTask','deleteTask','updateTask']);
    svc.getTasks.and.returnValue(of([makeTask(1, 'A', false), makeTask(2, 'B', true)]));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        DragDropModule,
        TaskListComponent, 
        TaskTileComponent],      
      providers: [{ provide: TaskDataService, useValue: svc }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('loads tasks on init', () => {
    fixture.detectChanges();
    expect(component.tasks.length).toBe(2);
    expect(svc.getTasks).toHaveBeenCalled();
  });

  it('addTask adds via service and pushes result', () => {
    fixture.detectChanges();
    const created = makeTask(99, 'New', false);
    svc.addTask.and.returnValue(of(created));

    component.addTask(' New ');

    expect(svc.addTask).toHaveBeenCalled();
    expect(component.tasks.some(t => t.id === 99)).toBeTrue();
  });

  it('deleteTask confirms, calls service and removes item', () => {
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(true);
    svc.deleteTask.and.returnValue(of(void 0));

    const toDelete = component.tasks[0];
    component.deleteTask(toDelete);

    expect(svc.deleteTask).toHaveBeenCalledWith(toDelete.id);
    expect(component.tasks.find(t => t.id === toDelete.id)).toBeUndefined();
  });

  it('toggleChecked flips flag and persists via updateTask', () => {
    fixture.detectChanges();
    const t0 = { ...component.tasks[0] };
    const updated = { ...t0, checked: !t0.checked };
    svc.updateTask.and.returnValue(of(updated));

    component.toggleChecked(t0);

    expect(svc.updateTask).toHaveBeenCalled();
    const found = component.tasks.find(t => t.id === t0.id)!;
    expect(found.checked).toBe(updated.checked);
  });
});