# Pusha — EAS Build & Update Reference

## How versioning works

| Field | Where | What it controls |
|---|---|---|
| `version` | `app.json` + `package.json` | The version shown to users in the App Store / Play Store |
| `runtimeVersion` | `app.json` | Which OTA updates are compatible with which native builds. Change this only when native code changes |
| `versionCode` (Android) | Managed by EAS | Auto-incremented on every EAS build. Never touch manually |
| `buildNumber` (iOS) | Managed by EAS | Auto-incremented on every EAS build. Never touch manually |

---

## Build channels

| Profile | Channel | Purpose |
|---|---|---|
| `development` | `development` | Local dev client builds |
| `preview` | `preview` | Internal testing / QA |
| `production` | `production` | App Store + Play Store |

---

## Build script

All builds go through `pnpm build` which runs `scripts/build.js`.

### First build (ship at current version, no bump)

```bash
pnpm build --no-bump
```

### Standard builds (bumps version before building)

```bash
# Bug fix — 0.0.1 → 0.0.2
pnpm build

# New feature — 0.0.1 → 0.1.0
pnpm build minor

# Breaking / major release — 0.0.1 → 1.0.0
pnpm build major

# Explicit version
pnpm build 1.2.3
```

### When you change native code

Pass `--native` to also bump `runtimeVersion`. This tells EAS Update that existing
builds cannot receive OTA updates from this point forward — they need a new native build first.

```bash
# You added a new Expo plugin, changed permissions, or upgraded a native module
pnpm build patch --native
```

### Target a specific profile or platform

```bash
# Preview build for internal testers
pnpm build patch --profile preview

# Android only
pnpm build patch --platform android

# iOS only
pnpm build patch --platform ios
```

### Re-running a failed build (no version bump)

```bash
pnpm build --no-bump
```

### Bump versions only, no build

```bash
pnpm build patch --no-build
```

---

## OTA updates (no build required)

Use this for JS/UI-only changes. The update is pushed to all installed apps on the
matching channel instantly — no App Store review.

```bash
# Push to production
eas update --channel production --message "fix: cart total rounding"

# Push to preview
eas update --channel preview --message "wip: new dashboard layout"
```

> **Rule:** If you changed native code (plugins, permissions, native modules), do a
> full `pnpm build --native` instead. OTA updates only work for JS changes.

---

## When to bump `runtimeVersion`

Only bump when you've touched the **native layer**:

- Added or removed an Expo plugin in `app.json`
- Changed `android.permissions` or `ios` entitlements
- Upgraded a package that ships native code (e.g. `expo-camera`, `react-native-mmkv`)
- Changed `newArchEnabled`

For everything else (screens, components, API calls, styles), use `eas update`.

---

## EAS project details

| Key | Value |
|---|---|
| Project ID | `4a07fb65-9729-4b75-b1cf-12f622d1c3b2` |
| Owner | `pushahq` |
| Bundle ID (iOS) | `com.pushahq.app` |
| Package (Android) | `com.pushahq.app` |
| Updates URL | `https://u.expo.dev/4a07fb65-9729-4b75-b1cf-12f622d1c3b2` |
