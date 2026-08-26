from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Skill
from ..schemas import SkillCreate, SkillRead

router = APIRouter(prefix="/skills", tags=["skills"])


@router.post("", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
def create_skill(payload: SkillCreate, db: Session = Depends(get_db)):
    if db.scalar(select(Skill).where(Skill.name == payload.name)):
        raise HTTPException(409, "Skill already exists")
    skill = Skill(**payload.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.get("", response_model=list[SkillRead])
def list_skills(db: Session = Depends(get_db)):
    return db.scalars(select(Skill).order_by(Skill.name)).all()
