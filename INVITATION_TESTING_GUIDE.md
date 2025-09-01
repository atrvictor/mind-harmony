# 🎵 Mind Harmony Enhanced Invitation System - Testing Guide

## 🚀 What We Built

### ✅ Complete Features:
1. **CSV Upload Widget** - Import attendee lists with smart parsing
2. **Attendee Segmentation** - Select by event, date, or location  
3. **Auto Name Pre-filling** - Landing page pre-fills from past data
4. **Enhanced Landing Page** - Beautiful form with all preferences
5. **Legal Foundation** - Terms of Service & Privacy Policy
6. **SMS Compliance** - TCPA-compliant consent tracking
7. **Admin Dashboard** - Track invitation status and user preferences

## 📊 Song Play Tracking - FULLY MAINTAINED

**✅ Your existing tracking continues to work:**
- `music_plays` table logs every play/pause/ended action
- Enhanced with campaign attribution (`past_attendee_invitation`)
- Links back to specific magic links via `rid`
- Tracks user preferences and interests for better insights

## 📋 Testing Workflow

### **Step 1: Database Setup**
```sql
-- Run this in your Supabase SQL Editor:
-- (Copy content from create_enhanced_invitation_system.sql)
```

### **Step 2: Test CSV Upload**
1. Go to Admin panel → Bulk Email section
2. Look for new "📊 Import Attendees from CSV" widget (blue box)
3. Upload your `Past EB Attendees before Sep.csv` file
4. Verify it shows: "Found 51 attendees"
5. Test segmentation buttons:
   - **By Event**: Feb (X), Mar (X), Apr (X), Jul (X), Aug (X)
   - **By Location**: San Diego (X), La Jolla (X), etc.

### **Step 3: Test Invitation Flow**
1. Select a few test emails (including your own)
2. Click "ML2" preset button
3. Verify enhanced template loads with gift messaging
4. Send magic links
5. Check your email and click the magic link
6. **Should redirect to**: `/invitation` landing page (NOT direct login)
7. Verify form is pre-filled with your name/data
8. Fill out preferences and submit
9. Should redirect to `/meditation` with 4 songs unlocked

### **Step 4: Verify Admin Tracking**
1. Check "Invitation Status" section in Admin
2. Should show sent invitations with status (pending/accepted/expired)
3. View user preferences and interests collected
4. Test song play tracking in meditation area

## 🎯 Complete User Journey

```
CSV Upload → Select Recipients → ML2 Template → Send Magic Links
     ↓
Email Received → Click Magic Link → Invitation Landing Page
     ↓  
Pre-filled Form → Add Preferences → Accept Terms → Submit
     ↓
Account Created → Music Access Granted → Redirect to /meditation
     ↓
4 Songs Unlocked → Play Tracking → Admin Analytics
```

## 🔍 What to Verify

### **CSV Integration:**
- ✅ Upload works smoothly
- ✅ Event segmentation shows correct counts
- ✅ Location segmentation works
- ✅ "Select All" adds correct number to selectedEmails

### **Landing Page:**
- ✅ Pre-fills name, email, city, state from past data
- ✅ Form validation works (required fields)
- ✅ SMS consent is required
- ✅ Terms acceptance is required
- ✅ Interests include "Candlelight yoga and piano"
- ✅ Communication preferences save correctly

### **Backend Integration:**
- ✅ `user_profiles` table populated with all data
- ✅ `sms_consents` table tracks compliance
- ✅ `music_access` table grants access
- ✅ Magic link marked as accepted
- ✅ User gets logged in automatically

### **Admin Dashboard:**
- ✅ Invitation Status section shows tracking
- ✅ Can see user preferences and interests
- ✅ Song play analytics work
- ✅ Campaign attribution works

## 🧪 Test Files Created

- `imports/Test_Invitation_Recipients.csv` - Single test recipient (your email)
- `imports/Past EB Attendees before Sep.csv` - 51 deduplicated past attendees

## 🚨 Important Notes

**Before sending to real users:**
1. **Run database migration first**
2. **Test with your own email completely**
3. **Verify Terms of Service and Privacy Policy pages work**
4. **Check that SMS consent is properly recorded**
5. **Confirm song access is granted correctly**

**Campaign Detection:**
- ML2 preset automatically uses `past_attendee_invitation` campaign
- This triggers the landing page flow instead of direct auth
- Other presets use regular `concert_followup` campaign

## 🎉 Ready to Launch!

Once you've tested thoroughly:
1. Upload your `Past EB Attendees before Sep.csv`
2. Use event segmentation to target specific groups
3. Use ML2 preset for the enhanced invitation
4. Send to selected attendees
5. Monitor invitation acceptance in Admin dashboard
6. Track song engagement and user preferences

**This system is now Stripe-ready and legally compliant for your future growth!** 🚀
