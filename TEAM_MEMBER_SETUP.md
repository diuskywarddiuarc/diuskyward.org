# Team Dashboard & Admin Integration Setup Guide

## Project Architecture

Your DIU Skyward system now includes a complete team member management system with individual dashboards, admin controls, and Supabase database integration.

### System Components

```
├── Team Dashboard System
│   ├── Authentication (Supabase)
│   ├── Team Member Login
│   ├── Individual Member Dashboards
│   └── Task Management
│
├── Admin Panel
│   ├── Team Management
│   ├── Member Administration
│   ├── Task Assignment
│   └── Status Tracking
│
└── Database (Supabase)
    ├── team_members
    ├── team_member_dashboard_status
    ├── team_member_tasks
    └── team_member_activity_log
```

---

## Setup Instructions

### 1. Run the Database Schema

Run the new Supabase schema to create team member tables:

```bash
# From your project root:
cd diuskyward-main

# You need to manually run the SQL schema in your Supabase console
# Go to: https://app.supabase.com -> SQL Editor -> New Query
# Copy the contents of supabase-team-schema.sql and execute it
```

**Contents of [supabase-team-schema.sql](supabase-team-schema.sql):**
- `team_members` - Stores team member information and authentication
- `team_member_dashboard_status` - Stores admin-assigned status and progress
- `team_member_tasks` - Stores tasks assigned to members
- `team_member_activity_log` - Tracks member activities

### 2. Add Test Team Members (via Supabase)

```sql
INSERT INTO team_members (uid, email, password_hash, name, role, division, status) VALUES
('member001', 'user1@example.com', 'default', 'Alex Chen', 'Avionics Engineer', 'Avionics', 'pending'),
('member002', 'user2@example.com', 'default', 'Sarah Johnson', 'Systems Engineer', 'Systems', 'pending'),
('member003', 'user3@example.com', 'default', 'Mike Ross', 'Telemetry Specialist', 'Telemetry', 'pending');
```

---

## User Flows

### Team Member Login Flow

1. **Access Team Dashboard**
   - Navigate to: `http://localhost:3000/team/login`
   - Enter UID and password
   - System authenticates via `team_members` table
   - Session stored in localStorage with 24-hour expiration

2. **Member Dashboard Access**
   - After login: redirected to `/team/member/[id]/dashboard`
   - View personal profile and assigned status
   - See assigned tasks in kanban columns
   - Update task progress and status

### Admin Management Flow

1. **Access Admin Panel**
   - Navigate to: `http://localhost:3000/admin/team`

2. **Overview Tab**
   - View total members, active members, tasks, and completed tasks
   - See recent member activity

3. **Members Tab**
   - Search members by name, email, or UID
   - Add new team members
   - View member status and progress
   - Activate pending members
   - Update member dashboard status (title, description, progress, priority)
   - Delete members

4. **Tasks Tab**
   - Assign tasks to specific members
   - Track task completion across team
   - Monitor member workload

---

## File Structure

### New Files Created

```
src/app/
├── team/
│   ├── login/
│   │   └── page.tsx           # Team member login page
│   └── member/
│       └── [id]/
│           └── dashboard/
│               └── page.tsx   # Individual member dashboard
│
└── admin/
    └── team/
        └── page.tsx           # Updated admin team management
```

### Database Schema Files

```
supabase-team-schema.sql      # Complete team member database schema
```

---

## Key Features

### Team Member Dashboard
- ✅ Secure login with UID and password
- ✅ Personal profile display
- ✅ Admin-assigned status and progress tracking
- ✅ Kanban-style task board (inherited design from team dashboard)
- ✅ Task status management (assigned → in-progress → completed)
- ✅ Progress tracking per task
- ✅ Activity logging

### Admin Team Management
- ✅ Team member CRUD operations
- ✅ Member activation workflow (pending → active)
- ✅ Dashboard status assignment with priority levels
- ✅ Progress percentage tracking
- ✅ Task assignment to members
- ✅ Task monitoring and status tracking
- ✅ Member search and filtering
- ✅ Statistics overview

### Database Integration
- ✅ Supabase authentication and data persistence
- ✅ Row-level security (RLS) policies
- ✅ Automatic timestamp tracking
- ✅ Relational data model
- ✅ Activity audit logging

---

## Authentication Details

### Password Management

**Important:** The current implementation uses simple password comparison for demonstration. For production:

1. Install bcrypt:
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

2. Update [src/app/team/login/page.tsx](src/app/team/login/page.tsx) password verification:

```typescript
// Before: Simple comparison
if (members.password_hash !== password) {

// After: BCrypt comparison
import bcrypt from 'bcrypt';
const isValidPassword = await bcrypt.compare(password, members.password_hash);
if (!isValidPassword) {
```

