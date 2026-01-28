from os import getenv
from dotenv import load_dotenv

load_dotenv()

environment = getenv("ENVIRONMENT", "development")
database_url = getenv("DATABASE_URL", "")
checkpoint_saver_url = getenv("CHECKPOINT_SAVER_URL", "")

# OpenRouter base URL (API keys vem do banco de dados por organizacao)
openrouter_base_url = getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

# JWT
jwt_secret = getenv("JWT_SECRET", "dev-secret-change-in-production")
jwt_algorithm = getenv("JWT_ALGORITHM", "HS256")
jwt_expiration_hours = int(getenv("JWT_EXPIRATION_HOURS", "24"))