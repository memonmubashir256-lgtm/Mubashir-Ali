# VYRO — Premium Pod & Vape Hardware Platform

An ultra-luxury, minimalist digital storefront and operations architecture for **VYRO** vapor hardware and accessories.

Designed with dark luxury aesthetic principles, precision monolithic hardware showcases, strict statutory age-verification pipelines, and a dual-mode commerce architecture (Informational Demo vs. Live Sandbox Commerce).

---

## 1. Required Software

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher (for persistent database storage)
- **Prisma CLI**: v5.0+ (`npm install -g prisma` or bundled via npx)

---

## 2. Dependency Installation

Clone or extract the project repository and run:

```bash
npm install
```

---

## 3. PostgreSQL Configuration

1. Create a dedicated PostgreSQL database instance:
   ```sql
   CREATE DATABASE vyro_ecommerce;
   CREATE USER vyro_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE vyro_ecommerce TO vyro_admin;
   ```
2. Verify connection via `psql` or connection string.

---

## 4. Environment Variables (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://vyro_admin:your_secure_password@localhost:5432/vyro_ecommerce?schema=public"

# Application URL & Port
APP_URL="http://localhost:3000"
PORT=3000

# Security & Sessions
SESSION_SECRET="your-ultra-secure-256-bit-random-secret"
COOKIE_SECRET="your-cookie-signing-secret"

# Age Verification Provider
AGE_VERIFICATION_API_KEY="sandbox_age_check_key"

# Payment Gateway (When legally certified)
PAYMENT_PROVIDER_MODE="sandbox" # or "live"
PAYMENT_GATEWAY_SECRET=""
```

---

## 5. Running Prisma Migrations

Generate the Prisma Client and execute database migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init_vyro_schema
```

---

## 6. Seeding Demo Data

Execute the seed script to populate categories, initial products (`VYRO Onyx Pro`, `VYRO Onyx Slim`, `C-Cell Pods`, `Titan Dock`, `Tuscany Sleeve`), and initial compliance audit records:

```bash
npx prisma db seed
```

---

## 7. Creating the First Admin Securely

To seed or elevate an administrator account securely without hardcoding credentials in public repos:

```bash
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMeImmediately123!', 12);
console.log('Secure Password Hash Generated:', hash);
"
```
Or authenticate in the web interface with the built-in development credentials:
- **Email**: `admin@vyro.luxury`
- **Role**: `ADMIN` (Full access to product creation, inventory replenishment, order status updates, and compliance mode toggles)

---

## 8. Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 9. Executing Tests & Typechecks

Run the test suite and TypeScript validation:

```bash
npm run lint
```

Unit and integration tests verify:
- Cart quantity adjustment and tax calculations
- Statutory age threshold verification logic
- Role-based authorization for administrative routes
- Zero-card storage and payload sanitization

---

## 10. Production Build & Deployment

To build the client application and start the full-stack server:

```bash
npm run build
npm start
```

---

## 11. Legally Approved Payment Configuration

In compliance with federal and international regulations governing adult vapor products:

1. **Provider Independence**: The payment layer is abstracted (`src/types/index.ts` and `PaymentRecord`).
2. **Sandbox Mode**: Test transactions do NOT capture real funds and output explicit mock assertions.
3. **Live Certification**: To enable live transactions, establish a merchant account with an approved high-risk processor (e.g., authorize.net or specialized merchant gateways), configure webhook signature verification, and toggle Commerce Mode in the Admin Console.

---

## 12. Switching Commerce Modes (Demo vs. Approved Live)

Navigate to the **Admin Operator Console** -> **Compliance & Settings**:

1. **Demo Informational Mode**:
   - Direct online purchases are locked.
   - Products display complete hardware specifications, materials, and statutory disclosures.
   - Safe for preview environments without legal merchant accounts.
2. **Sandbox Commerce Mode**:
   - Enables test transactions, age verification audit logs, and simulated receipts.
3. **Live Authorized Mode**:
   - Production e-commerce with real processor webhooks and postal signature tracking.

---

## Brand Architecture & Visual System

- **Palette**: Obsidian Black (`#08090B`), Charcoal (`#121419`), Surface Graphite (`#1A1D23`), Metallic Silver (`#C5CBD3`), Off-White (`#F5F5F3`).
- **Typography**: Manrope for refined structural body text, Outfit for high-contrast architectural headlines.
- **Rules**: Zero pill badge sandwiches, no mechanical code prefixes, no decorative pulsing dots, strict 3-zone top bar contract, and image-leading product hierarchy.
