# ✅ Testing Checklist - Interest & Notification System

## Pre-Test Setup
- [ ] Backend server running on http://localhost:8000
- [ ] Frontend server running on http://localhost:5173
- [ ] At least 3 users created in the database
- [ ] You have login credentials for at least 2 users

## Test 1: Browse Users & UI ✅
- [ ] Navigate to http://localhost:5173/find-matches
- [ ] Page loads without errors
- [ ] You can see other users (excluding yourself)
- [ ] Each user card shows: name, age, location, profession, religion, picture
- [ ] Filters work (location, religion, gender, age range)
- [ ] "Send Interest" button is visible and enabled

## Test 2: Send Interest ✅
**As User A:**
- [ ] Click "Send Interest" on User B's card
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Success message: "Interest sent to [UserB] successfully!"
- [ ] Button text changes to "Interest Sent"
- [ ] Button becomes disabled/yellow
- [ ] Card shows "⏳ Pending" badge in top-right corner

## Test 3: Receive Notification ✅
**As User B (logout User A, login as User B):**
- [ ] Navigate to http://localhost:5173/notifications
- [ ] You see a notification: "[UserA] has sent you an interest"
- [ ] Notification shows unread indicator (blue dot)
- [ ] Unread count shows "1" at the top
- [ ] Notification includes User A's profile picture
- [ ] Timestamp shows correctly (e.g., "Just now", "5 minutes ago")

## Test 4: View Interest Request ✅
**Still as User B:**
- [ ] Navigate to http://localhost:5173/interest-requests
- [ ] "Received" tab shows (1) badge
- [ ] You see User A's interest request card
- [ ] Card shows User A's profile picture, name, age
- [ ] Message is displayed if User A included one
- [ ] "Accept" and "Reject" buttons are visible

## Test 5: Accept Interest ✅
**Still as User B:**
- [ ] Click "Accept" button on User A's interest
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] Success message: "You and [UserA] are now matched!"
- [ ] Interest card status changes to "Accepted" (green badge)
- [ ] "Received" tab count decreases

## Test 6: Acceptance Notification ✅
**As User A (logout User B, login as User A):**
- [ ] Navigate to http://localhost:5173/notifications
- [ ] You see notification: "[UserB] has accepted your interest"
- [ ] Notification is unread (blue dot)
- [ ] Unread count increased

## Test 7: Match Status Display ✅
**Still as User A:**
- [ ] Navigate to http://localhost:5173/find-matches
- [ ] Find User B's card
- [ ] Card shows "✓ Matched" badge (green)
- [ ] Button text shows "Matched ✓"
- [ ] Button is disabled

**As User B:**
- [ ] Navigate to http://localhost:5173/find-matches
- [ ] Find User A's card
- [ ] Same matched status visible

## Test 8: Interest Limit (3 Maximum) ✅
**As User A:**
- [ ] Send interest to User C
- [ ] User C accepts
- [ ] Send interest to User D
- [ ] User D accepts
- [ ] Now User A has 3 accepted interests (with B, C, D)
- [ ] Try to send interest to User E
- [ ] **Expected**: Error message "You have reached the maximum limit of 3 mutual interests"
- [ ] **Expected**: Request fails, no interest created

## Test 9: Cannot Accept When At Limit ✅
**As User E:**
- [ ] Send interest to User A (who already has 3 accepted)
- [ ] Should succeed (interest is created as "pending")

**As User A:**
- [ ] Navigate to /interest-requests
- [ ] See User E's interest in "Received" tab
- [ ] Try to click "Accept"
- [ ] **Expected**: Error "You have reached the maximum limit of 3 mutual interests"
- [ ] **Expected**: Interest remains "pending"

## Test 10: Reject Interest ✅
**As any user with pending received interest:**
- [ ] Navigate to /interest-requests → Received tab
- [ ] Click "Reject" on a pending interest
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] Success message appears
- [ ] Interest status changes to "Rejected" (red badge)
- [ ] Sender receives notification: "[YourName] has declined your interest"

## Test 11: Notification Actions ✅
**In Notifications page:**
- [ ] Click on an unread notification
- [ ] Blue dot disappears (marked as read)
- [ ] Unread count decreases by 1
- [ ] Click "Mark all as read" button
- [ ] All blue dots disappear
- [ ] Unread count becomes 0
- [ ] Click delete icon (trash) on a notification
- [ ] Confirmation dialog appears
- [ ] Notification is removed from list

## Test 12: Sent Interests Tab ✅
**In Interest Requests page:**
- [ ] Click "Sent" tab
- [ ] See all interests you've sent
- [ ] Each shows: recipient info, status, timestamp
- [ ] Pending interests show "Pending" badge (yellow)
- [ ] Accepted interests show "Accepted" badge (green)
- [ ] Rejected interests show "Rejected" badge (red)

## Test 13: Error Handling ✅
**Test various error scenarios:**
- [ ] Turn off backend server
- [ ] Try to browse users → See error message
- [ ] Try to send interest → See error message
- [ ] Restart backend
- [ ] Everything works again

**Invalid actions:**
- [ ] Cannot send interest to yourself
- [ ] Cannot send duplicate interest (button disabled after first send)
- [ ] Cannot accept already processed interest

## Test 14: UI/UX Features ✅
**Loading States:**
- [ ] Spinner appears while fetching users
- [ ] Spinner appears while fetching notifications
- [ ] Spinner appears while fetching interests
- [ ] "Sending..." appears on button while processing

**Profile Pictures:**
- [ ] If user has profile picture, it displays correctly
- [ ] If no profile picture, shows fallback avatar with initials
- [ ] Broken images fallback to generated avatar

**Responsive Design:**
- [ ] Resize browser window
- [ ] Cards stack properly on mobile
- [ ] Filters stack vertically on mobile
- [ ] Buttons remain accessible

## Test 15: Navigation Flow ✅
- [ ] Click notification → Navigates somewhere relevant
- [ ] Navbar/menu links work
- [ ] Can navigate between Find Matches, Notifications, Interest Requests
- [ ] Protected routes redirect to login if not authenticated

---

## 🐛 Common Issues & Fixes

### Users Not Showing
- **Check**: Are there other users in the database?
- **Fix**: Create more users via signup page

### Cannot Send Interest
- **Check**: Do you already have 3 accepted interests?
- **Fix**: This is the limit, working as designed

### Notifications Not Appearing
- **Check**: Did you refresh the notifications page?
- **Fix**: Reload the page (no auto-refresh yet)

### Profile Pictures Not Loading
- **Check**: Browser DevTools → Network tab for failed requests
- **Expected**: Should fallback to generated avatar automatically

---

## ✅ Success Criteria

**All tests pass if:**
- ✅ Can browse users and see their brief profiles
- ✅ Can send interest successfully
- ✅ Recipient receives notification
- ✅ Recipient can accept/reject from Interest Requests page
- ✅ Acceptance creates notification for sender
- ✅ Matched users show "Matched" badge
- ✅ 3-interest limit is enforced on send
- ✅ 3-interest limit is enforced on accept
- ✅ Notifications can be marked as read/deleted
- ✅ All UI elements display correctly
- ✅ No console errors (check DevTools)

---

## 🎯 Quick Test (5 Minutes)

**Bare minimum test:**
1. Login as User A → Go to Find Matches → Send interest to User B
2. Login as User B → Go to Notifications → See notification from User A
3. Go to Interest Requests → Click Accept on User A's interest
4. Login as User A → Go to Notifications → See acceptance notification
5. Go to Find Matches → See User B with "Matched" badge

**If all 5 steps work → System is functional!** ✅
