# VendorBridge (Quotor) — Procurement & Vendor Portal

VendorBridge (Quotor) is a comprehensive procurement management and vendor portal system. It streamlines the Request for Quotation (RFQ) process, vendor onboarding, bid comparisons, multi-tier approvals, purchase orders, invoicing, and spend analytics.

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **PostgreSQL** database instance running locally or hosted

### 1. Database Setup
Ensure you have a PostgreSQL database created.
1. Navigate to the `backend` directory.
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and populate your PostgreSQL credentials and a JWT secret:
   ```env
   DB_USER=your_postgres_user
   DB_HOST=localhost
   DB_DATABASE=your_database_name
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   JWT_SECRET=your_super_secret_jwt_key
   ```

### 2. Run the Backend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Initialize the database schema (this runs the queries in `queries.sql` to drop existing public tables and create new tables):
   ```bash
   node init-db.js
   ```
3. Run migrations/alters (adds any additional schema patches, such as adding the `status` column to the `users` table):
   ```bash
   node alter.js
   ```
4. Start the development server (runs nodemon on port `5001`):
   ```bash
   npm run dev
   ```

### 3. Run the Frontend
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables. By default, it connects to `http://localhost:5001/api`. You can override this by creating a `.env` file containing:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Multi-Role System & Accounts

VendorBridge enforces role-based access control (RBAC). You can register new accounts directly from the UI registration page.

| Role | Description |
| :--- | :--- |
| **Vendor** | Onboards and updates company profile (GSTIN, category, contact). Receives RFQ invitations, submits quotations, and tracks PO/Invoice payments. |
| **Procurement Officer** | Creates and publishes RFQs, invites specific vendors, compares received quotations side-by-side, selects a quotation to forward for approval, and manages vendor lists. |
| **Department Manager** | Reviews selected quotations, inputs approval/rejection remarks, issues official purchase orders, and logs financial controls. |
| **Administrator** | Overall system configuration, system user management (changing roles, status, resetting passwords), and viewing system-wide activity logs. |

*Note: Since Admin role registration is disabled on the registration form for security, you can register as any role and update the user's role in the database to `'Admin'` to test administrator capabilities.*

---

## 🛠 Features Breakdown

### 📂 Vendor Profile & Management
* **Self-onboarding:** Vendors register and are guided through a mandatory profile completion step (Company Name, GST, category, phone, and contact details).
* **Staff Controls:** Internal staff can view all registered vendors, search by categories, change a vendor's status (`Active`, `Pending`, `Removed`, `Blacklisted`), and even create vendor credentials on behalf of partners.

### 📝 Request for Quotation (RFQ)
* **Creation Flow:** Procurement Officers create detailed RFQs with line-items, quantities, description tags, and deadline dates.
* **Targeted Invites:** Officers invite specific vendors matching the category requirements to submit bids.
* **Status Updates:** Tracks the RFQ lifecycle (`Draft` ➔ `Active` ➔ `Under Review` ➔ `Closed`).

### ⚖️ Smart Quotation Comparison
* **Multi-line Submissions:** Invited vendors enter pricing details, delivery timelines, and extra terms.
* **Side-by-Side Grid:** Procurement Officers review and compare quotes.
* **Smart Recommendation Engine:** Recommends the best bid based on a weighted formula:
  * **50%:** Lowest overall cost
  * **30%:** Fastest delivery speed
  * **20%:** Highest vendor rating (when available)

### ✍️ Multi-Stage Approval Workflow
* **Proposal & Selection:** The Procurement Officer recommends a quotation, forwarding it to a Department Manager.
* **Review Panel:** Managers view approval histories and specific line-items.
* **Decision-Making:** Managers input comments/remarks to approve or reject the request.

### 🧾 Automated Purchase Orders & Invoicing
* **Instant Issuance:** When a quote is approved, a PDF-ready Purchase Order (PO) is automatically drafted and dispatched.
* **Payment Tracking:** Procurement staff mark items as `Paid` upon completion, notifying the vendor.
* **Invoices:** Central dashboard to manage active bills and download/print digital transaction PDFs.

### 📊 Reporting & Audits
* **Activity Logs:** A chronological system-wide audit trail recording actions, timestamps, actor roles, and targeted entities.
* **Spend Analytics:** Interactive reports showcasing total procurement spend, category-wise distributions, top-performing vendors, and monthly spend variations.

---

## 📁 Repository Structure
```
Odoo-KSV/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route handler controllers (auth, rfqs, vendors, etc.)
│   │   ├── routes/        # Router paths
│   │   ├── middlewares/   # JWT authentication validation
│   │   └── lib/db.js      # pg PostgreSQL database connection helper
│   ├── init-db.js         # Schema database initialization script
│   ├── alter.js           # Database patch migrations
│   ├── queries.sql        # Core DDL tables, types, and constraints definition
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/client.ts  # Unified fetch wrapper calling the Express API
│   │   ├── auth/          # Authentication context provider & routing guards
│   │   ├── components/    # Layout shells, typography, sidebar, and inputs
│   │   ├── pages/         # Application pages (Dashboard, Quotations, Invoices, etc.)
│   │   ├── types.ts       # Global TypeScript interfaces
│   │   └── utils.ts       # Central currency formatters & constants
│   ├── tailwind.config.js
│   └── package.json
└── readme.md              # Documentation
```
