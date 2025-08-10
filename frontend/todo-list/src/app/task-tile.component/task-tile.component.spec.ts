import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TaskTileComponent } from './task-tile.component';
import { Task } from '../models/task.model';

describe('TaskTileComponent', () => {
  let fixture: ComponentFixture<TaskTileComponent>;
  let component: TaskTileComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({  
       imports: [TaskTileComponent]         
    }).compileComponents();

    fixture = TestBed.createComponent(TaskTileComponent);
    component = fixture.componentInstance;
  });

  it('renders checkbox and task text', () => {
    component.task = { id: 1, task: 'Hello', checked: true } as Task;
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    const text = fixture.debugElement.query(By.css('p')).nativeElement as HTMLParagraphElement;

    expect(checkbox.checked).toBeTrue();
    expect(text.textContent?.trim()).toBe('Hello');
  });

  it('emits toggleChecked on change', () => {
    const task: Task = { id: 2, task: 'Toggle', checked: false };
    component.task = task;
    spyOn(component.toggleChecked, 'emit');
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    checkbox.dispatchEvent(new Event('change'));

    expect(component.toggleChecked.emit).toHaveBeenCalledWith(task);
  });

  it('emits openMenu on right-click', () => {
    const task: Task = { id: 3, task: 'Menu', checked: false };
    component.task = task;
    spyOn(component.openMenu, 'emit');
    fixture.detectChanges();

    const tile = fixture.debugElement.query(By.css('.task-tile'));
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    tile.nativeElement.dispatchEvent(event);

    expect(component.openMenu.emit).toHaveBeenCalled();
    const payload = (component.openMenu.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(payload.task).toEqual(task);
  });
});