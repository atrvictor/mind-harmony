import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MusicIcon, GiftIcon, UsersIcon, CheckIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InvitationLandingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    communicationPreference: "everything",
    discoveryMethod: "",
    interests: [] as string[],
    smsConsent: false,
    termsAccepted: false,
    emailUpdates: true
  });

  // Get invitation details from URL params
  const rid = searchParams.get('rid');
  const campaign = searchParams.get('campaign');
  const email = searchParams.get('email');

  useEffect(() => {
    // Pre-fill email and fetch attendee data if provided in URL
    if (email || rid) {
      const fetchAttendeeData = async () => {
        try {
          const params = new URLSearchParams();
          if (email) params.append('email', email);
          if (rid) params.append('rid', rid);
          
          const response = await fetch(`/api/getAttendeeData?${params}`);
          const result = await response.json();
          
          if (result.success && result.attendee) {
            const attendee = result.attendee;
            setFormData(prev => ({
              ...prev,
              email: attendee.email,
              firstName: attendee.firstName || prev.firstName,
              lastName: attendee.lastName || prev.lastName,
              phone: attendee.phone || prev.phone,
              city: attendee.city || prev.city,
              state: attendee.state || prev.state,
              // Set communication preference based on event history
              communicationPreference: attendee.eventHistory?.length > 2 ? 'everything' : 'important'
            }));
          } else if (email) {
            // Fallback to just setting email
            setFormData(prev => ({ ...prev, email: decodeURIComponent(email) }));
          }
        } catch (error) {
          console.error('Failed to fetch attendee data:', error);
          // Fallback to just setting email if provided
          if (email) {
            setFormData(prev => ({ ...prev, email: decodeURIComponent(email) }));
          }
        }
      };
      
      fetchAttendeeData();
    }
  }, [email, rid]);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error("Please fill in all required fields");
      }
      if (!formData.smsConsent) {
        throw new Error("SMS consent is required to complete your membership");
      }
      if (!formData.termsAccepted) {
        throw new Error("You must accept the Terms of Service to continue");
      }

      // Submit to our API endpoint
      const response = await fetch('/api/acceptInvitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          communicationPreference: formData.communicationPreference,
          discoveryMethod: formData.discoveryMethod,
          interests: formData.interests,
          smsConsent: formData.smsConsent,
          emailUpdates: formData.emailUpdates,
          termsAccepted: formData.termsAccepted
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to accept invitation');
      }

      setSuccess(true);
      
      // Redirect to the login link provided by the API
      if (result.loginLink) {
        setTimeout(() => {
          window.location.href = result.loginLink;
        }, 2000);
      } else {
        // Fallback to meditation page
        setTimeout(() => {
          navigate('/meditation');
        }, 2000);
      }

    } catch (err: any) {
      console.error('Invitation acceptance error:', err);
      setError(err.message || 'Failed to complete membership signup');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to Mind Harmony!</CardTitle>
            <CardDescription>
              Your membership is now active. Redirecting you to your exclusive music collection...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <GiftIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            A Gift for You 🎵
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Thank you for being part of Mind Harmony's journey. As our way of saying thanks, 
            we'd love to share something special with you.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MusicIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">4 Unreleased Songs</h3>
              <p className="text-sm text-gray-600">Exclusive access to Vitiá's upcoming album</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <UsersIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Member Community</h3>
              <p className="text-sm text-gray-600">Join our growing meditation community</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <GiftIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Early Access</h3>
              <p className="text-sm text-gray-600">First to know about new events and releases</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Membership</CardTitle>
            <CardDescription>
              Just a few details to unlock your gift and personalize your Mind Harmony experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this for event reminders and important updates only
                </p>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="San Diego"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="CA"
                  />
                </div>
              </div>

              {/* Communication Preference */}
              <div>
                <Label className="text-base font-medium">Communication Frequency</Label>
                <RadioGroup
                  value={formData.communicationPreference}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, communicationPreference: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="everything" id="everything" />
                    <Label htmlFor="everything" className="font-normal">
                      Send me everything (events, music releases, community updates)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="important" id="important" />
                    <Label htmlFor="important" className="font-normal">
                      Event reminders and important updates only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal" className="font-normal">
                      Minimal - critical information only
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Discovery Method */}
              <div>
                <Label htmlFor="discovery">How did you first discover Mind Harmony?</Label>
                <Select value={formData.discoveryMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, discoveryMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select how you found us" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friend_referral">Friend referral</SelectItem>
                    <SelectItem value="social_media">Social media</SelectItem>
                    <SelectItem value="attended_event">Attended live event</SelectItem>
                    <SelectItem value="online_search">Online search</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interests */}
              <div>
                <Label className="text-base font-medium mb-3 block">What interests you most? (Select all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Live piano meditation events",
                    "Candlelight yoga and piano",
                    "Recorded music and albums",
                    "Guided meditation content",
                    "Community discussions and sharing"
                  ].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="font-normal text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combined Consent */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="combinedConsent"
                    checked={formData.smsConsent && formData.termsAccepted && formData.emailUpdates}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      smsConsent: !!checked,
                      termsAccepted: !!checked,
                      emailUpdates: !!checked
                    }))}
                    required
                  />
                  <Label htmlFor="combinedConsent" className="font-normal text-sm leading-relaxed">
                    I accept the{" "}
                    <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>. 
                    I agree to receive email updates about Mind Harmony events and news. 
                    I agree to receive SMS updates from Mind Harmony. Reply STOP to opt out. *
                  </Label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={loading || !formData.smsConsent || !formData.termsAccepted || !formData.emailUpdates}
              >
                {loading ? "Creating Your Membership..." : "Accept Gift & Become a Member"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By completing this form, you'll gain immediate access to your exclusive music collection 
                and become part of the Mind Harmony community.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a href="mailto:events@mail.mindharmony.life" className="text-blue-600 hover:underline">
              events@mail.mindharmony.life
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
