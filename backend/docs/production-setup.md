# Production Deployment & Migration Guide

This guide provides the necessary steps to migrate your local setup to a production environment using **Mailgun** and a production **PostgreSQL** database.

## 1. Environment Configuration
Create a `.env` file on your production server with the following variables. 

> [!IMPORTANT]
> Change the secrets below to unique, long, and secure strings.

```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgres://user:password@hostname:5432/databasename

# Security (Min 32 characters)
JWT_SECRET=your_very_secure_long_access_token_secret
REFRESH_TOKEN_SECRET=your_very_secure_long_refresh_token_secret

# URLs
FRONTEND_URL=https://your-frontend-domain.com

# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_verified_domain.com
```

---

## 2. Database Migration
To migrate your local database schema to production:

### Option A: Running Migrations (Recommended)
Connect to your production database and run the migration files in order:
1. `src/db/migrations/001_init.sql`
2. `src/db/migrations/002_add_customer_and_chat.sql`
3. `src/db/migrations/003_add_password_reset.sql`

If you have `psql` installed on your machine and access to the production DB:
```bash
psql DATABASE_URL -f src/db/migrations/001_init.sql
psql DATABASE_URL -f src/db/migrations/002_add_customer_and_chat.sql
psql DATABASE_URL -f src/db/migrations/003_add_password_reset.sql
```

### Option B: Database Dump (Full Data)
If you want to migrate all current local data to production:
```bash
# Export local
pg_dump -d shipment_db -O -x > full_dump.sql

# Import to production
psql DATABASE_URL -f full_dump.sql
```

---

## 3. Deployment Checklist
- [ ] **SSL (HTTPS)**: Ensure your backend is served over HTTPS. The `Secure` flag for cookies is automatically enabled in production.
- [ ] **Mailgun Settings**: Ensure your Mailgun domain is verified and not in "Sandbox" mode to send to any email address.
- [ ] **CORS**: Verify `FRONTEND_URL` in `.env` matches your production frontend URL exactly (no trailing slash).

---

## 4. Post-Deployment
Run the admin creation script on the production server to set up your first account:
```bash
npm run create:admin
```
