const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: './supa.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getAug29Attendees() {
  console.log('🎹 Generating complete Aug 29th concert attendee list...\n');

  // 1. Process Eventbrite CSV
  console.log('📋 Processing Eventbrite attendees...');
  const csvPath = path.join(__dirname, 'imports/Attendees_1964080994993_20250829_193350_045.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  const eventbriteAttendees = [];
  const attendeeCounts = {};
  
  // Skip header and totals row
  for (let i = 1; i < lines.length - 2; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(',');
    const firstName = columns[2];
    const lastName = columns[3];
    const email = columns[4];
    const phone = columns[5];
    const city = columns[6];
    const state = columns[7];
    const ticketPrice = columns[19];
    
    if (firstName && lastName && email) {
      const fullName = `${firstName} ${lastName}`;
      const key = `${fullName}_${email}`;
      
      if (!attendeeCounts[key]) {
        attendeeCounts[key] = {
          name: fullName,
          email: email,
          phone: phone || '',
          city: city || '',
          state: state || '',
          ticketPrice: ticketPrice,
          tickets: 0
        };
      }
      attendeeCounts[key].tickets++;
    }
  }
  
  // Convert to array
  Object.values(attendeeCounts).forEach(attendee => {
    eventbriteAttendees.push(attendee);
  });
  
  console.log(`✅ Found ${eventbriteAttendees.length} unique Eventbrite attendees`);
  console.log(`📊 Total Eventbrite tickets: ${eventbriteAttendees.reduce((sum, a) => sum + a.tickets, 0)}\n`);

  // 2. Get reservations from database for Aug 29th
  console.log('🎫 Getting reservation system attendees...');
  
  // First find the Aug 29th event in the legacy events table
  const { data: legacyEvents, error: legacyError } = await supabase
    .from('events')
    .select('id, name, event_date')
    .order('event_date', { ascending: true });
    
  if (legacyError) {
    console.error('Error fetching legacy events:', legacyError);
    return;
  }
  
  console.log('Available events in reservation system:');
  legacyEvents.forEach(event => {
    console.log(`- Event ${event.id}: ${event.name} on ${event.event_date}`);
  });
  
  // Find Aug 29th event (looking for 2025-08-29)
  const aug29Event = legacyEvents.find(event => 
    event.event_date && event.event_date.includes('2025-08-29')
  );
  
  if (!aug29Event) {
    console.log('⚠️  No Aug 29th event found in reservation system');
  } else {
    console.log(`🎯 Found Aug 29th event: ${aug29Event.name} (ID: ${aug29Event.id})\n`);
    
    // Get reservations for this event
    const { data: reservations, error: resError } = await supabase
      .from('reservations')
      .select('visitor_name, visitor_email, phone, seats, donation, created_at')
      .eq('event_id', aug29Event.id)
      .order('created_at', { ascending: true });
      
    if (resError) {
      console.error('Error fetching reservations:', resError);
      return;
    }
    
    console.log(`✅ Found ${reservations.length} reservation system attendees`);
    console.log(`📊 Total reservation tickets: ${reservations.reduce((sum, r) => sum + (r.seats || 0), 0)}\n`);
    
    // 3. Create combined list
    const combinedList = [];
    
    // Add Eventbrite attendees
    eventbriteAttendees.forEach(attendee => {
      combinedList.push({
        source: 'Eventbrite',
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        tickets: attendee.tickets,
        city: attendee.city,
        state: attendee.state,
        ticketPrice: `$${attendee.ticketPrice}`,
        donation: '',
        reservedAt: ''
      });
    });
    
    // Add reservation system attendees
    reservations.forEach(reservation => {
      combinedList.push({
        source: 'Reservation System',
        name: reservation.visitor_name,
        email: reservation.visitor_email,
        phone: reservation.phone || '',
        tickets: reservation.seats || 0,
        city: '',
        state: '',
        ticketPrice: 'Free/Donation',
        donation: reservation.donation ? `$${reservation.donation}` : '',
        reservedAt: new Date(reservation.created_at).toLocaleDateString()
      });
    });
    
    // 4. Generate report
    const totalAttendees = combinedList.length;
    const totalTickets = combinedList.reduce((sum, attendee) => sum + attendee.tickets, 0);
    const eventbriteTickets = eventbriteAttendees.reduce((sum, a) => sum + a.tickets, 0);
    const reservationTickets = reservations.reduce((sum, r) => sum + (r.seats || 0), 0);
    
    console.log('🎼 COMPLETE AUG 29TH CONCERT ATTENDEE LIST');
    console.log('=' .repeat(60));
    console.log(`📅 Event: Mind Harmony Piano Meditation Experience`);
    console.log(`📍 Location: Kate Sessions Memorial Park`);
    console.log(`🕕 Time: 6:30 PM`);
    console.log('');
    console.log(`👥 Total Attendees: ${totalAttendees}`);
    console.log(`🎫 Total Tickets: ${totalTickets}`);
    console.log(`   • Eventbrite: ${eventbriteTickets} tickets`);
    console.log(`   • Reservations: ${reservationTickets} tickets`);
    console.log('');
    console.log('ATTENDEE LIST:');
    console.log('-'.repeat(60));
    
    combinedList.forEach((attendee, index) => {
      console.log(`${index + 1}. ${attendee.name}`);
      console.log(`   📧 ${attendee.email}`);
      if (attendee.phone) console.log(`   📱 ${attendee.phone}`);
      console.log(`   🎫 ${attendee.tickets} ticket${attendee.tickets !== 1 ? 's' : ''}`);
      console.log(`   📋 Source: ${attendee.source}`);
      if (attendee.city && attendee.state) {
        console.log(`   📍 ${attendee.city}, ${attendee.state}`);
      }
      if (attendee.ticketPrice && attendee.source === 'Eventbrite') {
        console.log(`   💰 ${attendee.ticketPrice} per ticket`);
      }
      if (attendee.donation) {
        console.log(`   💝 Donation: ${attendee.donation}`);
      }
      if (attendee.reservedAt) {
        console.log(`   📅 Reserved: ${attendee.reservedAt}`);
      }
      console.log('');
    });
    
    // 5. Save to CSV file
    const csvOutput = [
      'Name,Email,Phone,Tickets,Source,City,State,Price,Donation,Reserved Date'
    ];
    
    combinedList.forEach(attendee => {
      csvOutput.push([
        `"${attendee.name}"`,
        `"${attendee.email}"`,
        `"${attendee.phone}"`,
        attendee.tickets,
        `"${attendee.source}"`,
        `"${attendee.city}"`,
        `"${attendee.state}"`,
        `"${attendee.ticketPrice}"`,
        `"${attendee.donation}"`,
        `"${attendee.reservedAt}"`
      ].join(','));
    });
    
    const outputPath = path.join(__dirname, 'imports/Aug29_Complete_Attendee_List.csv');
    fs.writeFileSync(outputPath, csvOutput.join('\n'));
    
    console.log(`💾 Complete list saved to: ${outputPath}`);
    console.log('\n🎹 Ready for tonight\'s concert! 🎵');
  }
  
  // If no reservation system data, still show Eventbrite summary
  if (!aug29Event) {
    // Still show Eventbrite list even if no reservations
    console.log('🎼 AUG 29TH EVENTBRITE ATTENDEES');
    console.log('=' .repeat(50));
    
    eventbriteAttendees.forEach((attendee, index) => {
      console.log(`${index + 1}. ${attendee.name}`);
      console.log(`   📧 ${attendee.email}`);
      if (attendee.phone) console.log(`   📱 ${attendee.phone}`);
      console.log(`   🎫 ${attendee.tickets} ticket${attendee.tickets !== 1 ? 's' : ''}`);
      console.log(`   📍 ${attendee.city}, ${attendee.state}`);
      console.log(`   💰 $${attendee.ticketPrice} per ticket`);
      console.log('');
    });
    
    console.log(`👥 Total: ${eventbriteAttendees.length} attendees, ${eventbriteAttendees.reduce((sum, a) => sum + a.tickets, 0)} tickets`);
  }
}

getAug29Attendees().catch(console.error);
