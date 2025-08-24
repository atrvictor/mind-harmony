export function buildDefaultAnnouncement(
  eventName: string,
  eventDateIso?: string,
  venueLines?: string[]
): { subject: string; html: string } {
  const subject = `${eventName} — Announcement`;
  const dateText = eventDateIso ? new Date(eventDateIso).toLocaleString() : '';
  const venueText = (venueLines || []).filter(Boolean).join(' • ');
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">${eventName}</h2>
      ${dateText ? `<p style="margin: 0 0 8px;">${dateText}</p>` : ''}
      ${venueText ? `<p style="margin: 0 0 16px; color: #555;">${venueText}</p>` : ''}
      <p>We look forward to sharing this experience with you.</p>
    </div>
  `;
  return { subject, html };
}


