-- Create projects table
CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "client" "text",
    "hourly_rate" DECIMAL(10, 2),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);

-- Create time entries table
CREATE TABLE IF NOT EXISTS "public"."time_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "description" "text",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone,
    "duration" integer, -- Duration in seconds
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tags" "text"[],
    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "time_entries_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE,
    CONSTRAINT "time_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);

-- Enable RLS on new tables
ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."time_entries" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Enable read for users based on user_id" ON "public"."projects" 
    FOR SELECT USING ((auth.uid() = user_id));
    
CREATE POLICY "Enable insert for authenticated users" ON "public"."projects" 
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
    
CREATE POLICY "Enable update for users based on user_id" ON "public"."projects" 
    FOR UPDATE USING ((auth.uid() = user_id));
    
CREATE POLICY "Enable delete for users based on user_id" ON "public"."projects" 
    FOR DELETE USING ((auth.uid() = user_id));

-- Create RLS policies for time entries
CREATE POLICY "Enable read for users based on user_id" ON "public"."time_entries" 
    FOR SELECT USING ((auth.uid() = user_id));
    
CREATE POLICY "Enable insert for authenticated users" ON "public"."time_entries" 
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
    
CREATE POLICY "Enable update for users based on user_id" ON "public"."time_entries" 
    FOR UPDATE USING ((auth.uid() = user_id));
    
CREATE POLICY "Enable delete for users based on user_id" ON "public"."time_entries" 
    FOR DELETE USING ((auth.uid() = user_id));
