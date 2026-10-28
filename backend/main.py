from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketCreate(BaseModel):
    title: str
    category: str
    priority: str


@app.get("/")
def home():
    return {"message": "HelpDeskProject API is running"}



@app.get("/tickets")
def get_tickets():
    return [
        {
            "id": 1,
            "title": "Cannot access company email",
            "category": "Email",
            "priority": "High",
            "status": "Open"
        },
        {
            "id": 2,
            "title": "Printer not responding",
            "category": "Hardware",
            "priority": "Medium",
            "status": "In Progress"
        },
        {
            "id": 3,
            "title": "Password reset request",
            "category": "Account",
            "priority": "Low",
            "status": "Resolved"
        },
        {
            "id": 4,
            "title": "VPN connection issue",
            "category": "Network",
            "priority": "High",
            "status": "Open"
        }
    ]


@app.post("/tickets", status_code=201)
def create_ticket(ticket: TicketCreate):
    tickets = get_tickets()

    new_ticket = {
        "id": max(t["id"] for t in tickets) + 1,
        "title": ticket.title,
        "category": ticket.category,
        "priority": ticket.priority,
        "status": "Open"
    }

    tickets.append(new_ticket)
    return new_ticket
