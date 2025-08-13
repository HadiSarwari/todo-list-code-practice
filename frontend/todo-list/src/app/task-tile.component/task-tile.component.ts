import { Component, EventEmitter, Input, HostListener,input, Output } from '@angular/core';
import { Task } from '../models/task.model';

/** Presents a single task with a checkbox and context-menu hook. */
@Component({
  selector: 'app-task-tile',
  imports: [],
  templateUrl: './task-tile.component.html',
  styleUrls: ['./task-tile.component.scss']
})
export class TaskTileComponent {
   /** Task object passed in from parent component */
@Input() task?:Task;

/** Emitted on right-click to request a context menu. */
@Output() openMenu = new EventEmitter<{ event: MouseEvent; task: Task }>();
// Notifies parent when the checked state changes
@Output() toggleChecked = new EventEmitter<Task>();

openContextMenu(event: MouseEvent): void {
    event.preventDefault(); // Prevent the browser's right-click menu
    if (this.task) {
      this.openMenu.emit({ event, task: this.task });
    }
  }
 // Emit the updated task when checkbox changes
  onCheckedChange() {
    if (this.task) {
      this.toggleChecked.emit(this.task);
    }
  }
}


