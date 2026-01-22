# Quick Start Guide - Testing Interest & Notification System

## ✅ Implementation Complete

All backend components for the interest and notification system have been successfully implemented and database migrations applied.

---

## 🚀 How to Test

### Step 1: Start the Backend Server

```powershell
cd backend
.\\venv_new\\Scripts\\Activate.ps1
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

### Step 2: Access API Documentation

Open your browser and go to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You'll see all the new endpoints:
- `/api/interests/send`
- `/api/interests/received`
- `/api/interests/sent`
- `/api/interests/{interest_id}/accept`
- `/api/interests/{interest_id}/reject`
- `/api/interests/matches`
- `/api/notifications`
- `/api/notifications/{notification_id}/read`
- `/api/notifications/read-all`
- `/api/notifications/{notification_id}` (DELETE)
- `/api/users/browse`
- `/api/users/{user_id}/profile/full`

### Step 3: Test with Your 3 Existing Users

#### Option A: Use Swagger UI (Recommended for Quick Testing)

1. Go to http://localhost:8000/docs
2. Click on `/auth/sign_in`
3. Try it out with your user credentials
4. Copy the `access_token` from the response
5. Click the "Authorize" button at the top
6. Paste the token and click "Authorize"
7. Now you can test all endpoints!

#### Option B: Use the Test Script

1. Update `backend/test_interest_system.py` with your actual user credentials
2. Run:
   ```powershell
   python backend/test_interest_system.py
   ```

#### Option C: Use Postman/Thunder Client

Import these sample requests:

**1. Login**
```
POST http://localhost:8000/auth/sign_in
Content-Type: application/json

{
  "email": "your-user@example.com",
  "password": "your-password"
}
```

**2. Browse Users**
```
GET http://localhost:8000/api/users/browse
Authorization: Bearer YOUR_TOKEN_HERE
```

**3. Send Interest**
```
POST http://localhost:8000/api/interests/send
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "to_user_id": "target-user-uuid",
  "message": "Hi! I'd like to connect."
}
```

**4. Get Notifications**
```
GET http://localhost:8000/api/notifications
Authorization: Bearer YOUR_TOKEN_HERE
```

**5. Accept Interest**
```
PUT http://localhost:8000/api/interests/{interest_id}/accept
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📋 Test Checklist

### Basic Flow
- [ ] User A browses users → sees brief profiles
- [ ] User A sends interest to User B
- [ ] User B receives notification
- [ ] User B views received interests
- [ ] User B accepts interest
- [ ] User A receives acceptance notification
- [ ] Both can view each other's full profile

### Limit Enforcement
- [ ] User with 3 accepted interests cannot send more
- [ ] User with 3 accepted interests cannot accept more
- [ ] Clear error message shown when limit exceeded

### Edge Cases
- [ ] Cannot send interest to yourself
- [ ] Cannot send duplicate interest
- [ ] Cannot accept already-processed interest
- [ ] Proper 403 error when viewing full profile without mutual interest

### Notifications
- [ ] Mark notification as read
- [ ] Mark all notifications as read
- [ ] Delete notification
- [ ] Unread count updates correctly

---

## 🔧 Troubleshooting

### Server won't start?
- Make sure you're in the backend directory
- Ensure virtual environment is activated
- Check that PostgreSQL is running
- Verify database connection in `config.py`

### Migration issues?
```powershell
cd backend
.\\venv_new\\Scripts\\Activate.ps1
alembic current  # Check current migration
alembic upgrade head  # Apply all migrations
```

### Import errors in VS Code?
This is just IntelliSense - the code will run fine. To fix:
1. Press `Ctrl+Shift+P`
2. Type "Python: Select Interpreter"
3. Choose the interpreter from `backend/venv_new`

---

## 📊 What Was Implemented

### Database Tables
- ✅ `interests` table with foreign keys to users
- ✅ `notifications` table with foreign keys to users
- ✅ Migration applied successfully

### Backend Components
- ✅ Interest model & repository
- ✅ Notification model & repository
- ✅ Interest controller with 6 endpoints
- ✅ Notification controller with 4 endpoints
- ✅ Profile controller extended with browse & full profile endpoints
- ✅ All routes registered in main.py

### Business Logic
- ✅ 3-interest limit enforcement (on send AND accept)
- ✅ Profile visibility tiers (brief vs. full)
- ✅ Automatic notification creation
- ✅ Mutual interest verification
- ✅ Comprehensive error handling

---

## 📝 Next Steps

1. **Test the backend** using the methods above
2. **Update your frontend** to call these new endpoints
3. **Implement UI components** for:
   - Browse users page
   - Send interest button
   - Interest request list
   - Notification panel
   - Match/mutual interest display

---

## 📞 Need Help?

Check these files for reference:
- `IMPLEMENTATION_SUMMARY.md` - Complete documentation
- `backend/test_interest_system.py` - Example API calls
- API Docs - http://localhost:8000/docs

---

**Everything is ready! Start testing! 🎉**
