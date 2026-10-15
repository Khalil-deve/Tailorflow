# TailorFlow

TailorFlow is a mobile-first tailoring shop manager built with Expo and React Native. It helps a tailor keep customer measurements, garment orders, outstanding balances, and payment records in one simple offline-friendly app.

## Features

- Customer directory with search, filters, and quick customer creation
- Customer profiles with measurement, order, and payment views
- Measurement capture with reusable garment templates
- Order creation with customer selection, quantity, stitching details, delivery date, and printable cutting slips
- Payment recording that updates the order and the customer's outstanding balance
- Home dashboard with current dues and shortcuts to daily work
- Analytics overview for sales, collections, customers, and order progress
- Local SQLite persistence through Zustand and Expo SQLite

## Prerequisites

- Node.js 20 or newer
- npm
- Expo Go on an Android device for development, or an Android emulator
- An Expo account only when creating a cloud APK with EAS

## Getting started

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Then scan the QR code with Expo Go, or use one of these commands:

```bash
npm run android
npm run ios
npm run web
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start Expo's development server. |
| `npm run android` | Open the app on an Android emulator or connected device. |
| `npm run ios` | Open the app in the iOS simulator (macOS required). |
| `npm run web` | Run the web version. |
| `npm run typecheck` | Run the TypeScript compiler without emitting files. |

On Windows PowerShell systems where script execution is restricted, use `npm.cmd` instead of `npm`, for example:

```powershell
npm.cmd run typecheck
```

## Project structure

```text
app/                    Expo Router screens and navigation
  (tabs)/               Home, customers, orders, and More tabs
  customer/             Customer creation and customer profile screens
  measurements/         Measurement capture
  order/                New order and order detail screens
  payments/             Outstanding dues and payment recording
  settings/             Shop settings and analytics
src/
  components/           Reusable UI, customer, and order components
  stores/               Zustand app and business-data stores
  theme/                Shared olive design tokens
  types/                Domain types
  utils/                Printing helpers
```

## Data and persistence

Business data is managed in `src/stores/dataStore.ts`. The app stores its persisted state in an on-device SQLite database (`tailorflow.db`) through the shared adapter in `src/services/storage/sqliteStorage.ts`. It does not require an internet connection to register a tailor, sign in, or manage business records.

Each registered tailor has a local phone number and 4-digit PIN. Their customer, order, measurement, and payment data is stored in a separate local data bucket and is selected when they sign in. This is an offline, device-local access control feature, not a cloud account system: data is not shared or backed up between phones. Existing SecureStore data is imported into SQLite automatically on its first read after this upgrade.

### Inspectable SQLite tables

The database also keeps readable tables in sync for inspection with a SQLite Viewer:

- `tailors`
- `customers`
- `orders`
- `measurements`
- `payments`

For example, after opening `tailorflow.db` in a viewer, run `SELECT * FROM customers;` or `SELECT * FROM orders;`.

Sample data is included for development. You can reset or clear it through the store's data-management actions. Because data is local to the device, clearing app storage or uninstalling the app removes locally saved records unless a backup/export feature is added.

## Build an Android APK

The repository includes an EAS preview build profile that produces an installable `.apk` file.

1. Log in to Expo:

   ```bash
   npx eas-cli login
   ```

2. Create the APK build:

   ```bash
   npx eas-cli build --platform android --profile preview
   ```

3. On the first build, allow EAS to create the project and generate an Android keystore.
4. Open the build URL shown in the terminal when the build completes, download the APK to an Android phone, and install it.

For a Play Store release, use the production profile, which creates an Android App Bundle (`.aab`):

```bash
npx eas-cli build --platform android --profile production
```

## Quality checks

Before opening a pull request or producing a release build, run:

```bash
npm run typecheck
```

Also test the main customer workflow manually:

1. Add a customer.
2. Save that customer's measurements.
3. Create an order from their profile.
4. Record a partial payment and confirm the outstanding balance changes.
5. Open Analytics and verify the order and payment totals.

## Configuration

The application identity and Android package name are defined in `app.json`:

- App name: `TailorFlow`
- Android package: `com.tailorflow.app`

Update the app version in `app.json` before distributing a new release build.

## License

This project is private. Add a license file before sharing or open-sourcing it.
