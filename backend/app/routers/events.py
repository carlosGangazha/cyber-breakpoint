import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import CTFEvent, EventInterest, EventInterestStatus, User
from ..schemas import CTFEventCreate, CTFEventRead, EventInterestCreate

router = APIRouter(prefix="/events", tags=["ctf-events"])


@router.post("", response_model=CTFEventRead, status_code=status.HTTP_201_CREATED)
def create_event(payload: CTFEventCreate, db: Session = Depends(get_db)):
    event = CTFEvent(**payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("", response_model=list[CTFEventRead])
def list_events(
    status_filter: str | None = None,
    upcoming_only: bool = False,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    limit = min(limit, 100)
    query = select(CTFEvent).order_by(CTFEvent.start_time)
    if status_filter:
        query = query.where(CTFEvent.status == status_filter)
    if upcoming_only:
        query = query.where(CTFEvent.start_time >= datetime.now(timezone.utc))
    return db.scalars(query.limit(limit)).all()


@router.get("/{event_id}", response_model=CTFEventRead)
def get_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    event = db.get(CTFEvent, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    return event


@router.post("/{event_id}/interest", status_code=status.HTTP_201_CREATED)
def express_interest(
    event_id: uuid.UUID, payload: EventInterestCreate, db: Session = Depends(get_db)
):
    if not db.get(CTFEvent, event_id):
        raise HTTPException(404, "Event not found")
    if not db.get(User, payload.user_id):
        raise HTTPException(404, "User not found")

    try:
        interest_status = EventInterestStatus(payload.status)
    except ValueError:
        raise HTTPException(400, "Invalid interest status")

    interest = db.scalar(
        select(EventInterest).where(
            EventInterest.user_id == payload.user_id,
            EventInterest.event_id == event_id,
        )
    )
    if interest:
        interest.status = interest_status
    else:
        interest = EventInterest(
            user_id=payload.user_id,
            event_id=event_id,
            status=interest_status,
        )
        db.add(interest)
    db.commit()
    return {"message": "Event interest saved"}


@router.get("/{event_id}/interested")
def list_interested_users(event_id: uuid.UUID, db: Session = Depends(get_db)):
    if not db.get(CTFEvent, event_id):
        raise HTTPException(404, "Event not found")

    rows = db.execute(
        select(User.id, User.username, User.display_name, EventInterest.status)
        .join(EventInterest, EventInterest.user_id == User.id)
        .where(EventInterest.event_id == event_id)
    ).all()

    return [
        {
            "user_id": row.id,
            "username": row.username,
            "display_name": row.display_name,
            "status": row.status.value,
        }
        for row in rows
    ]
