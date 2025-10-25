#!/usr/bin/env python3
"""
Test the API endpoints for signup and signin
"""

import requests
import json

def test_signup_api():
    """Test the signup API endpoint"""
    
    url = "http://127.0.0.1:8000/auth/sign_up"
    
    # Test payload with all required fields
    test_user_data = {
        "name": "API Test User",
        "email": "api.test.user@example.com",
        "password": "securepassword123",
        "gender": "Female",
        "nid": "NID_API_TEST_USER",
        "age": 24,
        "religion": "Christianity",
        "preferred_age_from": 20,
        "preferred_age_to": 30
    }
    
    try:
        print("🧪 Testing Signup API...")
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(test_user_data, indent=2)}")
        
        response = requests.post(url, json=test_user_data, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Signup successful!")
            return True
        else:
            print(f"❌ Signup failed!")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server. Make sure it's running on http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Error testing signup API: {str(e)}")
        return False

def test_signin_api():
    """Test the signin API"""
    
    url = "http://127.0.0.1:8000/auth/sign_in"
    
    signin_data = {
        "email": "api.test.user@example.com",
        "password": "securepassword123"
    }
    
    try:
        print("\n🧪 Testing Signin API...")
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(signin_data, indent=2)}")
        
        response = requests.post(url, json=signin_data, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Signin successful!")
            response_data = response.json()
            print(f"Access token received: {response_data.get('access_token', 'N/A')[:50]}...")
            return True
        else:
            print(f"❌ Signin failed!")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server. Make sure it's running on http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Error testing signin API: {str(e)}")
        return False

def test_admin_login():
    """Test the admin login API"""
    
    url = "http://127.0.0.1:8000/auth/admin-login"
    
    admin_data = {
        "username": "admin@quboolmatch.com",
        "password": "admin123"
    }
    
    try:
        print("\n🧪 Testing Admin Login API...")
        print(f"URL: {url}")
        
        # Admin login uses form data, not JSON
        response = requests.post(url, data=admin_data, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Admin login successful!")
            response_data = response.json()
            print(f"Access token received: {response_data.get('access_token', 'N/A')[:50]}...")
            return True
        else:
            print(f"❌ Admin login failed!")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server. Make sure it's running on http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Error testing admin login API: {str(e)}")
        return False

def check_api_docs():
    """Check if API docs are accessible"""
    try:
        print("\n🧪 Checking API Documentation...")
        docs_url = "http://127.0.0.1:8000/docs"
        response = requests.get(docs_url, timeout=10)
        
        if response.status_code == 200:
            print(f"✅ API docs accessible at: {docs_url}")
            return True
        else:
            print(f"❌ API docs not accessible. Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking API docs: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Testing QuboolMatch Backend APIs...\n")
    
    # Check if server is running
    check_api_docs()
    
    # Test signup
    signup_success = test_signup_api()
    
    # Test signin (only if signup was successful)
    if signup_success:
        test_signin_api()
    
    # Test admin login
    test_admin_login()
    
    print("\n🏁 API testing completed!")