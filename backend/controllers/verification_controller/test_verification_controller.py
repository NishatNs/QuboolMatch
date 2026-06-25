import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from main import app
from database import get_db
from models.user.user import User
from services.gemini_nid_ocr_service import NIDOcrExtractionResult
from shared.token import get_current_admin_user, get_current_user

client = TestClient(app)

class TestVerificationController:
    
    def test_submit_verification_success(self):
        """Test successful verification submission"""
        with patch('controllers.verification_controller.verification_controller.get_current_user') as mock_get_user, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db:
            
            # Mock user and database
            mock_user = Mock(spec=User)
            mock_user.id = "test-user-id"
            mock_user.verification_status = "in_progress"
            mock_get_user.return_value = mock_user
            
            mock_db = Mock()
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_user] = lambda: mock_user
            app.dependency_overrides[get_db] = lambda: mock_db
            
            # Mock file upload
            with patch('builtins.open', create=True) as mock_open, \
                 patch('os.makedirs') as mock_makedirs, \
                 patch('shutil.copyfileobj') as mock_copy:
                
                try:
                    response = client.post(
                        "/verification/submit",
                        data={
                            "verification_notes": "Ready for verification"
                        },
                        files={"nid_image": ("test.jpg", b"fake image data", "image/jpeg")}
                    )
                    
                    assert response.status_code == 200
                    data = response.json()
                    assert data["success"] == True
                    assert "verification information submitted successfully" in data["message"].lower()
                finally:
                    app.dependency_overrides.pop(get_current_user, None)
                    app.dependency_overrides.pop(get_db, None)
    
    def test_submit_verification_invalid_file_type(self):
        """Test verification submission with invalid file type"""
        with patch('controllers.verification_controller.verification_controller.get_current_user') as mock_get_user, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db:
            
            mock_user = Mock(spec=User)
            mock_user.id = "test-user-id"
            mock_user.verification_status = "pending"
            mock_get_user.return_value = mock_user
            
            mock_db = Mock()
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_user] = lambda: mock_user
            app.dependency_overrides[get_db] = lambda: mock_db
            
            try:
                response = client.post(
                    "/verification/submit",
                    data={
                    },
                    files={"nid_image": ("test.txt", b"fake text data", "text/plain")}
                )
                
                assert response.status_code == 400
                data = response.json()
                assert "only image files are allowed" in data["detail"].lower()
            finally:
                app.dependency_overrides.pop(get_current_user, None)
                app.dependency_overrides.pop(get_db, None)
    
    def test_get_verification_status(self):
        """Test getting verification status"""
        with patch('controllers.verification_controller.verification_controller.get_current_user') as mock_get_user, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db:
            
            mock_user = Mock(spec=User)
            mock_user.verification_status = "verified"
            mock_user.verified_at = None
            mock_user.verification_notes = None
            mock_user.ocr_name = "Test User"
            mock_user.ocr_father_name = None
            mock_user.ocr_mother_name = None
            mock_user.ocr_date_of_birth = None
            mock_user.ocr_nid_number = "1234567890123"
            mock_user.ocr_image_quality = "good"
            mock_user.ocr_warnings = ["minor glare"]
            mock_user.ocr_confirmed = True
            mock_user.ocr_processed_at = None
            mock_user.nid_image_data = None
            mock_user.nid_image_filename = None
            mock_get_user.return_value = mock_user
            
            mock_db = Mock()
            mock_db.query.return_value.filter.return_value.first.return_value = None
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_user] = lambda: mock_user
            app.dependency_overrides[get_db] = lambda: mock_db
            
            try:
                response = client.get("/verification/status")
                
                assert response.status_code == 200
                data = response.json()
                assert data["verification_status"] == "verified"
                assert data["ocr_name"] == "Test User"
                assert data["ocr_nid_number"] == "1234567890123"
                assert data["ocr_warnings"] == ["minor glare"]
                assert data["ocr_confirmed"] is True
            finally:
                app.dependency_overrides.pop(get_current_user, None)
                app.dependency_overrides.pop(get_db, None)

    def test_reject_verification_keeps_user_notes_separate(self):
        """Test rejection reason is stored separately from submitted verification notes"""
        with patch('controllers.verification_controller.verification_controller.get_current_admin_user') as mock_get_admin, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db:

            mock_admin = Mock(spec=User)
            mock_get_admin.return_value = mock_admin

            user = User("Test User", "test@example.com", "password123", "Male", "1234567890", 25)
            user.id = "test-user-id"
            user.verification_notes = "Ready for verification"

            mock_query = Mock()
            mock_query.filter.return_value.first.return_value = user
            mock_rejection_query = Mock()
            mock_rejection_query.filter.return_value.first.return_value = None
            mock_db = Mock()
            mock_db.query.side_effect = [mock_query, mock_rejection_query]
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_admin_user] = lambda: mock_admin
            app.dependency_overrides[get_db] = lambda: mock_db

            try:
                response = client.post(
                    "/verification/reject/test-user-id",
                    data={"rejection_notes": "NID photo is blurry"}
                )

                assert response.status_code == 200
                assert user.verification_notes == "Ready for verification"
                assert user.verification_status == "rejected"
                mock_db.add.assert_called_once()
            finally:
                app.dependency_overrides.pop(get_current_admin_user, None)
                app.dependency_overrides.pop(get_db, None)
    
    def test_submit_verification_without_optional_notes(self):
        """Test verification submission without optional notes"""
        with patch('controllers.verification_controller.verification_controller.get_current_user') as mock_get_user, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db:
            
            mock_user = Mock(spec=User)
            mock_user.id = "test-user-id"
            mock_user.verification_status = "pending"
            mock_get_user.return_value = mock_user
            
            mock_db = Mock()
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_user] = lambda: mock_user
            app.dependency_overrides[get_db] = lambda: mock_db
            
            with patch('builtins.open', create=True), \
                 patch('os.makedirs'), \
                 patch('shutil.copyfileobj'):
                
                try:
                    response = client.post(
                        "/verification/submit",
                        data={},
                        files={"nid_image": ("test.jpg", b"fake image data", "image/jpeg")}
                    )
                    
                    assert response.status_code == 200
                    data = response.json()
                    assert data["success"] is True
                finally:
                    app.dependency_overrides.pop(get_current_user, None)
                    app.dependency_overrides.pop(get_db, None)

    def test_extract_nid_information_success(self):
        """Test OCR extraction saves extracted fields to the user"""
        with patch('controllers.verification_controller.verification_controller.get_current_user') as mock_get_user, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db, \
             patch('controllers.verification_controller.verification_controller.ocr_service.extract') as mock_extract:

            user = User("Test User", "test@example.com", "password123", "Male", "1234567890", 25)
            user.id = "test-user-id"
            user.ocr_confirmed = True
            mock_get_user.return_value = user

            mock_db = Mock()
            mock_db.commit = Mock()
            mock_db.rollback = Mock()
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_user] = lambda: user
            app.dependency_overrides[get_db] = lambda: mock_db

            try:
                mock_extract.return_value = NIDOcrExtractionResult(
                    document_detected=True,
                    name="Ayesha Rahman",
                    father_name="Md. Rahman Ali",
                    mother_name="Salma Rahman",
                    date_of_birth="1998-04-12",
                    nid_number="1234567890123",
                    image_quality="good",
                    warnings=["slight blur"],
                )

                response = client.post(
                    "/verification/extract-nid",
                    files={"nid_image": ("nid.png", b"fake image data", "image/png")},
                )

                assert response.status_code == 200
                data = response.json()
                assert data["success"] is True
                assert data["document_detected"] is True
                assert data["name"] == "Ayesha Rahman"
                assert data["father_name"] == "Md. Rahman Ali"
                assert data["mother_name"] == "Salma Rahman"
                assert data["date_of_birth"] == "1998-04-12"
                assert data["nid_number"] == "1234567890123"
                assert data["image_quality"] == "good"
                assert data["warnings"] == ["slight blur"]
                assert user.ocr_name == "Ayesha Rahman"
                assert user.ocr_confirmed is False
                assert user.ocr_processed_at is not None
                mock_db.commit.assert_called_once()
            finally:
                app.dependency_overrides.pop(get_current_user, None)
                app.dependency_overrides.pop(get_db, None)

    def test_extract_nid_information_invalid_file_type(self):
        """Test OCR extraction rejects unsupported file types"""
        with patch('controllers.verification_controller.verification_controller.get_current_user') as mock_get_user, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db:

            user = User("Test User", "test@example.com", "password123", "Male", "1234567890", 25)
            user.id = "test-user-id"
            mock_get_user.return_value = user

            mock_db = Mock()
            mock_db.commit = Mock()
            mock_db.rollback = Mock()
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_user] = lambda: user
            app.dependency_overrides[get_db] = lambda: mock_db

            try:
                response = client.post(
                    "/verification/extract-nid",
                    files={"nid_image": ("nid.gif", b"fake image data", "image/gif")},
                )

                assert response.status_code == 400
                assert "Only JPEG, PNG, and WebP images are allowed" in response.json()["detail"]
            finally:
                app.dependency_overrides.pop(get_current_user, None)
                app.dependency_overrides.pop(get_db, None)

    def test_update_ocr_confirmation(self):
        """Test persisting OCR confirmation state"""
        with patch('controllers.verification_controller.verification_controller.get_current_user') as mock_get_user, \
             patch('controllers.verification_controller.verification_controller.get_db') as mock_get_db:

            user = User("Test User", "test@example.com", "password123", "Male", "1234567890", 25)
            user.id = "test-user-id"
            user.ocr_confirmed = False
            mock_get_user.return_value = user

            mock_db = Mock()
            mock_db.commit = Mock()
            mock_db.rollback = Mock()
            mock_get_db.return_value = mock_db
            app.dependency_overrides[get_current_user] = lambda: user
            app.dependency_overrides[get_db] = lambda: mock_db

            try:
                response = client.put(
                    "/verification/ocr-confirmation",
                    json={"ocr_confirmed": True},
                )

                assert response.status_code == 200
                data = response.json()
                assert data["success"] is True
                assert data["ocr_confirmed"] is True
                assert user.ocr_confirmed is True
                mock_db.commit.assert_called_once()
            finally:
                app.dependency_overrides.pop(get_current_user, None)
                app.dependency_overrides.pop(get_db, None)
