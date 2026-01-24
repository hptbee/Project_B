# The Coffee Cream Project

## 📂 Project Structure
- **api/**: ASP.NET Core Web API (Backend)
- **mobile/**: Capacitor/React Native Apps (Frontend)

## 🚀 Deployment (Render)

### Prevent Sleep (Free Tier)
Render's free tier spins down after 15 minutes of inactivity. To prevent this:
1.  Use a monitoring service (e.g., **UptimeRobot**, **Cron-job.org**).
2.  Configure it to ping your API's health check endpoint:
    - URL: `https://<your-app-url>/health`
    - Interval: **Every 13 minutes** (Safe buffer before 15min timeout).
