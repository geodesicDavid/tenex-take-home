import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class MockSecretManagerService:
    def __init__(self):
        self.project_id = settings.google_cloud_project_id
        self._storage = {}  # In-memory storage for development
    
    def store_refresh_token(self, user_id: str, refresh_token: str) -> bool:
        """Store refresh token in mock storage"""
        try:
            secret_id = f"google-refresh-token-{user_id}"
            self._storage[secret_id] = refresh_token
            
            logger.info(f"Successfully stored refresh token for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error storing refresh token: {e}")
            return False
    
    def get_refresh_token(self, user_id: str) -> Optional[str]:
        """Retrieve refresh token from mock storage"""
        try:
            secret_id = f"google-refresh-token-{user_id}"
            return self._storage.get(secret_id)
            
        except Exception as e:
            logger.error(f"Error retrieving refresh token: {e}")
            return None
    
    def delete_refresh_token(self, user_id: str) -> bool:
        """Delete refresh token from mock storage"""
        try:
            secret_id = f"google-refresh-token-{user_id}"
            if secret_id in self._storage:
                del self._storage[secret_id]
            
            logger.info(f"Successfully deleted refresh token for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting refresh token: {e}")
            return False


# Global instance
secret_manager = MockSecretManagerService()