3. Update admin add member to hash passwords:

```typescript
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(memberFormData.password || 'default', 10);
```

### Session Management

- Sessions stored in `localStorage` with member ID and expiration
- 24-hour session expiration by default
- Activity logging for all logins/logouts

---

## Database Relations

### 1-to-1 Relations

```
team_members (1) ──── (1) team_member_dashboard_status
    id                      member_id (FK)
```

Each team member has exactly one dashboard status assigned by admin.

### 1-to-Many Relations

```
team_members (1) ──── (M) team_member_tasks
    id                      member_id (FK)
```

Each team member can have multiple tasks assigned.

```
team_members (1) ──── (M) team_member_activity_log
    id                      member_id (FK)
```

Each team member can have multiple activity entries.

---

## API Routes and Functions

### Supabase Queries

#### Get Team Member
```typescript
const { data } = await supabase
  .from('team_members')
  .select('*')
  .eq('uid', uid)
  .single();
```

#### Get Member Dashboard Status
```typescript
const { data } = await supabase
  .from('team_member_dashboard_status')
  .select('*')
  .eq('member_id', memberId)
  .single();
```

#### Get Member Tasks
```typescript
const { data } = await supabase
  .from('team_member_tasks')
  .select('*')
  .eq('member_id', memberId)
  .order('created_at', { ascending: false });
```

#### Update Task Status
```typescript
const { error } = await supabase
  .from('team_member_tasks')
  .update({ task_status: newStatus })
  .eq('id', taskId);
```

#### Log Activity
```typescript
await supabase.from('team_member_activity_log').insert({
  member_id: memberId,
  activity_type: 'login',
  description: 'Team member logged in',
});
```

---

## Testing Checklist

### Member Features
- [ ] UID + Password login works
- [ ] Session persists across page refreshes
- [ ] Redirect to login on session expiration
- [ ] View personal profile information
- [ ] See all assigned tasks in kanban columns
- [ ] Update task progress (increment by 10% or complete)
- [ ] Change task status from column to column
- [ ] Logout clears session

### Admin Features
- [ ] Add team member with all fields
- [ ] Search members by name/email/UID
- [ ] Activate pending members
- [ ] Update member dashboard status
- [ ] Set progress percentage (0-100%)
- [ ] Assign priority level (low, medium, high, urgent)
- [ ] Assign tasks to members
- [ ] View task completion stats
- [ ] Delete team members

### Data Consistency
- [ ] Member tasks appear in their dashboard
- [ ] Admin-set status displays on member dashboard
- [ ] Progress updates sync between tables
- [ ] Activity logs capture all actions


---

## Styling & Design

### Design Inheritance

The team member dashboard inherits the aerospace-themed design from the existing team dashboard:

- **Color Scheme**: Dark aerospace theme with blue accents
- **Kanban Columns**: Pre-Flight, In-Flight, Post-Flight Analysis, Mission Complete
- **Icons**: Lucide React aerospace and task icons
- **Typography**: Heading font with tracking (uppercase)
- **Animations**: Subtle pulses, transitions, and hover effects

### Responsive Design

- Mobile-optimized with proper breakpoints
- Touch-friendly buttons and inputs
- Scrollable kanban columns on smaller screens
- Collapsible sections for compact view

---

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Troubleshooting

### Members can't log in
- Check team_members table has data
- Verify password matches (case-sensitive)
- Check member status is 'active'
- Verify Supabase connection

### Tasks don't appear in dashboard
- Confirm tasks are assigned to that member_id
- Check member_id matches in both tables
- Verify task_status is one of: assigned, in-progress, completed, on-hold

### Session expires unexpectedly
- Session duration is 24 hours from login
- Check localStorage for session token
- Verify session_expires_at timestamp

### Admin changes don't sync
- Refresh the member dashboard page
- Check browser console for errors
- Verify Supabase update query succeeded

---

## Next Steps

### Enhancement Ideas

1. **Email Notifications**
   - Task assignments
   - Status updates
   - Progress milestones

2. **Team Collaboration**
   - Comments on tasks
   - File attachments
   - Real-time updates

3. **Advanced Analytics**
   - Team velocity tracking
   - Performance metrics
   - Burndown charts

4. **Security Enhancements**
   - OAuth integration
   - Two-factor authentication
   - Password reset flow
   - Rate limiting

5. **Mobile App**
   - React Native version
   - Offline support
   - Push notifications

---

## Support & Documentation

For Supabase documentation, visit: https://supabase.com/docs
For more details, check the inline comments in the implementation files.

Date: March 31, 2026
Version: 1.0.0
