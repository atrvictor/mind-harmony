import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import AuthenticatedLayout from "@/polymet/layouts/main-layout";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Event {
  id: number;
  name: string;
  event_date: string;
  max_seats: number;
}

interface Reservation {
  id: number;
  event_id: number;
  visitor_name: string;
  visitor_email: string;
  phone: string | null;
  seats: number;
  created_at: string;
}

export default function AdminEventManagement() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New event form state
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventMaxSeats, setNewEventMaxSeats] = useState(50);
  const [isCreating, setIsCreating] = useState(false);
  
  // Edit states
  const [editingSeats, setEditingSeats] = useState<{[key: number]: number}>({});
  const [savingSeats, setSavingSeats] = useState<{[key: number]: boolean}>({});
  const [seatErrors, setSeatErrors] = useState<{[key: number]: string}>({});
  
  // Announcement state
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  const isAdmin = user?.email === 'harmoniusmind@gmail.com' || user?.email === 'atrvictor@gmail.com';

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, name, event_date, max_seats')
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch reservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('id, event_id, visitor_name, visitor_email, phone, seats, created_at')
        .order('created_at', { ascending: false });

      if (reservationsError) throw reservationsError;

      setEvents(eventsData || []);
      setReservations(reservationsData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    if (!newEventName || !newEventDate) return;

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          name: newEventName,
          event_date: newEventDate,
          max_seats: newEventMaxSeats
        }]);

      if (error) throw error;

      // Reset form
      setNewEventName("");
      setNewEventDate("");
      setNewEventMaxSeats(50);
      
      // Refresh data
      await fetchData();
    } catch (err: any) {
      alert(`Error creating event: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const updateMaxSeats = async (eventId: number) => {
    const newSeats = editingSeats[eventId];
    if (newSeats === undefined || newSeats === events.find(e => e.id === eventId)?.max_seats) return;

    setSavingSeats(prev => ({ ...prev, [eventId]: true }));
    setSeatErrors(prev => ({ ...prev, [eventId]: "" }));

    try {
      const { error } = await supabase
        .from('events')
        .update({ max_seats: newSeats })
        .eq('id', eventId);

      if (error) throw error;

      // Update local state
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, max_seats: newSeats } : e));
      setEditingSeats(prev => ({ ...prev, [eventId]: undefined }));
    } catch (err: any) {
      setSeatErrors(prev => ({ ...prev, [eventId]: err.message }));
    } finally {
      setSavingSeats(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const deleteReservation = async (reservationId: number) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;

      setReservations(prev => prev.filter(r => r.id !== reservationId));
    } catch (err: any) {
      alert(`Error deleting reservation: ${err.message}`);
    }
  };

  const sendAnnouncement = async (eventId: number) => {
    setSendingAnnouncement(true);
    try {
      const response = await fetch('/api/sendAnnouncement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");

      alert(`Announcement sent to ${data.sent} attendee(s).`);
    } catch (err: any) {
      alert(`Error sending announcement: ${err.message}`);
    } finally {
      setSendingAnnouncement(false);
    }
  };

  const getReservationStats = (eventId: number, maxSeats: number) => {
    const eventReservations = reservations.filter(r => r.event_id === eventId);
    const reserved = eventReservations.reduce((sum, res) => sum + res.seats, 0);
    const left = maxSeats - reserved;
    return { reserved, left };
  };

  if (!user) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Management</h1>
          <p>Please log in to access this page.</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Management</h1>
          <p>You are not authorized to view this page.</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <p>Loading...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header with back link */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/admin" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">Event Management</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Create New Event */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <Label className="block text-sm font-medium mb-1">Event Name</Label>
                <Input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="Roots Meditation & Piano Journey"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">Event Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">Max Seats</Label>
                <Input
                  type="number"
                  min={1}
                  value={newEventMaxSeats}
                  onChange={(e) => setNewEventMaxSeats(Number(e.target.value))}
                />
              </div>
              <div>
                <Button 
                  onClick={createEvent} 
                  disabled={isCreating || !newEventName || !newEventDate}
                >
                  {isCreating ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This creates an entry in the legacy reservations system (`events` table). Use this for seat tracking and reservations.
            </p>
          </div>
        </section>

        {/* Events List */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Events & Reservations</h2>
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
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map(event => {
                    const { reserved, left } = getReservationStats(event.id, event.max_seats);
                    const eventReservations = reservations.filter(r => r.event_id === event.id);

                    return (
                      <React.Fragment key={event.id}>
                        <tr className="border-b last:border-b-0">
                          <td className="px-4 py-2 align-top">{event.name}</td>
                          <td className="px-4 py-2 align-top">
                            <Input
                              type="number"
                              min={1}
                              value={editingSeats[event.id] !== undefined ? editingSeats[event.id] : event.max_seats}
                              onChange={(e) => setEditingSeats(prev => ({ ...prev, [event.id]: Number(e.target.value) }))}
                              className="w-20"
                            />
                          </td>
                          <td className="px-4 py-2 align-top">{reserved}</td>
                          <td className="px-4 py-2 align-top">{left}</td>
                          <td className="px-4 py-2 align-top">
                            <Button
                              size="sm"
                              onClick={() => updateMaxSeats(event.id)}
                              disabled={savingSeats[event.id] || editingSeats[event.id] === undefined || editingSeats[event.id] === event.max_seats}
                            >
                              {savingSeats[event.id] ? "Saving..." : "Save"}
                            </Button>
                            {seatErrors[event.id] && (
                              <div className="text-xs text-red-600 mt-1">{seatErrors[event.id]}</div>
                            )}
                          </td>
                          <td className="px-4 py-2 align-top">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendAnnouncement(event.id)}
                              disabled={sendingAnnouncement}
                            >
                              {sendingAnnouncement ? "Sending..." : "Send Announcement"}
                            </Button>
                          </td>
                        </tr>
                        
                        {/* Reservations for this event */}
                        {eventReservations.length > 0 && (
                          <tr>
                            <td colSpan={6} className="bg-gray-50 px-4 py-2">
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
                                    {eventReservations.map(reservation => (
                                      <tr key={reservation.id}>
                                        <td className="px-2 py-1">{reservation.visitor_name}</td>
                                        <td className="px-2 py-1">{reservation.visitor_email}</td>
                                        <td className="px-2 py-1">{reservation.phone || "—"}</td>
                                        <td className="px-2 py-1">{reservation.seats}</td>
                                        <td className="px-2 py-1 text-xs text-gray-500">
                                          {new Date(reservation.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1">
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => deleteReservation(reservation.id)}
                                          >
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
      </div>
    </AuthenticatedLayout>
  );
}
