import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SMSSenderProps {
  onSMSSent?: () => void;
}

export default function SMSSender({ onSMSSent }: SMSSenderProps) {
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [message, setMessage] = useState('');
  const [campaign, setCampaign] = useState('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Predefined message templates
  const templates = {
    event_reminder: `Hi {name}! 🧘‍♀️

Reminder: Our piano meditation experience is tomorrow at Kate Sessions Park, 6:00 PM.

Looking forward to seeing you there!
- Mind Harmony`,
    general: `Hi {name}! 🎹

Hope you're doing well! Just wanted to reach out from Mind Harmony.

- Vitià`,
    custom: ''
  };

  const handleTemplateChange = (template: string) => {
    setCampaign(template);
    setMessage(templates[template as keyof typeof templates] || '');
  };

  const handleSendSMS = async () => {
    if (!phone) {
      setError('Phone number is required');
      return;
    }

    if (!message) {
      setError('Message is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Replace {name} placeholder in message
      const personalizedMessage = message.replace(/\{name\}/g, firstName || 'friend');
      
      const payload = {
        phone,
        message: personalizedMessage,
        campaign
      };

      const response = await fetch('/api/sendMagicLinksToCommunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send SMS');
      }

      setSuccess(`SMS sent successfully! Message SID: ${result.messageSid}`);
      
      // Reset form
      setPhone('');
      setFirstName('');
      setMessage('');
      setCampaign('general');
      
      onSMSSent?.();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send SMS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Send SMS Message</h3>
      
      {/* Phone Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1234567890 or 234-567-8890"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* First Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">First Name (Optional)</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Campaign Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message Type</label>
        <select
          value={campaign}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="general">General Message</option>
          <option value="event_reminder">Event Reminder</option>
          <option value="custom">Custom Message</option>
        </select>
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Message {campaign !== 'custom' && '(Use {name} for personalization)'}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter your message here..."
        />
        <div className="text-xs text-gray-500 mt-1">
          Character count: {message.length}/1600 (SMS limit)
        </div>
      </div>


      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Send Button */}
      <Button 
        onClick={handleSendSMS}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Sending...' : 'Send SMS'}
      </Button>
    </div>
  );
}
