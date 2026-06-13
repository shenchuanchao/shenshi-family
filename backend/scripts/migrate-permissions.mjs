// Run once to add role/status/author_id columns
// Usage: SUPABASE_URL=xxx SUPABASE_SERVICE_KEY=xxx node scripts/migrate-permissions.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variable");
  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const queries = [
  // 1. Add role column to users
  `ALTER TABLE shen_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'`,
  // 2. Add status column to articles
  `ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published'`,
  // 3. Add author_id column to articles (the user who submitted/created the article)
  `ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES shen_users(id)`,
];

async function main() {
  for (const sql of queries) {
    console.log(`Running: ${sql.substring(0, 60)}...`);
    const { error } = await supabase.rpc("exec_sql", { sql });
    if (error) {
      console.error(`Failed: ${error.message}`);
      // Try direct REST API as fallback
      const res = await fetch(
        `${supabase.supabaseUrl}/rest/v1/rpc/exec_sql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabase.supabaseKey,
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
          body: JSON.stringify({ sql }),
        }
      );
      const data = await res.json();
      console.log("REST result:", res.status, data);
    } else {
      console.log("OK");
    }
  }
  console.log("Done.");
}

main().catch(console.error);