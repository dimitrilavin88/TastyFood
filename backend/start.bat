@echo off
REM Set your SQLite Cloud connection URL here
REM Replace with your actual cloud SQLite database connection string
set SQLITE_CLOUD_URL=jdbc:sqlite:sqlitecloud://cc6hhhazdk.g6.sqlite.cloud:8860/auth.sqlitecloud?apikey=Q9gkxfewbbH7JyaQNWUkzv2bbvFagVT5l8bTHIwN01Y

REM Optional: Set username and password if required by your cloud provider
REM set SQLITE_CLOUD_USER=your-username
REM set SQLITE_CLOUD_PASSWORD=your-password

echo Starting TastyFood Backend...
echo Connecting to SQLite Cloud database...

mvn spring-boot:run
