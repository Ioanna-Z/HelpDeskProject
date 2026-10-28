
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);

    useEffect(() => {
      fetch("http://127.0.0.1:8000/tickets")
        .then((response) => response.json())
        .then((data) => setTickets(data))
        .catch((error) => console.error("Error fetching tickets:", error));
    }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "Email",
    priority: "Medium",
  });

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const filteredTickets = tickets.filter((ticket) => {
  const matchesSearch = ticket.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    categoryFilter === "All" || ticket.category === categoryFilter;

  const matchesStatus =
    statusFilter === "All" || ticket.status === statusFilter;

  return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = [
    { label: "Total Tickets", value: tickets.length, type: "total" },
    { label: "Open", value: openTickets, type: "open" },
    { label: "In Progress", value: inProgressTickets, type: "progress" },
    { label: "Resolved", value: resolvedTickets, type: "resolved" },
  ];

  

async function handleCreateTicket(event) {
  event.preventDefault();

  if (!newTicket.title.trim()) {
    alert("Please enter a ticket title.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTicket.title.trim(),
        category: newTicket.category,
        priority: newTicket.priority,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create ticket");
    }

    const createdTicket = await response.json();

    setTickets((previousTickets) => [
      ...previousTickets,
      createdTicket,
    ]);

    setNewTicket({
      title: "",
      category: "Email",
      priority: "Medium",
    });

    setShowForm(false);
  } catch (error) {
    console.error("Error creating ticket:", error);
    alert("Could not create ticket. Please try again.");
  }
}



async function handleStatusChange(ticketId, newStatus) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/tickets/${ticketId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update ticket status");
    }

    const updatedTicket = await response.json();

    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket.id === ticketId ? updatedTicket : ticket
      )
    );
  } catch (error) {
    console.error("Error updating ticket:", error);
    alert("Could not update ticket status.");
  }
}


async function handleDeleteTicket(ticketId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this ticket?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/tickets/${ticketId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete ticket");
    }

    setTickets((previousTickets) =>
      previousTickets.filter((ticket) => ticket.id !== ticketId)
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    alert("Could not delete ticket. Please try again.");
  }
}



  return (
    <main>
      <header className="dashboard-header">
        <span className="eyebrow">HELPDESKPROJECT</span>
        <h1>IT Support Dashboard</h1>
        <p>Manage, track and resolve support tickets efficiently.</p>
      </header>

      <section className="overview-section">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className={`stat-card ${stat.type}`} key={stat.type}>
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="tickets-section">
        <h2>Support Tickets</h2>
        
        <button
          type="button"
          className="new-ticket-button"
          onClick={() => setShowForm(!showForm)}
        >
          + New Ticket
        </button>

        
        {showForm && (
          <form className="ticket-form" onSubmit={handleCreateTicket}>
            <h3>Create New Ticket</h3>

            <div className="form-field">
              <label htmlFor="ticket-title">Ticket Title</label>
              <input
                id="ticket-title"
                type="text"
                placeholder="Describe the issue..."
                value={newTicket.title}
                onChange={(event) =>
                  setNewTicket({
                    ...newTicket,
                    title: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="ticket-category">Category</label>
                <select
                  id="ticket-category"
                  value={newTicket.category}
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      category: event.target.value,
                    })
                  }
                >
                  <option value="Email">Email</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Account">Account</option>
                  <option value="Network">Network</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="ticket-priority">Priority</label>
                <select
                  id="ticket-priority"
                  value={newTicket.priority}
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      priority: event.target.value,
                    })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="create-ticket-button">
                Create Ticket
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}


        <p className="section-description">
          View and manage all support requests.
        </p>

        
        <div className="ticket-toolbar">
          <input
            type="search"
            placeholder="Search tickets..."
            aria-label="Search tickets"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Email">Email</option>
            <option value="Hardware">Hardware</option>
            <option value="Account">Account</option>
            <option value="Network">Network</option>
          </select>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>


        
        <div className="table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.id}</td>
                  <td className="ticket-title">{ticket.title}</td>
                  <td>
                    <span className="badge category-badge">
                      {ticket.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge priority-${ticket.priority.toLowerCase()}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  
                  <td>
                    <select
                      aria-label={`Change status for ticket ${ticket.id}`}
                      className={`status-select status-${ticket.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                      value={ticket.status}
                      onChange={(event) =>
                        handleStatusChange(ticket.id, event.target.value)
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteTicket(ticket.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>

              ))}
            </tbody>
          </table>

          {filteredTickets.length === 0 && (
            <p className="empty-message">
              No tickets match your search or filters.
            </p>
          )}
        </div>

      </section>
    </main>
  );
}

export default App;
