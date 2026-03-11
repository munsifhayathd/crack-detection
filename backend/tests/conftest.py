import pytest


@pytest.fixture
def app_settings():
    """Provide test settings."""
    return {
        "APP_NAME": "Test App",
        "ENVIRONMENT": "testing",
    }
