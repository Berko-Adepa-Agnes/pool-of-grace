@echo off
echo Starting PostgreSQL for Pool of Grace...
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D "%USERPROFILE%\pgdata_poolofgrace" -l "%USERPROFILE%\pg_poolofgrace.log" start
timeout /t 3 /nobreak > nul
echo PostgreSQL started. You can now run the backend server.
