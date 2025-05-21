import { useEffect, useState } from "react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formType, setFormType] = useState(null); // 'event' or 'task'
  const [formData, setFormData] = useState({ title: "", description: "", date: "" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                events {
                  id
                  title
                  description
                  date
                }
              }
            `,
          }),
        });

        const result = await response.json();
        setEvents(result.data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formType === "event") {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation CreateEvent($input: EventInput!) {
                createEvent(input: $input) {
                  id
                  title
                  description
                  date
                }
              }
            `,
            variables: { input: formData },
          }),
        });

        const result = await response.json();
        setEvents((prev) => [result.data.createEvent, ...prev]);
        setFormType(null);
        setFormData({ title: "", description: "", date: "" });
      } catch (error) {
        console.error("Failed to create event:", error);
      }
    } else if (formType === "task") {
      alert("Task creation functionality will be implemented here.");
      setFormType(null);
      setFormData({ title: "", description: "", date: "" });
    }
  };

  const formatDate = (rawDate) => {
    const date = new Date(Number(rawDate)); // Ensure it's treated as a number
    return !isNaN(date.getTime())
      ? date.toISOString().split("T")[0]
      : "Invalid Date";
  };
  

  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <section>
        <h2>Today's Overview</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <h3>Upcoming Events</h3>
            {events.length === 0 ? (
              <p>No upcoming events.</p>
            ) : (
              <ul>
                {events.map((event) => (
                  <li key={event.id}>
                    <strong>{event.title}</strong> – {formatDate(event.date)}
                    <p>{event.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 250 }}>
            <h3>Pending Tasks</h3>
            {tasks.length === 0 ? (
              <p>No pending tasks.</p>
            ) : (
              <ul>
                {tasks.map((task) => (
                  <li key={task.id}>{task.description}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2>Quick Actions</h2>
        <button style={{ marginRight: "1rem" }} onClick={() => setFormType("event")}>+ Add Event</button>
        <button onClick={() => setFormType("task")}>+ Add Task</button>
      </section>

      {formType && (
        <section>
          <h3>{formType === "event" ? "Create Event" : "Create Task"}</h3>
          <form onSubmit={handleFormSubmit} style={{ display: "grid", gap: "1rem", maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
            {formType === "event" && (
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            )}
            <div>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setFormType(null)} style={{ marginLeft: "1rem" }}>Cancel</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
