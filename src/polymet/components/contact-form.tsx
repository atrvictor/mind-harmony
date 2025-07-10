import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
  interest: z.string({
    required_error: "Please select an area of interest.",
  }),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      interest: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setIsSubmitted(false);
    // Register user with Supabase Auth (magic link, passwordless)
    const { data, error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        data: {
          full_name: values.name,
          interest: values.interest,
        },
      },
    });
    if (error) {
      let friendlyMessage = error.message;
      if (friendlyMessage.toLowerCase().includes("already registered") || friendlyMessage.toLowerCase().includes("user already exists") || friendlyMessage.toLowerCase().includes("duplicate")) {
        friendlyMessage = "Email already registered.";
      }
      // Always show the actual error message for debugging
      form.setError("email", { message: friendlyMessage + (friendlyMessage !== error.message ? `\n(${error.message})` : "") });
      setIsSubmitting(false);
      return;
    }
    // Also upsert into profiles table
    const { error: profileError } = await supabase.from("profiles").upsert({
      full_name: values.name,
      user_id: null, // will be filled after verification, but we can use email as a temp unique
      bio: null,
      preferred_meditation_duration: null,
      preferred_meditation_time: null,
      notification_preference: null,
      interest: values.interest,
      email: values.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "email" });
    if (profileError) {
      form.setError("email", { message: "Registered, but failed to save profile: " + profileError.message });
    }
      setIsSubmitting(false);
      setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="bg-[#E5F0F9]/30 rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <svg
            className="w-6 h-6 text-green-600"
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
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          Your information has been submitted successfully. We'll be in touch
          soon about upcoming events and meditation sessions.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#E5F0F9]/30 rounded-lg p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-2">Join Our Community</h3>
      <p className="text-muted-foreground mb-6">
        Sign up to receive updates about upcoming events, meditation sessions,
        and exclusive content.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I'm interested in</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your interest" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="candlelight_yoga">
                      Candlelight yoga
                    </SelectItem>
                    <SelectItem value="piano_meditations">
                      Piano meditations
                    </SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Join the Circle"}
          </Button>

          <FormDescription className="text-center">
            We respect your privacy and will never share your information.
          </FormDescription>
        </form>
      </Form>
    </div>
  );
}
