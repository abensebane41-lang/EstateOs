#!/usr/bin/env node

/**
 * Creates or promotes a user to SUPER_ADMIN.
 *
 * Usage:
 *   node scripts/create-super-admin.cjs <email> <password> [name]
 *
 * This script calls the /api/seed endpoint which uses Better Auth
 * for proper password hashing.
 */

const http = require("http");

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || "مدير النظام";

if (!email || !password) {
  console.log("Usage: node scripts/create-super-admin.cjs <email> <password> [name]");
  process.exit(1);
}

const body = JSON.stringify({ email, password, name });
const port = process.env.PORT || 3005;

const req = http.request(
  {
    hostname: "localhost",
    port,
    path: "/api/seed",
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      if (res.statusCode === 200) {
        console.log("Success:", data);
      } else {
        console.error("Failed (" + res.statusCode + "):", data);
        process.exit(1);
      }
    });
  }
);

req.on("error", (err) => {
  console.error("Error:", err.message);
  console.error("Make sure the dev server is running on port " + port);
  process.exit(1);
});

req.write(body);
req.end();
