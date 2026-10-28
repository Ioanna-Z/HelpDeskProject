from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
from database import Base, engine, SessionLocal

app = FastAPI()

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

# Provide a database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Allow requests from the React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schemas
class TicketCreate(BaseModel):
    title: str
    category: str
    priority: str


class TicketStatusUpdate(BaseModel):
    status: str

@app.get("/")
def home():
    return {"message": "HelpDeskProject API is running"}

# Retrieve all tickets
@app.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):
    return db.query(models.Ticket).all()

# Create a new ticket
@app.post("/tickets", status_code=201)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):
    new_ticket = models.Ticket(
        title=ticket.title,
        category=ticket.category,
        priority=ticket.priority,
        status="Open"
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket

# Update an existing ticket's status
@app.patch("/tickets/{ticket_id}")
def update_ticket_status(
    ticket_id: int,
    update: TicketStatusUpdate,
    db: Session = Depends(get_db)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id
    ).first()

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    if update.status not in ["Open", "In Progress", "Resolved"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid ticket status"
        )

    ticket.status = update.status
    db.commit()
    db.refresh(ticket)

    return ticket

# Delete an existing ticket
@app.delete("/tickets/{ticket_id}", status_code=204)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id
    ).first()

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    db.delete(ticket)
    db.commit()