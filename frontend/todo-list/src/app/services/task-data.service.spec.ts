import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskDataService  } from './task-data.service';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

describe('TaskDataService', () => {
  let service: TaskDataService;
  let http: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskDataService]
    });
    service = TestBed.inject(TaskDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets tasks', () => {
    const mock: Task[] = [{ id: 1, task: 'A', checked: false }];

    service.getTasks().subscribe(res => expect(res).toEqual(mock));

    const req = http.expectOne(`${baseUrl}/items`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('adds a task', () => {
    const input: Task = { id: 0, task: 'New', checked: false };
    const created: Task = { id: 42, task: 'New', checked: false };

    service.addTask(input).subscribe(res => expect(res).toEqual(created));

    const req = http.expectOne(`${baseUrl}/items`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush(created);
  });

  it('deletes a task', () => {
    service.deleteTask(7).subscribe(res => expect(res).toBeNull());

    const req = http.expectOne(`${baseUrl}/items/7`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('updates a task', () => {
    const input: Task = { id: 7, task: 'X', checked: true };

    service.updateTask(input).subscribe(res => expect(res).toEqual(input));

    const req = http.expectOne(`${baseUrl}/items/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(input);
    req.flush(input);
  });
});
