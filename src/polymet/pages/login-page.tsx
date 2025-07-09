import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [resetMessage, setResetMessage] = React.useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        alert("Login successful!");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault();
    setError("");
    setResetMessage("");
    if (!email) {
      setError("Please enter your email address above first.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setResetMessage("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#FFEBEE', 
          color: '#D32F2F', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            disabled={loading}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            disabled={loading}
          />
        </div>
        
        <div style={{ marginBottom: '10px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={handleForgotPassword}
            style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontSize: '0.95em', padding: 0 }}
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%',
            padding: '10px',
            backgroundColor: '#1E3A5F',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      {resetMessage && (
        <div style={{ backgroundColor: '#E3FCEC', color: '#256029', padding: '10px', borderRadius: '4px', marginBottom: '15px', marginTop: '10px' }}>
          {resetMessage}
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '10px' }}>
          <Link to="/signup" style={{ color: '#1E3A5F', textDecoration: 'none' }}>
            Need an account? Sign Up
          </Link>
        </div>
        <Link to="/" style={{ color: '#1E3A5F', textDecoration: 'none', fontSize: '0.9em' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
} 