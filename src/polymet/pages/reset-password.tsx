import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [status, setStatus] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [checking, setChecking] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);

  React.useEffect(() => {
    async function check() {
      try {
        // If the user arrived via the recovery email link, Supabase will grant a temporary session
        const { data } = await supabase.auth.getSession();
        setHasSession(!!data.session);
      } catch (e) {
        setHasSession(false);
      } finally {
        setChecking(false);
      }
    }
    check();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
      return;
    }
    setStatus("Password updated! You can now log in with your new password.");
    setTimeout(() => navigate("/login"), 1500);
  }

  if (checking) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">Checking reset link…</div>
    );
  }

  if (!hasSession) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          This page must be opened from the password reset email link. Please go back to your email and
          tap the “Reset password” link again. If you requested multiple emails, use the most recent one.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Set a New Password</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      {status && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{status}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <button type="submit" className="w-full bg-[#1E3A5F] text-white rounded py-2">Update Password</button>
      </form>
    </div>
  );
}





