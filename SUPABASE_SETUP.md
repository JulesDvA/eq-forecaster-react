# 🚀 Supabase Setup Guide

## 📋 What is Supabase?
Supabase is an open-source alternative to Firebase that provides:
- **PostgreSQL Database** - Powerful, reliable database
- **Real-time subscriptions** - Live data updates
- **Authentication** - User management (optional)
- **Storage** - File uploads (optional)
- **API** - Auto-generated REST and GraphQL APIs

## 🛠️ Setup Steps

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new organization

### 2. Create New Project
1. Click **"New Project"**
2. Choose your organization
3. Enter project details:
   - **Name:** `eq-forecaster`
   - **Database Password:** Choose a strong password
   - **Region:** Select closest to you (e.g., `Southeast Asia (Singapore)`)
4. Click **"Create new project"**

### 3. Get Project Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 4. Update Configuration
1. Open `src/Frontend/supabase.js`
2. Replace the placeholder values:

```javascript
const supabaseUrl = 'YOUR_ACTUAL_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_ACTUAL_SUPABASE_ANON_KEY'
```

### 5. Create Database Table
1. Go to **Table Editor** in Supabase
2. Click **"New Table"**
3. Create table with these columns:

```sql
CREATE TABLE earthquakes (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  magnitude DECIMAL(3,1) NOT NULL,
  location TEXT NOT NULL,
  depth DECIMAL(5,2) NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Set Row Level Security (RLS)
1. Go to **Authentication** → **Policies**
2. Click **"New Policy"**
3. Choose **"Enable read access to everyone"**
4. Choose **"Enable insert access to everyone"**
5. Choose **"Enable update access to everyone"**
6. Choose **"Enable delete access to everyone"**

## 🧪 Test Your Setup

1. **Start your React app:** `npm run dev`
2. **Go to Dashboard page**
3. **Click "🧪 Test Supabase Connection"**
4. **Should see:** "✅ Supabase connection successful!"

## 📊 Features You Get

### ✅ **Real-time Database:**
- Add earthquake entries
- Delete entries
- View all entries
- Real-time updates across all users

### ✅ **Automatic Features:**
- Auto-generated IDs
- Timestamp tracking
- Data validation
- Error handling

### ✅ **Scalable:**
- PostgreSQL backend
- Built-in backups
- Performance monitoring
- Easy scaling

## 🔧 Troubleshooting

### **Connection Failed:**
- Check your URL and API key
- Ensure table exists
- Check RLS policies

### **Table Not Found:**
- Create the `earthquakes` table
- Check table name matches code

### **Permission Denied:**
- Enable RLS policies
- Check API key permissions

## 🎯 Next Steps

Once working, you can add:
- **User authentication**
- **File uploads**
- **Advanced queries**
- **Data analytics**

## 💡 Why Supabase?

- **🆓 Free tier:** 500MB database, 2GB bandwidth
- **🚀 Fast:** Built on PostgreSQL
- **🔒 Secure:** Row-level security
- **📱 Real-time:** Live updates
- **🛠️ Simple:** Easy to use API
- **🌐 Open source:** No vendor lock-in

Your earthquake database will now be **persistent, real-time, and scalable**! 🎉
