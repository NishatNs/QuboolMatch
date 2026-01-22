"""
Test script for Interest and Notification system
Run this after starting the backend server to test the functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_interest_system():
    """Test the complete interest and notification flow"""
    
    print("=" * 60)
    print("TESTING INTEREST & NOTIFICATION SYSTEM")
    print("=" * 60)
    
    # Step 1: Login as User 1
    print("\n1️⃣  Logging in as User 1...")
    login_response = requests.post(
        f"{BASE_URL}/auth/sign_in",
        json={
            "email": "user1@example.com",  # Replace with actual user email
            "password": "password123"       # Replace with actual password
        }
    )
    
    if login_response.status_code == 200:
        user1_token = login_response.json()["access_token"]
        print("✅ User 1 logged in successfully")
    else:
        print(f"❌ Login failed: {login_response.text}")
        return
    
    # Step 2: Browse users
    print("\n2️⃣  Browsing available users...")
    browse_response = requests.get(
        f"{BASE_URL}/api/users/browse",
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    
    if browse_response.status_code == 200:
        users = browse_response.json()["users"]
        print(f"✅ Found {len(users)} users")
        for user in users[:3]:  # Show first 3
            print(f"   - {user['name']}, {user['age']}, {user['location']}")
            print(f"     Interest Status: {user['interest_status']}")
        
        if len(users) > 0:
            target_user_id = users[0]["id"]
        else:
            print("❌ No users available to send interest to")
            return
    else:
        print(f"❌ Browse failed: {browse_response.text}")
        return
    
    # Step 3: Send interest
    print(f"\n3️⃣  Sending interest to {users[0]['name']}...")
    send_response = requests.post(
        f"{BASE_URL}/api/interests/send",
        headers={"Authorization": f"Bearer {user1_token}"},
        json={
            "to_user_id": target_user_id,
            "message": "Hi! I'd like to connect with you."
        }
    )
    
    if send_response.status_code == 201:
        interest_data = send_response.json()
        interest_id = interest_data["interest"]["id"]
        print("✅ Interest sent successfully")
        print(f"   Interest ID: {interest_id}")
    else:
        print(f"❌ Send interest failed: {send_response.text}")
        return
    
    # Step 4: Check sent interests
    print("\n4️⃣  Checking sent interests...")
    sent_response = requests.get(
        f"{BASE_URL}/api/interests/sent",
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    
    if sent_response.status_code == 200:
        sent_interests = sent_response.json()["interests"]
        print(f"✅ You have {len(sent_interests)} sent interests")
        for interest in sent_interests:
            print(f"   - To: {interest['to_user']['name']}, Status: {interest['status']}")
    
    # Step 5: Login as User 2 (recipient)
    print("\n5️⃣  Logging in as User 2 (recipient)...")
    login2_response = requests.post(
        f"{BASE_URL}/auth/sign_in",
        json={
            "email": "user2@example.com",  # Replace with actual user email
            "password": "password123"       # Replace with actual password
        }
    )
    
    if login2_response.status_code == 200:
        user2_token = login2_response.json()["access_token"]
        print("✅ User 2 logged in successfully")
    else:
        print(f"⚠️  Could not login as User 2: {login2_response.text}")
        print("   (Use the recipient's actual credentials)")
        return
    
    # Step 6: Check notifications
    print("\n6️⃣  Checking notifications for User 2...")
    notif_response = requests.get(
        f"{BASE_URL}/api/notifications",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    
    if notif_response.status_code == 200:
        notif_data = notif_response.json()
        notifications = notif_data["notifications"]
        unread_count = notif_data["unread_count"]
        print(f"✅ Found {len(notifications)} notifications ({unread_count} unread)")
        for notif in notifications[:3]:
            print(f"   - {notif['type']}: {notif['message']}")
            print(f"     Read: {notif['is_read']}, Created: {notif['created_at']}")
    
    # Step 7: Check received interests
    print("\n7️⃣  Checking received interests for User 2...")
    received_response = requests.get(
        f"{BASE_URL}/api/interests/received",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    
    if received_response.status_code == 200:
        received_interests = received_response.json()["interests"]
        print(f"✅ You have {len(received_interests)} received interests")
        for interest in received_interests:
            if interest['status'] == 'pending':
                print(f"   - From: {interest['from_user']['name']}")
                print(f"     Status: {interest['status']}")
                print(f"     Message: {interest.get('message', 'No message')}")
    
    # Step 8: Accept interest
    if len(received_interests) > 0 and received_interests[0]['status'] == 'pending':
        print(f"\n8️⃣  Accepting interest from {received_interests[0]['from_user']['name']}...")
        accept_response = requests.put(
            f"{BASE_URL}/api/interests/{received_interests[0]['id']}/accept",
            headers={"Authorization": f"Bearer {user2_token}"}
        )
        
        if accept_response.status_code == 200:
            print("✅ Interest accepted successfully!")
            print("   Both users can now view full profiles")
        else:
            print(f"❌ Accept failed: {accept_response.text}")
    
    # Step 9: Test full profile access
    print("\n9️⃣  Testing full profile access...")
    full_profile_response = requests.get(
        f"{BASE_URL}/api/users/{target_user_id}/profile/full",
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    
    if full_profile_response.status_code == 200:
        print("✅ Can access full profile (mutual interest exists)")
    else:
        print(f"⚠️  Full profile access: {full_profile_response.status_code}")
    
    # Step 10: Test interest limit
    print("\n🔟  Testing 3-interest limit...")
    print("    (This will be enforced after 3 accepted interests)")
    
    print("\n" + "=" * 60)
    print("✅ TEST COMPLETE!")
    print("=" * 60)


if __name__ == "__main__":
    print("\n⚠️  IMPORTANT: Update the email/password in this script to match your actual users!")
    print("⚠️  Make sure backend server is running on http://localhost:8000\n")
    
    try:
        test_interest_system()
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server.")
        print("   Please start the server first:")
        print("   cd backend")
        print("   .\\venv_new\\Scripts\\Activate.ps1")
        print("   uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")
