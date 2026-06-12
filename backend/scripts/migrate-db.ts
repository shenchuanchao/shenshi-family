import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const SUPABASE_URL = "https://ijmexvfsskfckmwlkynn.supabase.co";
const SERVICE_KEY = "REDACTED_SERVICE_KEY";

// Try via supabase-js management API
async function tryMgmtApi() {
  const projectRef = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];
  if (!projectRef) throw new Error("Cannot parse project ref");

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "ALTER TABLE shen_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'",
      }),
    }
  );
  console.log("Management API status:", res.status);
  if (res.ok) {
    const data = await res.json();
    console.log("Success:", JSON.stringify(data).slice(0, 200));
    return true;
  }
  return false;
}

// Try via pg direct connection
async function tryPgDirect() {
  // Supabase direct connection using pooler
  const poolerConfig = {
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    user: "postgres.ijmexvfsskfckmwlkynn",
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false },
  };

  const pool = new pg.Pool(poolerConfig);
  try {
    const client = await pool.connect();
    console.log("Connected via pg pooler!");
    
    const queries = [
      `ALTER TABLE shen_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'`,
      `ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published'`,
      `ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS author_id UUID`,
    ];

    for (const sql of queries) {
      console.log(`Running: ${sql.substring(0, 60)}...`);
      await client.query(sql);
      console.log("OK");
    }
    
    client.release();
    await pool.end();
    return true;
  } catch (err: any) {
    console.error("pg pooler failed:", err.message);
    
    // Try session mode (port 5432)
    const sessionConfig = {
      host: "db.ijmexvfsskfckmwlkynn.supabase.co",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: SERVICE_KEY,
      ssl: { rejectUnauthorized: false },
    };
    
    const pool2 = new pg.Pool(sessionConfig);
    try {
      const client2 = await pool2.connect();
      console.log("Connected via pg session mode!");
      
      const queries = [
        `ALTER TABLE shen_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'`,
        `ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published'`,
        `ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS author_id UUID`,
      ];

      for (const sql of queries) {
        console.log(`Running: ${sql.substring(0, 60)}...`);
        await client2.query(sql);
        console.log("OK");
      }
      
      client2.release();
      await pool2.end();
      return true;
    } catch (err2: any) {
      console.error("pg session mode also failed:", err2.message);
      return false;
    }
  }
}

async function main() {
  console.log("Trying management API...");
  const mgmtOk = await tryMgmtApi();
  if (mgmtOk) {
    console.log("Migration complete via management API.");
    return;
  }

  console.log("\nTrying pg direct connection...");
  const pgOk = await tryPgDirect();
  if (pgOk) {
    console.log("Migration complete via pg.");
    return;
  }

  console.log("\nBoth methods failed. Please run the following SQL manually in Supabase SQL editor:");
  console.log("---");
  console.log("ALTER TABLE shen_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';");
  console.log("ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';");
  console.log("ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS author_id UUID;");
  console.log("---");
}

main().catch(console.error);