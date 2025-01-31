# Supabase CLI Project Setup and Management Guide

This guide will walk you through setting up and managing a Supabase project using the Supabase CLI, including how to apply your schema to both new and existing projects.

## Prerequisites

1. Install Node.js (version 14 or later)
2. Install the Supabase CLI:
   ```
   npm install -g supabase
   ```

## Setting Up the Supabase Project

1. **Start the local Supabase instance**

   ```
   supabase start
   ```

   This starts a local Docker instance of Supabase.

2. **Apply your schema**

   ```
   supabase db push
   ```

   This applies your `schema.sql` to the local database.

3. **Create a new project on Supabase.com**

   ```
   supabase link --project-ref your-project-ref
   ```

   Replace `your-project-ref` with the reference ID from your Supabase.com project.

4. **Push your local schema to the remote project**
   ```
   supabase db push
   ```
   This applies your schema to the remote Supabase project.

## Merging Schema with an Existing Project

1. **Link your local setup to the existing Supabase project**

   ```
   supabase link --project-ref your-existing-project-ref
   ```

2. **Pull the current schema**

   ```
   supabase db pull
   ```

   This creates a `supabase/migrations` directory with the current schema.

3. **Merge your new schema**
   Manually merge your new schema into the pulled migration files. Be careful to:

   - Use `CREATE TABLE IF NOT EXISTS` to avoid conflicts
   - Use `ALTER TABLE` for adding new columns to existing tables
   - Review and adjust constraints and policies

4. **Apply the merged schema locally**

   ```
   supabase db push
   ```

   Test thoroughly on your local instance.

5. **Push changes to the remote project**
   ```
   supabase db push --db-url YOUR_PRODUCTION_DATABASE_URL
   ```
   Replace `YOUR_PRODUCTION_DATABASE_URL` with your actual database URL.

## Managing Migrations

- **Create a new migration**

  ```
  supabase migration new your_migration_name
  ```

  This creates a new timestamped SQL file in `supabase/migrations`.

- **Apply migrations**
  ```
  supabase db push
  ```
  This applies any new migrations to your database.

## Best Practices

1. **Version Control**: Commit your `supabase` directory to version control.
2. **Incremental Changes**: Make small, incremental changes and test thoroughly.
3. **Backup**: Always backup your production database before applying major changes.
4. **Testing**: Test all changes locally before pushing to production.
5. **Review**: Carefully review auto-generated migration files.

## Troubleshooting

- If you encounter errors, check the Supabase logs:
  ```
  supabase logs
  ```
- For issues with RLS policies, review them in your migration files.
- If the `handle_new_user` function isn't working, verify the structure of the `auth.users` table in your schema.

Remember, always test in a development environment before applying changes to production!
