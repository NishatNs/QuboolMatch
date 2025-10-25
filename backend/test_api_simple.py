#!/usr/bin/env python3
"""
Simple test to check API endpoints using urllib (built-in)
"""

import urllib.request
import urllib.parse
import json

def test_api_endpoint(url, data=None, method="GET"):
    """Test an API endpoint using urllib"""
    try:
        if data:
            if method == "POST":
                # Convert data to JSON for POST requests
                json_data = json.dumps(data).encode('utf-8')
                req = urllib.request.Request(
                    url, 
                    data=json_data,
                    headers={'Content-Type': 'application/json'}
                )
            else:
                req = urllib.request.Request(url)
        else:
            req = urllib.request.Request(url)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            response_data = response.read().decode('utf-8')
            return response.status, response_data
            
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return None, str(e)

def check_server_running():
    """Check if the server is running"""
    print("🧪 Checking if server is running...")
    
    status, response = test_api_endpoint("http://127.0.0.1:8000/docs")
    
    if status == 200:
        print("✅ Server is running! API docs accessible at http://127.0.0.1:8000/docs")
        return True
    else:
        print(f"❌ Server not responding. Status: {status}, Response: {response}")
        return False

def test_signup():
    """Test the signup endpoint"""
    print("\n🧪 Testing Signup API...")
    
    signup_data = {
        "name": "URL Test User",
        "email": "url.test@example.com",
        "password": "testpassword123",
        "gender": "Male",
        "nid": "NID_URL_TEST",
        "age": 25,
        "religion": "Islam",
        "preferred_age_from": 22,
        "preferred_age_to": 32
    }
    
    status, response = test_api_endpoint(
        "http://127.0.0.1:8000/auth/sign_up", 
        signup_data, 
        "POST"
    )
    
    if status == 201:
        print("✅ Signup successful!")
        return True
    else:
        print(f"❌ Signup failed. Status: {status}")
        print(f"Response: {response}")
        return False

def test_signin():
    """Test the signin endpoint"""
    print("\n🧪 Testing Signin API...")
    
    signin_data = {
        "email": "url.test@example.com",
        "password": "testpassword123"
    }
    
    status, response = test_api_endpoint(
        "http://127.0.0.1:8000/auth/sign_in", 
        signin_data, 
        "POST"
    )
    
    if status == 200:
        print("✅ Signin successful!")
        try:
            response_json = json.loads(response)
            print(f"Access token received: {response_json.get('access_token', 'N/A')[:50]}...")
        except:
            print("Token received but couldn't parse JSON")
        return True
    else:
        print(f"❌ Signin failed. Status: {status}")
        print(f"Response: {response}")
        return False

if __name__ == "__main__":
    print("🚀 Testing QuboolMatch Backend APIs (Simple Version)...\n")
    
    # Check server
    if not check_server_running():
        print("\n❌ Server is not running! Please start the server first.")
        exit(1)
    
    # Test signup
    signup_success = test_signup()
    
    # Test signin only if signup worked
    if signup_success:
        test_signin()
    
    print("\n🏁 API testing completed!")