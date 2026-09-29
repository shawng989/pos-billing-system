# POS Billing System

## Run locally

### Backend
```powershell
cd "Backend"
.\venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

### Frontend
```powershell
cd "Frontend\pos-billing-system"
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://127.0.0.1:8000

## Demo login

Admin:
- Email: admin@pos.local
- Password: Admin@123

Staff:
- Email: staff@pos.local
- Password: Staff@123

## Mobile Admin URL

When the frontend is running locally:
http://localhost:5173/mobile-admin

The mobile-admin URL forces the responsive mobile-style admin layout even when opened on a desktop browser.

## Implemented

- Product CRUD
- Staff management
- Supplier management
- Billing with stock validation
- Payment methods: Cash, UPI, Card
- Invoice generation and browser printing
- Transactions
- Product returns with approval/rejection and stock restoration
- Ledger
- Live reports and CSV export
- Admin/staff access control
- Mobile admin layout
