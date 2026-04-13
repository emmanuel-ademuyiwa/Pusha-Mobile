#!/usr/bin/env node

/**
 * Pusha Build Script
 *
 * Usage:
 *   node scripts/build.js [bump] [options]
 *
 * Bump types:
 *   patch           0.0.1 → 0.0.2  (default — bug fixes)
 *   minor           0.0.1 → 0.1.0  (new features)
 *   major           0.0.1 → 1.0.0  (breaking changes)
 *   1.2.3           set an explicit version
 *
 * Options:
 *   --profile       EAS build profile: production (default), preview, development
 *   --platform      android, ios, or all (default)
 *   --native        also bumps runtimeVersion (use when you've changed native code
 *                   or added/removed native modules — required for OTA updates to
 *                   be compatible with the new build)
 *   --no-bump       build at the current version without incrementing (use for
 *                   the very first build, or when re-running a failed build)
 *   --no-build      only bumps versions, skips the EAS build step
 */

const fs = require('fs')
const path = require('path')
const {execSync} = require('child_process')

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..')
const APP_JSON = path.join(ROOT, 'app.json')
const PKG_JSON = path.join(ROOT, 'package.json')

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)

const noBump = args.includes('--no-bump')
const bumpArg = args.find(a => !a.startsWith('--')) ?? 'patch'
const profile = argValue(args, '--profile') ?? 'production'
const platform = argValue(args, '--platform') ?? 'all'
const bumpNative = args.includes('--native')
const noBuild = args.includes('--no-build')

function argValue(list, flag) {
  const i = list.indexOf(flag)
  return i !== -1 ? list[i + 1] : undefined
}

// ─── Version helpers ──────────────────────────────────────────────────────────

function bumpVersion(current, type) {
  if (/^\d+\.\d+\.\d+$/.test(type)) return type // explicit version passed
  const [major, minor, patch] = current.split('.').map(Number)
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      throw new Error(
        `Unknown bump type "${type}". Use patch, minor, major, or an explicit version like 1.2.3`
      )
  }
}

// ─── Read files ───────────────────────────────────────────────────────────────

const appJson = JSON.parse(fs.readFileSync(APP_JSON, 'utf8'))
const pkgJson = JSON.parse(fs.readFileSync(PKG_JSON, 'utf8'))

const currentVersion = appJson.expo.version
const currentRuntime = appJson.expo.runtimeVersion

const newVersion = noBump ? currentVersion : bumpVersion(currentVersion, bumpArg)
const newRuntime = bumpNative ? newVersion : currentRuntime

// ─── Print plan ───────────────────────────────────────────────────────────────

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  Pusha Build')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
if (noBump) {
  console.log(`  version         ${currentVersion}  (no bump)`)
  console.log(`  runtimeVersion  ${currentRuntime}  (no bump)`)
} else {
  console.log(`  version         ${currentVersion}  →  ${newVersion}`)
  console.log(
    `  runtimeVersion  ${currentRuntime}  →  ${newRuntime}${bumpNative ? '' : '  (unchanged — use --native to bump)'}`
  )
}
console.log(`  profile         ${profile}`)
console.log(`  platform        ${platform}`)
console.log(`  build           ${noBuild ? 'skipped (--no-build)' : 'yes'}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

// ─── Update files (skip if --no-bump and nothing changed) ─────────────────────

if (!noBump) {
  appJson.expo.version = newVersion
  appJson.expo.runtimeVersion = newRuntime
  fs.writeFileSync(APP_JSON, JSON.stringify(appJson, null, 2) + '\n')
  console.log(`[1/3] app.json updated`)

  pkgJson.version = newVersion
  fs.writeFileSync(PKG_JSON, JSON.stringify(pkgJson, null, 2) + '\n')
  console.log(`[2/3] package.json updated`)

  try {
    execSync(`git add ${APP_JSON} ${PKG_JSON}`, {cwd: ROOT, stdio: 'inherit'})
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, {
      cwd: ROOT,
      stdio: 'inherit'
    })
    console.log(`[3/3] Committed version bump`)
  } catch {
    console.log(`[3/3] Git commit skipped (nothing to commit or no git repo)`)
  }
} else {
  console.log(`[1/3] app.json — no changes (--no-bump)`)
  console.log(`[2/3] package.json — no changes (--no-bump)`)
  console.log(`[3/3] Git commit skipped (--no-bump)`)
}

// ─── EAS Build ────────────────────────────────────────────────────────────────

if (noBuild) {
  console.log('\nDone. Skipped build (--no-build).')
  process.exit(0)
}

console.log(
  `\nStarting EAS build — profile: ${profile}, platform: ${platform}\n`
)

try {
  execSync(`eas build --platform ${platform} --profile ${profile}`, {
    cwd: ROOT,
    stdio: 'inherit'
  })
} catch (err) {
  console.error('\nEAS build failed.')
  process.exit(1)
}
