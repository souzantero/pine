from os import getenv
from dotenv import load_dotenv

load_dotenv()

environment = getenv("ENVIRONMENT", "development")
database_url = getenv("DATABASE_URL", "")
checkpoint_saver_url = getenv("CHECKPOINT_SAVER_URL", "")