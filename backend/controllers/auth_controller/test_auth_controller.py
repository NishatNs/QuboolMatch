from models.user.user import User

def test_sign_up_success(client):
    payload = {
        "name": "New User",
        "email": "newuser@example.com", 
        "password": "123123",
        "gender": "Male",
        "nid": "NID_12345",
        "age": 25,
        "religion": "Islam",
        "preferred_age_from": 20,
        "preferred_age_to": 30
    }
    
    response = client.post("/auth/sign_up", json=payload)
    assert response.status_code == 201  # Status code 201 for successful creation
    
    # Verify that the response contains an access token
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"


# Test sign_up failure (email already exists)
def test_sign_up_user_exists(client, db_session):
    payload = {
        "name": "Test User 1",
        "email": "testuser1@example.com", 
        "password": "123123",
        "gender": "Female",
        "nid": "NID_54321",
        "age": 24
    }

    user = User(
        name="Existing User",
        email="testuser1@example.com", 
        password="Password123!",
        gender="Male",
        nid="NID_EXISTING",
        age=30
    )
    db_session.add(user)
    db_session.commit()

    response = client.post("/auth/sign_up", json=payload)
    assert response.status_code == 400
    assert response.json() == {'detail': 'User already registered or NID already exists'}


# Test sign_in success
def test_sign_in_success(client, db_session):
    user_payload = {"email": "testuser2@example.com", "password": "Password123!"}
    user = User(
        name="Test User 2",
        email="testuser2@example.com", 
        password="Password123!",
        gender="Male",
        nid="NID_TEST2",
        age=28
    )
    db_session.add(user)
    db_session.commit()

    response = client.post("/auth/sign_in", json=user_payload)
    assert response.status_code == 200
    response_json = response.json()
    assert "access_token" in response_json
    assert response_json["access_token"] != ""


# Test sign_in failure (incorrect password)
def test_sign_in_incorrect_password(client, db_session):
    user_payload = {"email": "testuser3@example.com", "password": "WrongPassword"}
    user = User(
        name="Test User 3",
        email="testuser3@example.com", 
        password="123123",
        gender="Female",
        nid="NID_TEST3",
        age=26
    )
    db_session.add(user)
    db_session.commit()

    response = client.post("/auth/sign_in", json=user_payload)
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}


# Test sign_in failure (user not found)
def test_sign_in_user_not_found(client):
    user_payload = {"email": "nonexistentuser@example.com", "password": "Password123!"}

    response = client.post("/auth/sign_in", json=user_payload)
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}
