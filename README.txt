To-Do List (Angular + .NET 8)

Run in Windows Sandbox (clean Windows, no installs on your PC)

1) Turn on Windows Sandbox (one time)
   Start → “Turn Windows features on or off” → check “Windows Sandbox” → OK → reboot.
   Then open “Windows Sandbox”.

2) One click to run everything
   - Save the file “bootstrap-and-run-https.bat” to the Sandbox Desktop.
   - Right-click → Run as administrator.
   - You will see:
     • A window “API” starting the backend (HTTPS).
       Windows may ask to trust a developer certificate → click YES.
     • A window “Angular” installing and starting the web app.
     • Your browser opens: http://localhost:4200

3) (Optional) See tests pass— use CMD
   API tests:
     cd %USERPROFILE%\Desktop\todo-list-code-practice\api\TodoListApi.Tests
     dotnet test
   UI tests (headless):requires Google Chrome installed inside the Sandbox.
     If you want to run UI tests, install Chrome in the Sandbox first, then:
     cd %USERPROFILE%\Desktop\todo-list-code-practice\frontend\todo-list
     npx ng test --watch=false --browsers=ChromeHeadless

4) Use the app
   - Open http://localhost:4200
   - Add a task, right-click to delete, drag to reorder.

Close the two black windows to stop. Closing Windows Sandbox wipes everything.
