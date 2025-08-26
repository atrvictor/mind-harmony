import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import AdminEventsManagement from "@/polymet/components/admin-events-management";
import { buildDefaultAnnouncement } from "../../lib/emailTemplates";

export default function AdminPage() {
  const { user } = useAuth();
  const [community, setCommunity] = React.useState<any[]>([]);
  const [waitlist, setWaitlist] = React.useState<any[]>([]);
  const [newsletter, setNewsletter] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // Event ticket management state
  const [events, setEvents] = React.useState<any[]>([]);
  const [reservations, setReservations] = React.useState<any[]>([]);
  const [eventEdits, setEventEdits] = React.useState<{ [eventId: number]: number }>({});
  const [eventSaving, setEventSaving] = React.useState<{ [eventId: number]: boolean }>({});
  const [eventSaveError, setEventSaveError] = React.useState<{ [eventId: number]: string }>({});
  // Create ticketed event (legacy reservations system)
  const [newEventName, setNewEventName] = React.useState("");
  const [newEventDate, setNewEventDate] = React.useState(""); // datetime-local
  const [newEventMaxSeats, setNewEventMaxSeats] = React.useState<number>(50);
  const [creatingEvent, setCreatingEvent] = React.useState(false);
  const [sendingAnnouncement, setSendingAnnouncement] = React.useState(false);
  // Removed per simplified announce button state

  // Admin emails
  const adminEmails = ["atrvictor@gmail.com", "mashashen@yahoo.com"];
  const isAdmin = !!(user && user.email && adminEmails.includes(user.email));

  function formatReserved(dt?: string) {
    if (!dt) return '—';
    // If the string lacks timezone info, assume UTC to avoid local misinterpretation
    const hasTZ = /[zZ]|[+-]\d{2}:?\d{2}$/.test(dt);
    const d = new Date(hasTZ ? dt : dt + 'Z');
    return d.toLocaleString();
  }

  React.useEffect(() => {
    if (!user) return;
    if (!isAdmin) return;
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // Fetch events and reservations for ticket management
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("id, name, max_seats");
        const { data: reservationsData, error: reservationsError } = await supabase
          .from("reservations")
          .select("id, event_id, visitor_name, visitor_email, phone, seats, donation, created_at")
          .order("created_at", { ascending: false });
        // Fetch other dashboard data
        const { data: communityData, error: communityError } = await supabase
          .from("community")
          .select("name, email, phone, interest, created_at")
          .order("created_at", { ascending: false });
        const { data: waitlistData, error: waitlistError } = await supabase
          .from("waitlist")
          .select("email, created_at")
          .order("created_at", { ascending: false });
        const { data: newsletterData, error: newsletterError } = await supabase
          .from("newsletter")
          .select("email, created_at")
          .order("created_at", { ascending: false });
        if (eventsError || reservationsError || communityError || waitlistError || newsletterError) {
          setError("Failed to fetch data from Supabase.");
        } else {
          setEvents(eventsData || []);
          setReservations(reservationsData || []);
          setCommunity(communityData || []);
          setWaitlist(waitlistData || []);
          setNewsletter(newsletterData || []);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // Calculate reserved seats and tickets left for each event
  function getEventStats(eventId: number, maxSeats: number) {
    const reserved = reservations
      .filter((r) => r.event_id === eventId)
      .reduce((sum, r) => sum + (r.seats || 0), 0);
    const left = maxSeats - reserved;
    return { reserved, left };
  }

  // Handle max_seats edit
  const handleEditChange = (eventId: number, value: number) => {
    setEventEdits((prev) => ({ ...prev, [eventId]: value }));
  };

  // Save max_seats update
  const handleSave = async (eventId: number) => {
    setEventSaving((prev) => ({ ...prev, [eventId]: true }));
    setEventSaveError((prev) => ({ ...prev, [eventId]: "" }));
    const newMaxSeats = eventEdits[eventId];
    const { error } = await supabase
      .from("events")
      .update({ max_seats: newMaxSeats })
      .eq("id", eventId);
    if (error) {
      setEventSaveError((prev) => ({ ...prev, [eventId]: error.message }));
    } else {
      setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, max_seats: newMaxSeats } : e));
    }
    setEventSaving((prev) => ({ ...prev, [eventId]: false }));
  };

  // Delete a reservation
  const handleDeleteReservation = async (reservationId: number) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", reservationId);
    if (!error) {
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    } else {
      alert("Failed to delete reservation: " + error.message);
    }
  };

  // Create a new legacy ticketed event for reservations table
  const handleCreateTicketedEvent = async () => {
    if (!newEventName || !newEventDate || !newEventMaxSeats) return;
    setCreatingEvent(true);
    try {
      const eventDateIso = new Date(newEventDate).toISOString();
      const baseSlug = newEventName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const slug = `${baseSlug}-${Math.floor(new Date(newEventDate).getTime() / 1000)}`;
      const { data, error } = await supabase
        .from("events")
        .insert({ name: newEventName, slug, event_date: eventDateIso, max_seats: newEventMaxSeats })
        .select()
        .single();
      if (error) throw error;
      setEvents((prev) => [...prev, data]);
      setNewEventName("");
      setNewEventDate("");
      setNewEventMaxSeats(50);
    } catch (e: any) {
      alert(`Failed to create event: ${e.message || e}`);
    } finally {
      setCreatingEvent(false);
    }
  };

  // Quick action: Send announcement to Event 1 attendees (uses batch API)
  const handleSendAnnouncement = async (eventId: number) => {
    setSendingAnnouncement(true);
    try {
      // Fetch recipient emails
      const { data: recipients, error: recErr } = await supabase
        .from('reservations')
        .select('visitor_email')
        .eq('event_id', eventId);
      if (recErr) throw new Error(recErr.message);
      const to = Array.from(new Set((recipients || []).map((r: any) => r.visitor_email).filter(Boolean)));
      if (to.length === 0) {
        alert('No recipients for this event.');
        return;
      }

      // Fetch event meta
      const { data: ev } = await supabase
        .from('events')
        .select('name, event_date, location, address')
        .eq('id', eventId)
        .single();

      const venueLines: string[] = [];
      if (ev?.location) venueLines.push(ev.location);
      if (ev?.address) venueLines.push(ev.address);
      const { subject, html } = buildDefaultAnnouncement(ev?.name || 'Piano Meditation Experience', ev?.event_date, venueLines);

      const resp = await fetch('/api/sendAnnouncement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, to, html })
      });
      const text = await resp.text();
      alert(`Announcement response: ${text.substring(0, 400)}...`);
    } catch (e: any) {
      alert(`Failed to send announcement: ${e?.message || e}`);
    } finally {
      setSendingAnnouncement(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <p>Please log in to access this page.</p>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      
      {/* Events Management Section */}
      <section className="mb-12">
        <AdminEventsManagement />
      </section>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">{error}</div>
      ) : (
        <>
          {/* Ticket Management Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Ticket Management</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" disabled={sendingAnnouncement} onClick={() => handleSendAnnouncement(1)}>
                  {sendingAnnouncement ? 'Sending...' : 'Send Announcement (Event 1)'}
                </Button>
              </div>
            </div>
            {/* Create legacy ticketed event */}
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">Event Name</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="Roots Meditation & Piano Journey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Event Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded px-3 py-2"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Seats</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border rounded px-3 py-2"
                    value={newEventMaxSeats}
                    onChange={(e) => setNewEventMaxSeats(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Button onClick={handleCreateTicketedEvent} disabled={creatingEvent || !newEventName || !newEventDate}>
                    {creatingEvent ? "Creating..." : "Create Ticketed Event"}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">This creates an entry in the legacy reservations system (`events` table). Use this for seat tracking and reservations.</p>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Event</th>
                    <th className="px-4 py-2 border-b text-left">Max Seats</th>
                    <th className="px-4 py-2 border-b text-left">Reserved</th>
                    <th className="px-4 py-2 border-b text-left">Tickets Left</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                    <th className="px-4 py-2 border-b text-left">Announcement</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-2 text-center text-gray-500">No events found.</td></tr>
                  ) : (
                    events.map((event) => {
                      const { reserved, left } = getEventStats(event.id, event.max_seats);
                      // Get reservations for this event
                      const eventReservations = reservations.filter((r) => r.event_id === event.id);
                      return (
                        <React.Fragment key={event.id}>
                          <tr className="border-b last:border-b-0">
                            <td className="px-4 py-2 align-top">{event.name}</td>
                            <td className="px-4 py-2 align-top">
                              <input
                                type="number"
                                min={1}
                                value={eventEdits[event.id] !== undefined ? eventEdits[event.id] : event.max_seats}
                                onChange={e => handleEditChange(event.id, Number(e.target.value))}
                                className="border rounded px-2 py-1 w-20"
                              />
                            </td>
                            <td className="px-4 py-2 align-top">{reserved}</td>
                            <td className="px-4 py-2 align-top">{left}</td>
                            <td className="px-4 py-2 align-top">
                              <Button
                                size="sm"
                                onClick={() => handleSave(event.id)}
                                disabled={eventSaving[event.id] || (eventEdits[event.id] === undefined || eventEdits[event.id] === event.max_seats)}
                              >
                                {eventSaving[event.id] ? "Saving..." : "Save"}
                              </Button>
                              {eventSaveError[event.id] && (
                                <div className="text-xs text-red-600 mt-1">{eventSaveError[event.id]}</div>
                              )}
                            </td>
                            <td className="px-4 py-2 align-top">
                              <Button size="sm" variant="outline" onClick={() => handleSendAnnouncement(event.id)}>
                                Send Announcement
                              </Button>
                            </td>
                          </tr>
                          {/* Reservations for this event */}
                          {eventReservations.length > 0 && (
                            <tr>
                              <td colSpan={5} className="bg-gray-50 px-4 py-2">
                                <div className="mb-2 font-semibold">Reservations:</div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm">
                                    <thead>
                                      <tr>
                                        <th className="px-2 py-1 text-left">Name</th>
                                        <th className="px-2 py-1 text-left">Email</th>
                                        <th className="px-2 py-1 text-left">Phone</th>
                                        <th className="px-2 py-1 text-left">Seats</th>
                                        <th className="px-2 py-1 text-left">Reserved</th>
                                        <th className="px-2 py-1 text-left">Delete</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {eventReservations.map((res) => (
                                        <tr key={res.id}>
                                          <td className="px-2 py-1">{res.visitor_name}</td>
                                          <td className="px-2 py-1">{res.visitor_email}</td>
                                          <td className="px-2 py-1">{res.phone || '—'}</td>
                                          <td className="px-2 py-1">{res.seats}</td>
                                          <td className="px-2 py-1 text-xs text-gray-500">{formatReserved(res.created_at)}</td>
                                          <td className="px-2 py-1">
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteReservation(res.id)}>
                                              Delete
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Existing dashboard sections */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Community Signups</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Phone</th>
                    <th className="px-4 py-2 border-b text-left">Interest</th>
                    <th className="px-4 py-2 border-b text-left">Signed Up</th>
                  </tr>
                </thead>
                <tbody>
                  {community.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-2 text-center text-gray-500">No signups yet.</td></tr>
                  ) : (
                    community.map((c, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2">{c.name}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.phone || '—'}</td>
                        <td className="px-4 py-2">{c.interest}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{c.created_at ? new Date(c.created_at).toLocaleString() : ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Waitlist (Meditation Notify Me)</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.length === 0 ? (
                    <tr><td colSpan={2} className="px-4 py-2 text-center text-gray-500">No waitlist signups yet.</td></tr>
                  ) : (
                    waitlist.map((w, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2">{w.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{w.created_at ? new Date(w.created_at).toLocaleString() : ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Newsletter Signups</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletter.length === 0 ? (
                    <tr><td colSpan={2} className="px-4 py-2 text-center text-gray-500">No newsletter signups yet.</td></tr>
                  ) : (
                    newsletter.map((n, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2">{n.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
} 