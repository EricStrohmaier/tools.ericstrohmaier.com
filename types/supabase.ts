import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./supabase_generated";
import { SupabaseClient } from "@supabase/supabase-js";

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        apartment_costs: {
          Row: {
            // make them optional
            id?: number;
            created_at?: string;
          };
        };
      };
    };
  }
>;
export type TypedSupabaseClient = SupabaseClient<Database>;


export type User = Database["public"]["Tables"]["users"]["Row"];