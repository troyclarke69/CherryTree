import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class ProjectOut(BaseModel):
    id: uuid.UUID
    title: str
    category: str
    summary: str
    tech: list[str]
    href: str | None
    githref: str | None
    display: bool

class ProjectIn(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=120)
    summary: str = Field(min_length=5, max_length=280)
    tech: list[str] = Field(default_factory=list)
    href: str | None = Field(default=None, max_length=300)
    githref: str | None = Field(default=None, max_length=300)
    display: bool = True

class ContentOut(BaseModel):
    id: uuid.UUID
    category: str
    section: str
    blurb: str

class ContentIn(BaseModel):
    category: str = Field(default=None, max_length=100)
    section: str = Field(default=None, max_length=100)
    blurb: str = Field(min_length=10)

class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(min_length=10)

class ContactOut(BaseModel):
    id: uuid.UUID
    created_at: datetime

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)

