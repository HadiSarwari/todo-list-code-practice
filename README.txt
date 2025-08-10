To-Do List – API (.NET) + Angular

This is a simple full-stack to-do list project with a .NET API and an Angular frontend,
plus unit tests on both sides. The goal is to be easy to set up and verify from a clean machine.

==================================================
1) Requirements
==================================================
- .NET SDK 8.x
- Node.js LTS (includes npm)
- Git

Optional for tests:
- Google Chrome (for Karma). If unavailable, use headless mode (see below).

==================================================
2) Folder Layout (relative to repo root)
==================================================
api/
  TodoListApi/            -> ASP.NET Core API
  TodoListApi.Tests/      -> xUnit tests for the API
frontend/
  todo-list/              -> Angular app

==================================================
3) Quick Start
==================================================
A) Clone the repo
-----------------
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
cd <YOUR_REPO>

B) Run the API
--------------
cd api/TodoListApi
dotnet restore
dotnet run
# The API will start. Example: https://localhost:7181

C) Configure the Angular app
----------------------------
Create this file once if it does not exist:

frontend/todo-list/src/environments/environment.ts
--------------------------------------------------
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7181'
};

D) Run the Angular app
----------------------
cd ../../frontend/todo-list
npm ci        # or: npm install
npx ng serve  # open http://localhost:4200

==================================================
4) Unit Tests
==================================================
API tests (xUnit)
-----------------
cd api/TodoListApi.Tests
dotnet test

Angular tests (Jasmine/Karma)
-----------------------------
cd ../../frontend/todo-list
npx ng test

Headless (no browser window):
npx ng test --watch=false --browsers=ChromeHeadless

==================================================
5) Notes
==================================================
- Keep API base URL in one place: frontend/todo-list/src/environments/environment.ts
- Angular uses standalone components. In tests, import standalone components via TestBed.imports.

==================================================
6) Troubleshooting (short)
==================================================
- Angular CLI error: “outside a workspace”
  -> Run commands from the folder that contains angular.json (frontend/todo-list).

- Tests say: No provider for _HttpClient
  -> In the spec file, import HttpClientTestingModule.

- DELETE tests: expect null (toBeNull()), not undefined.

- Git: ignore compiled/junk files
  -> Add .gitignore entries such as: .vs/, bin/, obj/, node_modules/, dist/, coverage/

==================================================
7) Clean Machine Test (optional)
==================================================
- Windows Sandbox (on Windows Pro): launch a disposable VM, install .NET, Node, Git,
  then follow the Quick Start steps.
- Or use another PC/VM to verify the steps work as written.

==================================================
8) Common Commands (reference)
==================================================
# API
cd api/TodoListApi
dotnet build
dotnet run

# API tests
cd ../TodoListApi.Tests
dotnet test

# Angular
cd ../../frontend/todo-list
npm ci
npx ng serve

# Angular tests
npx ng test
