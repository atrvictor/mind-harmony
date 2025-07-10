import { supabase } from "./supabase";

export async function submitEmail(email: string) {
  const { data, error } = await supabase.from("waitlist").insert([{ email }]);
  return { data, error };
}

export async function submitNewsletterEmail(email: string) {
  const { data, error } = await supabase.from("newsletter").insert([{ email }]);
  return { data, error };
} 