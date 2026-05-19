# hair-booking-backend# Hair Booking Backend

A Node.js + Express backend for managing hair booking appointments, notifications, and integrations.

## 🚀 Getting Started (without Docker)

### 1. Clone the repository
```bash
git clone https://github.com/maamedtr/hair-booking-site.git
cd hair-booking-backend

2. Install dependencies

npm install

3. Set up PostgreSQL
Install PostgreSQL locally (or use a managed service).

Create a database named hairbooking.

Update DATABASE_URL in .env with your credentials.

4.Run Prisma migrations.
npx prisma migrate dev

5.Start the server
npm run dev

6.Test endpoints
API Docs: http://localhost:5001/api-docs

Health Check: http://localhost:5001/health

7.Background Jobs
When the server starts, background jobs are automatically initialized:

Daily reminders → Sends SMS/email reminders to clients about upcoming appointments.

Google Calendar sync → Syncs appointments with Google Calendar if credentials are configured.

Queue monitoring → Exposes /jobs/stats endpoint to check reminder job status.

Service verification → Confirms email, SMS, and calendar services are properly configured before jobs run.

8.Environment Variables Explained
PORT → Port where the server runs (default: 5001).

DATABASE_URL → Connection string for PostgreSQL.

JWT_SECRET → Secret key for signing JWT tokens.

TIMEZONE → Default timezone for reminders and date helpers.

GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI → Required for Google Calendar OAuth integration.


Notes
Docker is not required. PostgreSQL must be installed locally or provided by a cloud service.

If you want to containerize later, you can reintroduce docker-compose.yaml.