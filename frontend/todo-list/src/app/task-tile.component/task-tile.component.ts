import { Component, EventEmitter, Input, HostListener,input, Output } from '@angular/core';
import { Task } from '../models/task.model';

/**
 * Displays a single task tile, including the task text, checkbox.
 */
@Component({
  selector: 'app-task-tile',
  imports: [],
  templateUrl: './task-tile.component.html',
  styleUrls: ['./task-tile.component.scss']
})
export class TaskTileComponent {
   /** Task object passed in from parent component */
@Input() task?:Task;

/** Event emitted when user righ-click on the task */
@Output() openMenu = new EventEmitter<{ event: MouseEvent; task: Task }>();
// Output event emitter to notify parent when checked state toggles
@Output() toggleChecked = new EventEmitter<Task>();

openContextMenu(event: MouseEvent): void {
    event.preventDefault(); // Prevent the browser's right-click menu
    if (this.task) {
      this.openMenu.emit({ event, task: this.task });
    }
  }
  // Called when checkbox changes value
  onCheckedChange() {
    if (this.task) {
      this.toggleChecked.emit(this.task);
    }
  }
}


