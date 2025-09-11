import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminEventsManagement from "@/polymet/components/admin-events-management";
import SMSSender from "@/polymet/components/sms-sender";
import { buildDefaultAnnouncement } from "../../lib/emailTemplates";

export default function AdminPage() {
  const { user } = useAuth();
  const [community, setCommunity] = React.useState<any[]>([]); // Completed members (user_profiles)
  const [initialSignups, setInitialSignups] = React.useState<any[]>([]); // Initial signups (community table)
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
  const [sendingMagicLinks, setSendingMagicLinks] = React.useState(false);
  const [magicLinksResult, setMagicLinksResult] = React.useState<string>("");
  const [emailClickedMap, setEmailClickedMap] = React.useState<Record<string, boolean>>({});
  const [emailPlayCountMap, setEmailPlayCountMap] = React.useState<Record<string, number>>({});

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

  // (Deprecated) handleSendMagicLinks replaced by handlePreviewMagicLinkToMe and handleSendMagicLinksFromCompose

  // Bulk email selection + compose state
  const [selectedEmails, setSelectedEmails] = React.useState<Set<string>>(new Set());
  const [composeSubject, setComposeSubject] = React.useState("");
  const [composeBody, setComposeBody] = React.useState("");
  const [sendingCustom, setSendingCustom] = React.useState(false);
  const [composeIsHtml, setComposeIsHtml] = React.useState(false);

  // Friend invitation state
  const [friendName, setFriendName] = React.useState("");
  const [friendEmail, setFriendEmail] = React.useState("");
  const [friendMagicLink, setFriendMagicLink] = React.useState("");
  const [friendLinkLoading, setFriendLinkLoading] = React.useState(false);
  const [deletingCommunity, setDeletingCommunity] = React.useState<Set<string>>(new Set());
  const [invitations, setInvitations] = React.useState<any[]>([]);
  const [csvData, setCsvData] = React.useState<any[]>([]);
  const [csvFileName, setCsvFileName] = React.useState<string>("");
  const [showCsvPreview, setShowCsvPreview] = React.useState(false);

  function normalizeEmail(e?: string | null) {
    return (e || "").trim().toLowerCase();
  }

  function toggleSelect(email?: string | null) {
    const norm = normalizeEmail(email);
    if (!norm) return;
    setSelectedEmails(prev => {
      const next = new Set(prev);
      if (next.has(norm)) next.delete(norm); else next.add(norm);
      return next;
    });
  }

  function isSelected(email?: string | null) {
    const norm = normalizeEmail(email);
    return norm ? selectedEmails.has(norm) : false;
  }

  async function deleteCommunityMember(email: string, name?: string) {
    const confirmMessage = name 
      ? `Are you sure you want to delete "${name}" (${email}) from the community?`
      : `Are you sure you want to delete ${email} from the community?`;
      
    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingCommunity(prev => new Set(prev).add(email));

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('email', email);

      if (error) {
        console.error('Error deleting community member:', error);
        alert('Failed to delete community member. Please try again.');
        return;
      }

      // Remove from local state
      setCommunity(prev => prev.filter(c => c.email !== email));
      
      // Remove from selected emails if it was selected
      setSelectedEmails(prev => {
        const next = new Set(prev);
        next.delete(normalizeEmail(email));
        return next;
      });

      console.log(`Successfully deleted ${email} from community`);
    } catch (err) {
      console.error('Error deleting community member:', err);
      alert('Failed to delete community member. Please try again.');
    } finally {
      setDeletingCommunity(prev => {
        const next = new Set(prev);
        next.delete(email);
        return next;
      });
    }
  }

  function clearSelected() {
    setSelectedEmails(new Set());
  }

  // CSV Upload and Processing Functions
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('CSV file appears to be empty or invalid');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
      const firstNameIndex = headers.findIndex(h => h.toLowerCase().includes('first'));
      const lastNameIndex = headers.findIndex(h => h.toLowerCase().includes('last'));
      const cityIndex = headers.findIndex(h => h.toLowerCase().includes('city'));
      const stateIndex = headers.findIndex(h => h.toLowerCase().includes('state'));
      const eventNameIndex = headers.findIndex(h => h.toLowerCase().includes('event name'));
      const eventDateIndex = headers.findIndex(h => h.toLowerCase().includes('event start date'));

      if (emailIndex === -1) {
        alert('CSV file must contain an email column');
        return;
      }

      const parsedData = lines.slice(1)
        .filter(line => line.trim() && !line.startsWith('TOTALS'))
        .map(line => {
          const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
          return {
            email: cols[emailIndex]?.toLowerCase().trim(),
            firstName: cols[firstNameIndex] || '',
            lastName: cols[lastNameIndex] || '',
            city: cols[cityIndex] || '',
            state: cols[stateIndex] || '',
            eventName: cols[eventNameIndex] || '',
            eventDate: cols[eventDateIndex] || '',
            fullName: `${cols[firstNameIndex] || ''} ${cols[lastNameIndex] || ''}`.trim()
          };
        })
        .filter(row => row.email && row.email.includes('@'));

      // Group by event for segmentation
      const eventGroups = parsedData.reduce((groups, attendee) => {
        const event = attendee.eventName || 'Unknown Event';
        if (!groups[event]) groups[event] = [];
        groups[event].push(attendee);
        return groups;
      }, {} as Record<string, typeof parsedData>);

      setCsvData(parsedData);
      setShowCsvPreview(true);
      
      console.log('CSV processed:', {
        totalAttendees: parsedData.length,
        eventGroups: Object.keys(eventGroups).map(event => ({
          event,
          count: eventGroups[event].length
        }))
      });
    };
    reader.readAsText(file);
  };

  const selectAllFromCsv = () => {
    const emails = csvData.map(row => row.email).filter(Boolean);
    setSelectedEmails(new Set(emails));
  };

  const selectEventGroup = (eventName: string) => {
    const eventAttendees = csvData.filter(row => row.eventName === eventName);
    const emails = eventAttendees.map(row => row.email).filter(Boolean);
    setSelectedEmails(prev => {
      const newSet = new Set(prev);
      emails.forEach(email => newSet.add(email));
      return newSet;
    });
  };

  const getEventGroups = () => {
    return csvData.reduce((groups, attendee) => {
      const event = attendee.eventName || 'Unknown Event';
      if (!groups[event]) groups[event] = [];
      groups[event].push(attendee);
      return groups;
    }, {} as Record<string, typeof csvData>);
  };

  // Helper: load click/play stats via secure API (service role)
  async function loadStatsForCommunity(communityList: any[]) {
    try {
      const emails = Array.from(
        new Set(
          (communityList || [])
            .map((c: any) => (c.email || '').trim().toLowerCase())
            .filter((e: string) => !!e)
        )
      );
      if (emails.length === 0) {
        setEmailClickedMap({});
        setEmailPlayCountMap({});
        return;
      }
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const resp = await fetch('/api/statsCommunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ emails })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to load stats');
      setEmailClickedMap(data.clickedMap || {});
      setEmailPlayCountMap(data.playCountMap || {});
    } catch (aggErr) {
      console.warn('Aggregation fetch error', aggErr);
      setEmailClickedMap({});
      setEmailPlayCountMap({});
    }
  }

  async function generateFriendLink() {
    if (!friendName.trim() || !friendEmail.trim()) return;
    
    setFriendLinkLoading(true);
    try {
      const response = await fetch('/api/sendAutoMagicLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: friendName.trim(),
          email: friendEmail.trim(),
          campaign: 'friend_invitation'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate friend link');

      setFriendMagicLink(data.magicLink);
      alert(`Friend link generated and email sent to ${friendEmail}!`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setFriendLinkLoading(false);
    }
  }

  function applyPreset(preset: "announcement" | "reminder" | "thankyou" | "ftcommunity" | "details" | "magiclinks" | "ml1" | "ml2" | "ml3") {
    if (preset === "announcement") {
      setComposeSubject("Early Bird ends tomorrow — Sunset piano at Kate Sessions, Fri 6:30");
      setComposeBody(
        "Hi there,\n\nWe’re gathering this Friday at 6:30 PM at Kate Sessions Park for a grounding, restorative piano concert at sunset. I’ll guide a gentle narrative between songs that ties the set together. Early Bird ends tomorrow—reserve your spot if you’re planning to come.\n\nWith gratitude,\nVitiá"
      );
    } else if (preset === "reminder") {
      setComposeSubject("Friendly reminder — Mind Harmony at Kate Sessions");
      setComposeBody("Quick reminder about our upcoming sunset piano experience at Kate Sessions Park. Would love to see you there!\n\nWith gratitude,\nVitiá");
    } else if (preset === "ftcommunity") {
      setComposeSubject("🌅 Special Invite – MindHarmony Sunset Show, Friday Aug 29");
      setComposeBody(
        "Hello friend,\n\n" +
        "Welcome to the MindHarmony community—it’s wonderful to have you here.\n\n" +
        "I’d like to extend a special invitation to join us for the next MindHarmony Sunset Sound Journey on Friday, August 29th at 6:30pm at Kate Sessions Park. This evening will be an intimate gathering of live piano, meditation, and nature as the sun sets over the city.\n\n" +
        "As part of this special invitation, you can reserve your spot here: https://www.mindharmony.life/reserve\n\n" +
        "🎟 Note: Tickets for the public are available on Eventbrite, but this link is just for you—there’s no required ticket price. If you’d like to support MindHarmony, you’ll see an option to make a donation when reserving, but it’s not necessary.\n\n" +
        "Bring a blanket, invite a friend, and come experience an evening of music and stillness under the open sky.\n\n" +
        "With gratitude,\nVitiá Kulish and the Mind Harmony team."
      );
    } else if (preset === "details") {
      setComposeSubject("Your Mind Harmony reservation — Friday’s details inside");
      setComposeBody(
        "Mind Harmony presents - Vitià Kulish, Piano Meditation Experience\n" +
        "Dear friend,\n\n" +
        "Step into an evening where music becomes a doorway to something deeper. As Vitià’s fingers glide across the keys, each note drifts like sunlight through open windows, carrying you to faraway landscapes of memory, joy, and quiet wonder. The air feels lighter, the world softer, and for a while, time bends to the rhythm of the piano.\n\n" +
        "This is more than a concert—it’s a journey. Gentle melodies invite you to let go of what you’ve been carrying, while shimmering harmonies open space for new dreams to arrive. You may find yourself smiling without reason, breathing more deeply, or feeling a warmth you can’t quite name.\n\n" +
        "As the final notes fade, the floor opens for those who feel moved to share their reflections—brief stories, feelings, or moments the music stirred within them—adding their voices to the night’s magic.\n\n" +
        "What to bring:\n" +
        "A journal (for those post-music sparks of insight)\n" +
        "A cozy layer or something soft\n" +
        "Something to sit/lie on\n" +
        "A curious, open heart\n" +
        "Snacks or a picnic\n" +
        "Mind Harmony presents - Vitià Kulish, Piano Meditation Experience.\n" +
        "Friday, August 29, 2025 • 6:30 PM – 8:00 PM (PDT)\n" +
        "Kate Sessions Memorial Park\n" +
        "5115 Soledad Road\n" +
        "San Diego, CA 92109"
      );
    } else if (preset === "magiclinks") {
      setComposeSubject("Your Mind Harmony access");
      setComposeBody(
        "Hi,\n\n" +
        "Thank you for joining us! As a gift, your access to 4 piano tracks is unlocked.\n\n" +
        "With gratitude,\nVitiá"
      );
    } else if (preset === "ml1") {
      setComposeIsHtml(true);
      setComposeSubject("Thank you — your Mind Harmony gift inside");
      setComposeBody(
        `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#111">`
        + `<p>Dear [First Name],</p>`
        + `<p>I want to thank you sincerely for joining the Mind Harmony community and for sharing in our recent concert. Every note I play is meant to create space for peace, reflection, and connection—and it’s your presence that turns music into a true experience.</p>`
        + `<p>Mind Harmony is a labor of love, and it exists because of the support of people like you. If you feel moved, I invite you to consider making a donation. Your contribution directly helps us cover essential costs (like instruments, sound equipment, and event space) and allows us to continue offering these experiences to the community.</p>`
        + `<p style="margin:20px 0"><a href="https://venmo.com/u/mindharmony" style="display:inline-block;background:#1E3A5F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Donate Here</a></p>`
        + `<p>Whether or not you’re able to give, please know that your presence and energy are already a gift. I look forward to seeing you at future concerts and continuing this journey together.</p>`
        + `<p>With gratitude,<br/>Vitià Kulish<br/>Mind Harmony</p>`
        + `<p><strong>P.S.</strong> As a special thank‑you, I’ve included a gift for you: access to 4 unreleased songs from my upcoming album. Enjoy them:</p>`
        + `<p style="margin:16px 0"><a href="{{link}}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Sign in with Magic Link</a></p>`
        + `<p style="font-size:12px;color:#555">or copy and paste into browser:<br/>{{link}}</p>`
        + `</div>`
      );
    } else if (preset === "ml2") {
      setComposeIsHtml(true);
      setComposeSubject("Your Mind Harmony gift — access inside");
      setComposeBody(
        `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#111">`
        + `<p>Dear [First Name],</p>`
        + `<p>Thank you for being part of the Mind Harmony community and for sharing in our recent concerts. Your presence helps turn music into a true experience of peace, reflection, and connection.</p>`
        + `<p>As a special thank‑you, here is a gift for you — access to 4 unreleased songs from Vitià's upcoming album, plus an invitation to become a Mind Harmony member with exclusive benefits.</p>`
        + `<p><strong>Your gift includes:</strong></p>`
        + `<ul style="margin:8px 0;padding-left:20px">`
        + `<li>4 unreleased piano meditation tracks</li>`
        + `<li>Mind Harmony membership with early access to events</li>`
        + `<li>Exclusive community updates and offers</li>`
        + `</ul>`
        + `<p style="margin:16px 0"><a href="{{link}}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:500">Claim Your Gift & Join</a></p>`
        + `<p style="font-size:12px;color:#555">or copy and paste into browser:<br/>{{link}}</p>`
        + `<p style="font-size:12px;color:#777;margin-top:16px">This invitation expires in 30 days. We respect your privacy and will never share your information.</p>`
        + `<p>With gratitude,<br/>Vitià Kulish<br/>Mind Harmony</p>`
        + `</div>`
      );
    } else if (preset === "ml3") {
      setComposeIsHtml(true);
      setComposeSubject("Enhanced Mind Harmony gift — easier access inside");
      setComposeBody(
        `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#111">`
        + `<p>Dear [First Name],</p>`
        + `<p>We've enhanced your Mind Harmony gift! If you received our previous email, this is an improved experience with easier access to your exclusive content.</p>`
        + `<p>Your gift includes access to 4 unreleased piano meditation tracks from my upcoming album, plus exclusive Mind Harmony membership benefits.</p>`
        + `<p><strong>What's enhanced:</strong></p>`
        + `<ul style="margin:8px 0;padding-left:20px">`
        + `<li>Streamlined access process</li>`
        + `<li>Enhanced member portal experience</li>`
        + `<li>Improved music player with continuous playback</li>`
        + `<li>Early access to future events and content</li>`
        + `</ul>`
        + `<p style="margin:16px 0"><a href="{{link}}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:500">Access Your Enhanced Gift</a></p>`
        + `<p style="font-size:12px;color:#555">or copy and paste into browser:<br/>{{link}}</p>`
        + `<p style="font-size:12px;color:#777;margin-top:16px">This invitation expires in 30 days. We respect your privacy and will never share your information.</p>`
        + `<p>With gratitude,<br/>Vitià Kulish<br/>Mind Harmony</p>`
        + `</div>`
      );
    } else {
      setComposeSubject("Thank you from Mind Harmony");
      setComposeBody("Thank you for being part of Mind Harmony. Your presence and support mean the world. Hope to see you again soon!\n\nWith gratitude,\nVitiá");
    }
  }

  function buildMagicHtmlFromCompose(): { subject: string; html: string } | null {
    const subject = (composeSubject || "Your Mind Harmony access").trim();
    let body = (composeBody || "").trim();
    if (!body) {
      alert("Please write a message (it can include {{link}} where the sign-in link should go).");
      return null;
    }
    // Do not force-insert {{link}} text; button + fallback will be added below in text mode
    let html: string;
    if (composeIsHtml) {
      html = body;
    } else {
      const escaped = body.replace(/</g, "&lt;");
      html = `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;white-space:pre-wrap">${escaped}</div>
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;margin-top:12px">
          <a href="{{link}}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Sign in with Magic Link</a>
          <div style="font-size:12px;color:#666;margin-top:8px">If the button doesn't work, copy and paste this link: <span style="word-break:break-all">{{link}}</span></div>
        </div>
      `;
    }
    return { subject, html };
  }

  function insertMagicLinkButton() {
    setComposeIsHtml(true);
    setComposeBody((prev) => {
      const base = (prev || '').trim();
      const snippet = `\n\n<a href="{{link}}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Sign in with Magic Link</a>\n<div style="font-size:12px;color:#666;margin-top:8px">If the button doesn't work, copy and paste this link: <span style="word-break:break-all">{{link}}</span></div>`;
      return base ? base + snippet : `Hi,\n\nThank you for joining us!\n\n${snippet}\n\nWith gratitude,\nVitiá`;
    });
  }

  async function handlePreviewMagicLinkToMe() {
    if (!isAdmin) return;
    if (!user?.email) { alert("You're not logged in."); return; }
    const payload = buildMagicHtmlFromCompose();
    if (!payload) return;
    setSendingMagicLinks(true);
    setMagicLinksResult("");
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const resp = await fetch('/api/sendMagicLinksToCommunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          campaign: 'magiclinks_preview',
          emails: [user.email],
          subject: payload.subject,
          html: payload.html
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed');
      setMagicLinksResult(`Preview sent to ${user.email}`);
      alert(`Preview sent to ${user.email}`);
    } catch (e: any) {
      setMagicLinksResult(`Error: ${e?.message || e}`);
      alert(`Failed to send preview: ${e?.message || e}`);
    } finally {
      setSendingMagicLinks(false);
    }
  }

  async function handleSendMagicLinksFromCompose() {
    if (!isAdmin) return;
    const to = Array.from(selectedEmails);
    if (to.length === 0 && !confirm('No recipients selected. Send to ALL community?')) return;
    const payload = buildMagicHtmlFromCompose();
    if (!payload) return;
    setSendingMagicLinks(true);
    setMagicLinksResult("");
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const resp = await fetch('/api/sendMagicLinksToCommunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          campaign: composeSubject.toLowerCase().includes('gift') || composeBody.includes('unreleased songs') 
            ? 'past_attendee_invitation' 
            : 'concert_followup',
          emails: to.length > 0 ? to : undefined,
          subject: payload.subject,
          html: payload.html
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed');
      setMagicLinksResult(`Sent: ${data.sent} emails`);
      alert(`Magic links sent to ${data.sent} recipient(s).`);
    } catch (e: any) {
      setMagicLinksResult(`Error: ${e?.message || e}`);
      alert(`Failed to send magic links: ${e?.message || e}`);
    } finally {
      setSendingMagicLinks(false);
    }
  }

  async function handleSendCustom() {
    const to = Array.from(selectedEmails);
    if (to.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }
    if (!composeSubject || !composeBody) {
      alert("Please enter a subject and a message.");
      return;
    }
    setSendingCustom(true);
    try {
      const html = composeIsHtml
        ? composeBody
        : `<div style=\"font-family:Arial,sans-serif;line-height:1.6;color:#111;white-space:pre-wrap\">${composeBody.replace(/</g, "&lt;")}</div>`;
      const resp = await fetch('/api/sendAnnouncement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: composeSubject, to, html })
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text);
      alert(`Sent to ${to.length} recipient(s).`);
    } catch (e: any) {
      alert(`Failed to send: ${e?.message || e}`);
    } finally {
      setSendingCustom(false);
    }
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
          .from("user_profiles")
          .select("first_name, last_name, email, phone, interests, created_at")
          .order("created_at", { ascending: false });
        
        // Fetch initial signups (community table - people who haven't completed the flow)
        const { data: initialSignupsData, error: initialSignupsError } = await supabase
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
        
        // Fetch invitation summary
        const { data: invitationsData, error: invitationsError } = await supabase
          .from("invitation_summary")
          .select("*")
          .order("sent_at", { ascending: false });
        
        if (eventsError || reservationsError || communityError || initialSignupsError || waitlistError || newsletterError) {
          setError("Failed to fetch data from Supabase.");
        } else {
          setEvents(eventsData || []);
          setReservations(reservationsData || []);
          const communityList = communityData || [];
          setCommunity(communityList);
          setInitialSignups(initialSignupsData || []);
          setWaitlist(waitlistData || []);
          setNewsletter(newsletterData || []);
          setInvitations(invitationsData || []);
          await loadStatsForCommunity(communityList);
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

  // Send magic links to attendees of a specific event (ticket management)
  const handleSendMagicLinksForEvent = async (eventId: number) => {
    if (!isAdmin) return;
    if (!confirm('Send Magic Links to all attendees of this event?')) return;
    setSendingMagicLinks(true);
    setMagicLinksResult("");
    try {
      // Fetch recipient emails from reservations
      const { data: recipients, error: recErr } = await supabase
        .from('reservations')
        .select('visitor_email')
        .eq('event_id', eventId);
      if (recErr) throw new Error(recErr.message);
      const to = Array.from(new Set((recipients || []).map((r: any) => r.visitor_email).filter(Boolean)));
      if (to.length === 0) { alert('No recipients for this event.'); return; }

      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const subject = 'Your Mind Harmony gift — access inside';
      const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111">
          <p>Dear [First Name],</p>
          <p>Thank you for being part of the Mind Harmony community and for sharing in our recent concert. Your presence helps turn music into a true experience of peace, reflection, and connection.</p>
          <p>As a special thank‑you, here is a gift for you — access to 4 unreleased songs from my upcoming album. I hope they bring you calm and joy.</p>
          <p style="margin:16px 0"><a href="{{link}}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Sign in with Magic Link</a></p>
          <p style="font-size:12px;color:#555">or copy and paste into browser:<br/>{{link}}</p>
          <p>With gratitude,<br/>Vitià Kulish<br/>Mind Harmony</p>
        </div>`;

      const resp = await fetch('/api/sendMagicLinksToCommunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ campaign: `event_attendees_${eventId}`, emails: to, subject, html })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed');
      setMagicLinksResult(`Sent: ${data.sent} emails`);
      alert(`Magic links sent to ${data.sent} attendee(s).`);
    } catch (e: any) {
      setMagicLinksResult(`Error: ${e?.message || e}`);
      alert(`Failed to send magic links: ${e?.message || e}`);
    } finally {
      setSendingMagicLinks(false);
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
      
      {/* Navigation Section */}
      <section className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/admin/eventreservations" 
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <h3 className="font-semibold text-blue-900 mb-2">Event Reservations</h3>
              <p className="text-sm text-blue-700">View and manage event reservations</p>
            </a>
            <a 
              href="/admin/eventmanagement" 
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <h3 className="font-semibold text-green-900 mb-2">Event Management</h3>
              <p className="text-sm text-green-700">Create and edit events for main and VIP pages</p>
            </a>
            <div className="block p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">Community Management</h3>
              <p className="text-sm text-gray-600">View and manage community members (current page)</p>
            </div>
            <div className="block p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">SMS & Communications</h3>
              <p className="text-sm text-gray-600">Send messages and announcements (current page)</p>
            </div>
          </div>
        </div>
      </section>
      
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
                              <Button size="sm" className="ml-2" onClick={() => handleSendMagicLinksForEvent(event.id)} disabled={sendingMagicLinks}>
                                {sendingMagicLinks ? 'Sending…' : 'Send Magic Links to Attendees'}
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
                                        <th className="px-2 py-1 text-left">Select</th>
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
                                          <td className="px-2 py-1">
                                            <input type="checkbox" checked={isSelected(res.visitor_email)} onChange={() => toggleSelect(res.visitor_email)} />
                                          </td>
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

          {/* Anonymous Analytics Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Anonymous User Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Friend-Gift Page</h3>
                <p className="text-2xl font-bold text-blue-700">—</p>
                <p className="text-sm text-blue-600">Unique visitors today</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Anonymous Plays</h3>
                <p className="text-2xl font-bold text-green-700">—</p>
                <p className="text-sm text-green-600">Song plays (non-members)</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Top Track</h3>
                <p className="text-lg font-bold text-purple-700">—</p>
                <p className="text-sm text-purple-600">Most played by visitors</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              📊 Analytics for non-signed-up users will appear here once the tracking system is fully implemented.
              This includes friend page visitors and their music listening behavior.
            </p>
          </section>

          {/* SMS Messaging Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">📱 SMS Messaging</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SMSSender onSMSSent={() => {}} />
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">SMS Usage Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>General Messages:</strong> Simple text messages to individuals</li>
                  <li>• <strong>Event Reminders:</strong> Perfect for day-before notifications</li>
                  <li>• <strong>Phone Format:</strong> Accepts +1234567890 or (234) 567-8890</li>
                  <li>• <strong>Character Limit:</strong> Keep messages under 1600 characters</li>
                  <li>• <strong>Best Times:</strong> 10am-8pm local time for recipients</li>
                  <li>• <strong>Compliance:</strong> Only text people who opted in</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Existing dashboard sections */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Community Signups (Completed Members)</h2>
              <Button variant="outline" size="sm" onClick={() => {
                // Re-run initial fetch
                (async () => {
                  setLoading(true);
                  setError("");
                  try {
                    // Fetch completed members (user_profiles)
                    const { data: communityData } = await supabase
                      .from("user_profiles")
                      .select("first_name, last_name, email, phone, interests, created_at")
                      .order("created_at", { ascending: false });
                    
                    // Fetch initial signups (community table)
                    const { data: initialSignupsData } = await supabase
                      .from("community")
                      .select("name, email, phone, interest, created_at")
                      .order("created_at", { ascending: false });
                    
                    const communityList = communityData || [];
                    setCommunity(communityList);
                    setInitialSignups(initialSignupsData || []);
                    await loadStatsForCommunity(communityList);
                  } finally { setLoading(false); }
                })();
              }}>Refresh</Button>
            </div>
            {/* Bulk email compose */}
            {/* CSV Upload Widget */}
            <div className="mb-4 p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-3">📊 Import Attendees from CSV</h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {csvFileName && (
                    <p className="text-xs text-gray-600 mt-1">Loaded: {csvFileName}</p>
                  )}
                </div>
                
                {showCsvPreview && csvData.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Found {csvData.length} attendees</span>
                      <Button size="sm" onClick={selectAllFromCsv}>Select All ({csvData.length})</Button>
                    </div>
                    
                    {/* Event Segmentation */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Select by Event:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(getEventGroups()).map(([eventName, attendees]) => (
                          <Button
                            key={eventName}
                            size="sm"
                            variant="outline"
                            onClick={() => selectEventGroup(eventName)}
                            className="text-xs"
                          >
                            {eventName.includes('February') ? 'Feb' : 
                             eventName.includes('March') ? 'Mar' :
                             eventName.includes('April') ? 'Apr' :
                             eventName.includes('July') ? 'Jul' :
                             eventName.includes('August') ? 'Aug' :
                             eventName.split(' ').slice(0, 2).join(' ')} ({(attendees as any[]).length})
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Location Segmentation */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Select by Location:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(csvData.map(a => a.city).filter(Boolean))).slice(0, 6).map(city => {
                          const count = csvData.filter(a => a.city === city).length;
                          return (
                            <Button
                              key={city}
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const cityEmails = csvData.filter(a => a.city === city).map(a => a.email);
                                setSelectedEmails(prev => {
                                  const newSet = new Set(prev);
                                  cityEmails.forEach(email => newSet.add(email));
                                  return newSet;
                                });
                              }}
                              className="text-xs"
                            >
                              {city} ({count})
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="mb-2">
                <Input
                  placeholder="Subject"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => applyPreset('announcement')}>Use Announcement</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('reminder')}>Reminder</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('thankyou')}>Thank You</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('ftcommunity')}>FT Community</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('details')}>Details</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('magiclinks')}>Magic Links</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('ml1')}>Magic Links: ML1</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('ml2')}>Magic Links: ML2</Button>
                  <Button variant="outline" size="sm" onClick={() => applyPreset('ml3')}>Magic Links: ML3</Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Selected: {Array.from(selectedEmails).length}</span>
                  <Button variant="outline" size="sm" onClick={clearSelected}>Clear</Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={composeIsHtml} onChange={(e) => setComposeIsHtml(e.target.checked)} />
                  <span>Send as HTML (supports links/buttons)</span>
                </label>
                <Button variant="outline" size="sm" onClick={insertMagicLinkButton}>Insert Magic Link Button</Button>
              </div>
              <div className="mt-3">
                <Textarea
                  placeholder="Write your message..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Button onClick={handleSendCustom} disabled={sendingCustom}>
                  {sendingCustom ? 'Sending...' : 'Send to Selected'}
                </Button>
                <Button variant="secondary" onClick={handlePreviewMagicLinkToMe} disabled={sendingMagicLinks}>
                  {sendingMagicLinks ? 'Previewing…' : 'Preview Magic Link (to me)'}
                </Button>
                <Button variant="secondary" onClick={handleSendMagicLinksFromCompose} disabled={sendingMagicLinks}>
                  {sendingMagicLinks ? 'Sending…' : 'Send Magic Links (using this message)'}
                </Button>
                {magicLinksResult && (
                  <span className="text-sm text-gray-600">{magicLinksResult}</span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Select</th>
                    <th className="px-4 py-2 border-b text-left">First Name</th>
                    <th className="px-4 py-2 border-b text-left">Last Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Phone</th>
                    <th className="px-4 py-2 border-b text-left">Interest</th>
                    <th className="px-4 py-2 border-b text-left">Signed Up</th>
                    <th className="px-4 py-2 border-b text-left">Clicked Link</th>
                    <th className="px-4 py-2 border-b text-left">Plays</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {community.length === 0 ? (
                    <tr><td colSpan={10} className="px-4 py-2 text-center text-gray-500">No signups yet.</td></tr>
                  ) : (
                    community.map((c, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2"><input type="checkbox" checked={isSelected(c.email)} onChange={() => toggleSelect(c.email)} /></td>
                        <td className="px-4 py-2">{c.first_name || '—'}</td>
                        <td className="px-4 py-2">{c.last_name || '—'}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.phone || '—'}</td>
                        <td className="px-4 py-2">{Array.isArray(c.interests) ? c.interests.join(', ') : (c.interests || '—')}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{c.created_at ? new Date(c.created_at).toLocaleString() : ""}</td>
                        <td className="px-4 py-2">{emailClickedMap[(c.email || '').trim().toLowerCase()] ? 'Yes' : '—'}</td>
                        <td className="px-4 py-2">{emailPlayCountMap[(c.email || '').trim().toLowerCase()] ?? 0}</td>
                        <td className="px-4 py-2">
                          <Button
                            onClick={() => deleteCommunityMember(c.email, `${c.first_name} ${c.last_name}`)}
                            disabled={deletingCommunity.has(c.email)}
                            variant="destructive"
                            size="sm"
                            className="text-xs px-2 py-1"
                          >
                            {deletingCommunity.has(c.email) ? 'Deleting...' : 'Delete'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Initial Signups Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Initial Signups (Haven't Completed Flow)</h2>
            <p className="text-sm text-gray-600 mb-4">
              These people filled out the initial form but haven't clicked the magic link or completed their profile yet.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Phone</th>
                    <th className="px-4 py-2 border-b text-left">Interest</th>
                    <th className="px-4 py-2 border-b text-left">Signed Up</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {initialSignups.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-2 text-center text-gray-500">No initial signups.</td></tr>
                  ) : (
                    initialSignups.map((signup, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2">{signup.name || '—'}</td>
                        <td className="px-4 py-2">{signup.email}</td>
                        <td className="px-4 py-2">{signup.phone || '—'}</td>
                        <td className="px-4 py-2">{signup.interest || '—'}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{signup.created_at ? new Date(signup.created_at).toLocaleString() : ""}</td>
                        <td className="px-4 py-2">
                          <Button
                            onClick={async () => {
                              try {
                                const { error } = await supabase
                                  .from('community')
                                  .delete()
                                  .eq('email', signup.email);
                                if (error) throw error;
                                setInitialSignups(prev => prev.filter(s => s.email !== signup.email));
                              } catch (error) {
                                alert('Failed to delete signup');
                              }
                            }}
                            variant="destructive"
                            size="sm"
                            className="text-xs px-2 py-1"
                          >
                            Delete
                          </Button>
                        </td>
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

          {/* Friend Magic Link Generator */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Friend Invitation Generator</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-3">
                Generate magic links for personal friend invitations on social media (Instagram, Facebook, etc.)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Friend's Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Sarah"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Friend's Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="sarah@example.com"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={generateFriendLink}
                  disabled={!friendName.trim() || !friendEmail.trim() || friendLinkLoading}
                >
                  {friendLinkLoading ? 'Generating...' : 'Generate Friend Link'}
                </Button>
                {friendMagicLink && (
                  <Button 
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(friendMagicLink)}
                  >
                    Copy Link
                  </Button>
                )}
              </div>
              {friendMagicLink && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-800 mb-2">✅ Friend link generated!</p>
                  <p className="text-xs text-green-700 mb-2">Use this link in your Instagram/Facebook message:</p>
                  <code className="text-xs bg-white p-2 rounded border block break-all">{friendMagicLink}</code>
                  <div className="mt-3 p-2 bg-white border rounded">
                    <p className="text-sm font-medium mb-1">📱 Copy this message for social media:</p>
                    <div className="text-sm text-gray-700 italic">
                      "Hey {friendName}! I have a gift for you - access to 4 unreleased piano meditation tracks from my upcoming album. Just click this link to claim your free access: {friendMagicLink} Takes 30 seconds to set up. Hope you enjoy them! 🙏"
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Invitations Status */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Invitation Status</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Name</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Sent</th>
                    <th className="px-4 py-2 border-b text-left">Accepted</th>
                    <th className="px-4 py-2 border-b text-left">Phone</th>
                    <th className="px-4 py-2 border-b text-left">Interests</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-2 text-center text-gray-500">No invitations sent yet.</td></tr>
                  ) : (
                    invitations.map((inv, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2 text-sm">{inv.email}</td>
                        <td className="px-4 py-2 text-sm">{inv.first_name} {inv.last_name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            inv.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            inv.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {inv.sent_at ? new Date(inv.sent_at).toLocaleDateString() : ''}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {inv.accepted_at ? new Date(inv.accepted_at).toLocaleDateString() : ''}
                        </td>
                        <td className="px-4 py-2 text-sm">{inv.phone || ''}</td>
                        <td className="px-4 py-2 text-sm">
                          {inv.interests ? inv.interests.slice(0, 2).join(', ') + (inv.interests.length > 2 ? '...' : '') : ''}
                        </td>
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