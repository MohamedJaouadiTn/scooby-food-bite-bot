# 🚀 Scooby Food Admin Panel - Complete Setup Guide

## ✅ What's Been Implemented

### Backend (Supabase)
- ✅ Products table with full CRUD operations
- ✅ Orders table with customer tracking
- ✅ Customers table with order history
- ✅ User roles system (admin/user)
- ✅ Row-Level Security (RLS) policies
- ✅ Image storage bucket (product-images)
- ✅ Dashboard statistics function
- ✅ Real-time subscriptions for live updates
- ✅ Auto-confirm email enabled

### Frontend
- ✅ Secure admin authentication (email/password)
- ✅ Protected routes with role checking
- ✅ Admin dashboard with 4 statistics cards
- ✅ Product management (add/edit/delete with image upload)
- ✅ Orders tracking
- ✅ Customer management
- ✅ Real-time product updates on menu page
- ✅ Order submission saves to database

### Security Features
- ✅ Server-side authentication
- ✅ Role-based access control
- ✅ Row-Level Security policies
- ✅ Input validation (Zod schemas)
- ✅ Protected admin routes
- ✅ Secure image uploads

---

## 📋 Installation Steps

### Step 1: Create Your First Admin User

1. **Sign up for an account:**
   - Navigate to `/admin/login`
   - Click "Need an account? Sign up"
   - Create account with email/password

2. **Grant admin role manually:**
   
   Open Lovable Cloud backend and run this SQL:
   
   ```sql
   -- Replace 'YOUR_USER_EMAIL' with the email you just signed up with
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role
   FROM auth.users
   WHERE email = 'YOUR_USER_EMAIL';
   ```

   Or get the user ID from the backend and run:
   
   ```sql
   -- Replace 'USER_UUID_HERE' with your actual user ID
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('USER_UUID_HERE', 'admin');
   ```

3. **Login:**
   - Return to `/admin/login`
   - Sign in with your credentials
   - You'll be redirected to `/admin/dashboard`

---

## 🎯 Features

### Admin Dashboard (`/admin/dashboard`)

#### Statistics Cards
- **Total Products**: Count of active menu items
- **Total Customers**: Unique customers who placed orders
- **Total Orders**: All orders received
- **Total Sales**: Sum of confirmed orders (sent to Telegram)

#### Products Tab
**Add/Edit Products:**
- Product ID (unique identifier)
- Name (English)
- Name (French)
- Price (in TND, up to 3 decimals)
- Category (mlawi, chapati, tacos, drinks)
- Image upload (up to 5MB)

**Product List:**
- Search/filter products
- Edit any product
- Delete products
- Real-time updates

#### Orders Tab
- View all customer orders
- Order details with items and extras
- Order status (pending/confirmed)
- Total price and date

#### Customers Tab
- Customer list with contact info
- Order history
- Registration dates

---

## 🔐 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/menu` | Public | Menu page (reads from database) |
| `/admin/login` | Public | Admin authentication |
| `/admin/dashboard` | Admin only | Dashboard & management |

---

## 💡 Usage

### Managing Products

1. Go to Products tab
2. Fill in product details in left form
3. Upload image (click or drag & drop)
4. Click "Add Product"
5. Product appears in list and on menu page instantly

**To Edit:**
- Click edit icon on product
- Form populates with data
- Make changes and click "Update"

**To Delete:**
- Click delete icon
- Confirm deletion

### Viewing Orders

1. Go to Orders tab
2. See all customer orders
3. Track order status
4. Orders automatically save when customers submit

### Customer Management

1. Go to Customers tab
2. View all registered customers
3. See contact information
4. Customers auto-register on first order

---

## 🔧 Technical Details

### Database Schema

**products**
- id (uuid, primary key)
- product_id (text, unique)
- name, french_name (text)
- price (decimal)
- category (text)
- image_url (text, nullable)
- created_at, updated_at (timestamp)

**orders**
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- customer_name, phone, address (text)
- allergies (text, nullable)
- items (jsonb)
- total_price (decimal)
- status (text)
- telegram_sent (boolean)
- created_at (timestamp)

**customers**
- id (uuid, primary key)
- name, phone (text)
- address (text, nullable)
- created_at (timestamp)

**user_roles**
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- role (app_role enum: admin/user)

### Real-time Updates
- Products: Changes reflect instantly on menu
- Orders: Dashboard updates when new orders arrive
- Statistics: Auto-refresh on data changes

### Image Storage
- Bucket: `product-images` (public)
- Max size: 5MB
- Formats: PNG, JPG, JPEG, GIF
- Auto-generated unique filenames

---

## 🛡️ Security

- ✅ Email/password authentication
- ✅ Admin role verification on every request
- ✅ RLS policies prevent unauthorized access
- ✅ Protected routes redirect non-admins
- ✅ Input validation on all forms
- ✅ Secure storage policies

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify user has admin role in database
3. Ensure Lovable Cloud backend is running
4. Check that products exist in database

---

## 🎉 You're All Set!

Your admin panel is fully operational and production-ready. Start managing your menu!
