from google.cloud import secretmanager
from google.api_core.exceptions import GoogleAPICallError
import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class SecretManagerService:
    def __init__(self):
        self._client = None
        self.project_id = settings.google_cloud_project_id
    
    @property
    def client(self):
        if self._client is None:
            self._client = secretmanager.SecretManagerServiceClient()
        return self._client
    
    def store_refresh_token(self, user_id: str, refresh_token: str) -> bool:
        """Store refresh token in Google Cloud Secret Manager"""
        try:
            secret_id = f"google-refresh-token-{user_id}"
            parent = f"projects/{self.project_id}"
            
            # Create the secret if it doesn't exist
            secret = {
                "replication": {
                    "automatic": {}
                }
            }
            
            try:
                self.client.create_secret(
                    request={
                        "parent": parent,
                        "secret_id": secret_id,
                        "secret": secret,
                    }
                )
            except GoogleAPICallError as e:
                if "already exists" not in str(e):
                    logger.error(f"Error creating secret: {e}")
                    return False
            
            # Add the secret version
            payload = refresh_token.encode("UTF-8")
            parent = f"projects/{self.project_id}/secrets/{secret_id}"
            
            self.client.add_secret_version(
                request={
                    "parent": parent,
                    "payload": {"data": payload},
                }
            )
            
            logger.info(f"Successfully stored refresh token for user {user_id}")
            return True
            
        except GoogleAPICallError as e:
            logger.error(f"Error storing refresh token: {e}")
            return False
    
    def get_refresh_token(self, user_id: str) -> Optional[str]:
        """Retrieve refresh token from Google Cloud Secret Manager"""
        try:
            secret_id = f"google-refresh-token-{user_id}"
            name = f"projects/{self.project_id}/secrets/{secret_id}/versions/latest"
            
            response = self.client.access_secret_version(request={"name": name})
            payload = response.payload.data.decode("UTF-8")
            
            return payload
            
        except GoogleAPICallError as e:
            logger.error(f"Error retrieving refresh token: {e}")
            return None
    
    def delete_refresh_token(self, user_id: str) -> bool:
        """Delete refresh token from Google Cloud Secret Manager"""
        try:
            secret_id = f"google-refresh-token-{user_id}"
            name = f"projects/{self.project_id}/secrets/{secret_id}"
            
            self.client.delete_secret(request={"name": name})
            
            logger.info(f"Successfully deleted refresh token for user {user_id}")
            return True
            
        except GoogleAPICallError as e:
            logger.error(f"Error deleting refresh token: {e}")
            return False


# Global instance
secret_manager = SecretManagerService()