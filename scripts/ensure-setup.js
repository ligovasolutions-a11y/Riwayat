#!/usr/bin/env node
/*
 * Self-healing project setup. Runs automatically before "npm run dev"
 * and "npm run start" (see the "predev"/"prestart" scripts in
 * package.json) so a freshly downloaded/cloned copy of this project
 * fixes its own missing .env file, database, and starter content
 * without anyone having to run manual setup commands.
 *
 * Every step here is safe to run again and again — if something is
 * already done, it's skipped or left alone.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const envExamplePath = path.join(root, '.env.example');

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: root });
}

// 1. Create .env from .env.example if it's missing. Never overwrite an
//    existing .env — it may hold real values someone already set.
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('Created .env from .env.example (first-time setup).');
  } else {
    console.error(
      '\nERROR: Neither .env nor .env.example was found.\n' +
      'This project cannot start without one of these files in its main folder.\n'
    );
    process.exit(1);
  }
}

// 2. Make sure the database file exists and has all its tables.
//    "migrate deploy" only applies whatever hasn't been applied yet —
//    running it again on an already-set-up database does nothing.
try {
  run('npx prisma migrate deploy');
} catch (err) {
  console.error('\nCould not set up the database. See the error above.');
  process.exit(1);
}

// 3. Fill in starter content, but only if the database is empty.
//    prisma/seed.ts already checks row counts before inserting, so
//    this is safe to run on every startup too.
try {
  run('npx prisma db seed');
} catch (err) {
  console.error('\nCould not add starter content. See the error above.');
  process.exit(1);
}

console.log('\nSetup check complete — starting the website...\n');
