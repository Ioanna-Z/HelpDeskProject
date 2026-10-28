from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# SQLite database configuration
DATABASE_URL = "sqlite:///./helpdesk.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Database session factory
SessionLocal = sessionmaker(bind=engine)


# Base class for database models
class Base(DeclarativeBase):
    pass