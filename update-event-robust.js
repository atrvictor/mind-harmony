/**
 * Robust Event 11 update with multiple approaches
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const envContent = fs.readFileSync('supa.env', 'utf8');
const envLines = envContent.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = trimmed.split('=')[1];
  } else if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseKey = trimmed.split('=')[1];
  }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEventRobust() {
  try {
    console.log('Attempting robust update of Event 11...');
    
    // Try multiple update approaches
    const updateData = {
      image: 'MH Aeriel KS.jpg',
      button: 'Get Tickets', 
      get_tickets_link: 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator',
      time: '5:30 PM',
      updated_at: new Date().toISOString()
    };

    console.log('Update data:', updateData);

    // Approach 1: Simple update
    console.log('\nApproach 1: Simple update...');
    const { data: result1, error: error1 } = await supabase
      .from('events_management')
      .update(updateData)
      .eq('id', 11);
    
    if (error1) {
      console.error('Approach 1 failed:', error1);
    } else {
      console.log('✅ Approach 1 successful');
    }

    // Approach 2: Update individual fields
    console.log('\nApproach 2: Individual field updates...');
    
    const fields = [
      { field: 'image', value: 'MH Aeriel KS.jpg' },
      { field: 'button', value: 'Get Tickets' },
      { field: 'get_tickets_link', value: 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator' },
      { field: 'time', value: '5:30 PM' }
    ];

    for (const { field, value } of fields) {
      const { error } = await supabase
        .from('events_management')
        .update({ [field]: value })
        .eq('id', 11);
      
      if (error) {
        console.error(`❌ Failed to update ${field}:`, error);
      } else {
        console.log(`✅ Updated ${field}: ${value}`);
      }
      
      // Small delay between updates
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Approach 3: Using upsert
    console.log('\nApproach 3: Using upsert...');
    const { data: result3, error: error3 } = await supabase
      .from('events_management')
      .upsert({ 
        id: 11,
        ...updateData
      });
    
    if (error3) {
      console.error('Approach 3 failed:', error3);
    } else {
      console.log('✅ Approach 3 successful');
    }

    // Final verification
    console.log('\n📋 Final verification...');
    const { data: finalCheck, error: checkError } = await supabase
      .from('events_management')
      .select('id, title, image, button, get_tickets_link, time')
      .eq('id', 11)
      .single();
    
    if (checkError) {
      console.error('Error during verification:', checkError);
    } else {
      console.log('\n🎉 Current Event 11 state:');
      console.log(`ID: ${finalCheck.id}`);
      console.log(`Title: ${finalCheck.title}`);
      console.log(`Time: ${finalCheck.time}`);
      console.log(`Image: ${finalCheck.image}`);
      console.log(`Button: ${finalCheck.button}`);
      console.log(`Ticket Link: ${finalCheck.get_tickets_link ? finalCheck.get_tickets_link.substring(0, 80) + '...' : 'None'}`);
      
      // Check if our updates worked
      const imageOk = finalCheck.image === 'MH Aeriel KS.jpg';
      const buttonOk = finalCheck.button === 'Get Tickets';
      const timeOk = finalCheck.time === '5:30 PM';
      const linkOk = finalCheck.get_tickets_link && finalCheck.get_tickets_link.includes('eventbrite.com');
      
      console.log('\n✅ Update Status:');
      console.log(`Image fixed: ${imageOk ? '✅' : '❌'}`);
      console.log(`Button fixed: ${buttonOk ? '✅' : '❌'}`);
      console.log(`Time updated: ${timeOk ? '✅' : '❌'}`);
      console.log(`Link updated: ${linkOk ? '✅' : '❌'}`);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateEventRobust();
