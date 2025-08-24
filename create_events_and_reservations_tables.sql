-- Migration: Create events and reservations tables for seat reservation feature

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  event_date TIMESTAMP NOT NULL,
  max_seats INTEGER NOT NULL
);

-- Reservations table
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  seats INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
); 