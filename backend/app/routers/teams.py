import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    Team,
    TeamInvitation,
    TeamMember,
    TeamMemberRole,
    User,
)
from ..schemas import TeamCreate, TeamInvitationCreate, TeamMemberCreate, TeamRead

router = APIRouter(prefix="/teams", tags=["teams"])


@router.post("", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
def create_team(payload: TeamCreate, db: Session = Depends(get_db)):
    if not db.get(User, payload.owner_id):
        raise HTTPException(404, "Owner not found")

    team = Team(**payload.model_dump())
    db.add(team)
    db.flush()
    db.add(
        TeamMember(
            team_id=team.id,
            user_id=team.owner_id,
            role=TeamMemberRole.captain,
        )
    )
    db.commit()
    db.refresh(team)
    return team


@router.get("/{team_id}", response_model=TeamRead)
def get_team(team_id: uuid.UUID, db: Session = Depends(get_db)):
    team = db.get(Team, team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    return team


@router.post("/{team_id}/members", status_code=status.HTTP_201_CREATED)
def add_member(team_id: uuid.UUID, payload: TeamMemberCreate, db: Session = Depends(get_db)):
    if not db.get(Team, team_id):
        raise HTTPException(404, "Team not found")
    if not db.get(User, payload.user_id):
        raise HTTPException(404, "User not found")
    if db.scalar(
        select(TeamMember).where(
            TeamMember.team_id == team_id, TeamMember.user_id == payload.user_id
        )
    ):
        raise HTTPException(409, "User is already a team member")

    try:
        role = TeamMemberRole(payload.role)
    except ValueError:
        raise HTTPException(400, "Invalid team member role")

    db.add(TeamMember(team_id=team_id, user_id=payload.user_id, role=role))
    db.commit()
    return {"message": "Member added"}


@router.get("/{team_id}/members")
def list_members(team_id: uuid.UUID, db: Session = Depends(get_db)):
    if not db.get(Team, team_id):
        raise HTTPException(404, "Team not found")

    rows = db.execute(
        select(User.id, User.username, User.display_name, TeamMember.role, TeamMember.status)
        .join(TeamMember, TeamMember.user_id == User.id)
        .where(TeamMember.team_id == team_id)
    ).all()

    return [
        {
            "user_id": row.id,
            "username": row.username,
            "display_name": row.display_name,
            "role": row.role.value,
            "status": row.status,
        }
        for row in rows
    ]


@router.post("/{team_id}/invitations", status_code=status.HTTP_201_CREATED)
def invite_user(
    team_id: uuid.UUID,
    payload: TeamInvitationCreate,
    db: Session = Depends(get_db),
):
    if not db.get(Team, team_id):
        raise HTTPException(404, "Team not found")
    if not db.get(User, payload.inviter_id) or not db.get(User, payload.invitee_id):
        raise HTTPException(404, "Inviter or invitee not found")

    invitation = TeamInvitation(team_id=team_id, **payload.model_dump())
    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    return {
        "id": invitation.id,
        "team_id": team_id,
        "invitee_id": invitation.invitee_id,
        "status": invitation.status.value,
    }
