import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, UserPreference, UserPresence, UserSkill, PresenceStatus
from ..schemas import (
    PreferenceUpdate,
    PresenceUpdate,
    UserCreate,
    UserRead,
    UserSkillCreate,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.username == payload.username)):
        raise HTTPException(409, "Username already exists")
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(409, "Email already exists")

    user = User(**payload.model_dump())
    db.add(user)
    db.flush()
    db.add(UserPreference(user_id=user.id))
    db.add(UserPresence(user_id=user.id))
    db.commit()
    db.refresh(user)
    return user


@router.get("", response_model=list[UserRead])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    limit = min(limit, 100)
    return db.scalars(select(User).offset(skip).limit(limit)).all()


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user


@router.post("/{user_id}/skills", status_code=status.HTTP_201_CREATED)
def add_skill(user_id: uuid.UUID, payload: UserSkillCreate, db: Session = Depends(get_db)):
    if not db.get(User, user_id):
        raise HTTPException(404, "User not found")
    existing = db.scalar(
        select(UserSkill).where(
            UserSkill.user_id == user_id, UserSkill.skill_id == payload.skill_id
        )
    )
    if existing:
        existing.proficiency = payload.proficiency
        existing.years_experience = payload.years_experience
    else:
        db.add(UserSkill(user_id=user_id, **payload.model_dump()))
    db.commit()
    return {"message": "Skill added"}


@router.get("/{user_id}/skills")
def get_user_skills(user_id: uuid.UUID, db: Session = Depends(get_db)):
    if not db.get(User, user_id):
        raise HTTPException(404, "User not found")
    rows = db.scalars(select(UserSkill).where(UserSkill.user_id == user_id)).all()
    return [
        {
            "skill_id": row.skill_id,
            "proficiency": row.proficiency,
            "years_experience": row.years_experience,
        }
        for row in rows
    ]


@router.patch("/{user_id}/preferences")
def update_preferences(
    user_id: uuid.UUID, payload: PreferenceUpdate, db: Session = Depends(get_db)
):
    if not db.get(User, user_id):
        raise HTTPException(404, "User not found")
    prefs = db.get(UserPreference, user_id)
    if not prefs:
        prefs = UserPreference(user_id=user_id)
        db.add(prefs)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(prefs, key, value)
    db.commit()
    return {"message": "Preferences updated"}


@router.patch("/{user_id}/presence")
def update_presence(
    user_id: uuid.UUID, payload: PresenceUpdate, db: Session = Depends(get_db)
):
    if not db.get(User, user_id):
        raise HTTPException(404, "User not found")
    try:
        status_value = PresenceStatus(payload.status)
    except ValueError:
        raise HTTPException(400, "Invalid presence status")
    presence = db.get(UserPresence, user_id)
    if not presence:
        presence = UserPresence(user_id=user_id)
        db.add(presence)
    presence.status = status_value
    presence.current_event_id = payload.current_event_id
    db.commit()
    return {"message": "Presence updated", "status": status_value.value}
