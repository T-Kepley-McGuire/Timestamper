import os

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

from dotenv import load_dotenv

load_dotenv()

PRIVATE_KEY_PEM = os.environ.get("PRIVATE_SIGNATURE_KEY")

PRIVATE_SIGNATURE_KEY: str = serialization.load_pem_private_key(
    PRIVATE_KEY_PEM.encode(),
    password=None,
    backend=default_backend()
)

