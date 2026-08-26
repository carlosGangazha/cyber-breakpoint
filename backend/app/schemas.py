import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: str = Field(max_length=320)
    display_name: str | None = None
    country: str | None = None
    timezone: str | None = None


class UserRead(ORMModel):
    id: uuid.UUID
    username: str
    email: str
    display_name: str | None
    avatar_url: str | None
    bio: str | None
    country: str | None
    timezone: str | None
    account_status: str
    created_at: datetime


class SkillCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    category: str | None = None
    description: str | None = None


class SkillRead(ORMModel):
    id: uuid.UUID
    name: str
    category: str | None
    description: str | None


class UserSkillCreate(BaseModel):
    skill_id: uuid.UUID
    proficiency: int = Field(default=1, ge=1, le=5)
    years_experience: int = Field(default=0, ge=0)


class PreferenceUpdate(BaseModel):
    looking_for_team: bool | None = None
    available_for_ctfs: bool | None = None
    available_for_bounties: bool | None = None
    show_online_status: bool | None = None
    allow_team_invites: bool | None = None


class PresenceUpdate(BaseModel):
    status: str
    current_event_id: uuid.UUID | None = None


class CTFEventCreate(BaseModel):
    name: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    registration_url: str | None = None
    official_url: str | None = None
    format: str | None = None
    is_online: bool = True
    country: str | None = None
    status: str = "upcoming"


class CTFEventRead(ORMModel):
    id: uuid.UUID
    name: str
    description: str | None
    start_time: datetime
    end_time: datetime
    registration_url: str | None
    official_url: str | None
    format: str | None
    is_online: bool
    country: str | None
    status: str


class EventInterestCreate(BaseModel):
    user_id: uuid.UUID
    status: str = "interested"


class TeamCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: str | None = None
    owner_id: uuid.UUID


class TeamRead(ORMModel):
    id: uuid.UUID
    name: str
    description: str | None
    owner_id: uuid.UUID
    created_at: datetime


class TeamMemberCreate(BaseModel):
    user_id: uuid.UUID
    role: str = "member"


class TeamInvitationCreate(BaseModel):
    inviter_id: uuid.UUID
    invitee_id: uuid.UUID
    event_id: uuid.UUID | None = None
    message: str | None = None
    expires_at: datetime | None = None
