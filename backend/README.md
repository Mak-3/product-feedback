# ProdFeedback Backend

Node.js + Express API with Supabase for the ProdFeedback application.

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your Supabase credentials:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

3. **Setup database**
   
   Run the SQL in `database/schema.sql` in your Supabase SQL Editor to create the required tables.

4. **Start the server**
   ```bash
   npm run dev    # Development with hot reload
   npm start      # Production
   ```

## API Endpoints

### Health
- `GET /health` - Health check

### Feedback
- `GET /api/feedback` - List all feedback
- `GET /api/feedback/:id` - Get feedback by ID
- `POST /api/feedback` - Create feedback
- `PATCH /api/feedback/:id` - Update feedback (auth required)
- `DELETE /api/feedback/:id` - Delete feedback (auth required)
- `POST /api/feedback/:id/vote` - Vote on feedback

### Projects
- `GET /api/projects` - List user's projects (auth required)
- `GET /api/projects/:id` - Get project by ID (auth required)
- `POST /api/projects` - Create project (auth required)
- `PATCH /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

## Authentication

Include the Supabase access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

