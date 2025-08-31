import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  interest: z.string({
    required_error: "Please select an area of interest.",
  }),
});

export default function JoinPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setIsSubmitted(false);
    
    // 1) Insert into community table
    const { error: communityError } = await supabase
      .from('community')
      .insert({ 
        name: values.name, 
        email: values.email, 
        phone: values.phone, 
        interest: values.interest 
      });
      
    if (communityError) {
      form.setError("email", { message: communityError.message });
      setIsSubmitting(false);
      return;
    }
    
    // 2) Send welcome email via API route (non-blocking)
    try {
      await fetch('/api/sendCommunityWelcomeEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: values.name, 
          email: values.email, 
          interest: values.interest 
        })
      });
    } catch (e) {
      console.error('Failed to send community welcome email', e);
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    // Redirect immediately to homepage for a clearer flow
    try {
      window.location.href = '/';
    } catch {}
  }

  // Removed delayed redirect to avoid timing inconsistencies

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Joining!</h2>
            <p className="text-gray-600 mb-6">
              Welcome to the Mind Harmony community! You'll receive updates about upcoming events, 
              meditation sessions, and exclusive content.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to our main page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h1>
          <p className="text-gray-600">
            Sign up to receive updates about upcoming events, meditation sessions, 
            and exclusive content.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              {...form.register("name")}
              className="w-full"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...form.register("email")}
              className="w-full"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 555-5555"
              {...form.register("phone")}
              className="w-full"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Interest Field */}
          <div className="space-y-2">
            <Label htmlFor="interest" className="text-sm font-medium text-gray-700">
              I'm interested in
            </Label>
            <Select onValueChange={(value) => form.setValue("interest", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meditation">Meditation Sessions</SelectItem>
                <SelectItem value="piano">Piano Performances</SelectItem>
                <SelectItem value="events">Community Events</SelectItem>
                <SelectItem value="workshops">Workshops & Classes</SelectItem>
                <SelectItem value="retreats">Retreats</SelectItem>
                <SelectItem value="all">All of the above</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.interest && (
              <p className="text-sm text-red-600">
                {form.formState.errors.interest.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-medium"
          >
            {isSubmitting ? "Joining..." : "Join the Circle"}
          </Button>
        </form>

        {/* Privacy Note */}
        <p className="text-sm text-gray-500 text-center mt-6">
          We respect your privacy and will never share your information.
        </p>
      </div>
    </div>
  );
}
