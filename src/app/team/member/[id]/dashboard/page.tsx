"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LogOut,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRightCircle,
  AlertCircle,
  Target,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Edit3,
  Save,
  X,
} from 'lucide-react';

interface TeamMember {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  division: string;
  avatar_url: string;
  status: string;
  last_login: string;
}

interface DashboardStatus {
  id: string;
  member_id: string;
  current_status: string;
  status_title: string;
  status_description: string;
  progress_percentage: number;
  priority: string;
}

interface Task {
  id: string;
  task_title: string;
  task_description: string;
  task_status: 'assigned' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  completion_percentage: number;
  tags: string[];
  assigned_at: string;
}

const TASK_COLUMNS = [
  { id: 'assigned' as const, title: 'Pre-Flight', icon: Circle, color: 'border-blue-400/50', bgColor: 'bg-blue-400/5' },
  { id: 'in-progress' as const, title: 'In-Flight', icon: ArrowRightCircle, color: 'border-amber-400/50', bgColor: 'bg-amber-400/5' },
  { id: 'completed' as const, title: 'Mission Complete', icon: CheckCircle2, color: 'border-emerald-400/50', bgColor: 'bg-emerald-400/5' },
  { id: 'on-hold' as const, title: 'On Hold', icon: AlertCircle, color: 'border-red-400/50', bgColor: 'bg-red-400/5' },
];

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/50', dot: 'bg-red-400' },
  high: { label: 'High', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/50', dot: 'bg-amber-400' },
  medium: { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/50', dot: 'bg-blue-400' },
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/50', dot: 'bg-slate-400' },
};

export default function MemberDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id as string;

  const [member, setMember] = useState<TeamMember | null>(null);
  const [dashboardStatus, setDashboardStatus] = useState<DashboardStatus | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(false);

  useEffect(() => {
    validateSession();
  }, []);

  const validateSession = () => {
    const session = localStorage.getItem('team_member_session');
    if (!session) {
      router.push('/team/login');
      return;
    }

    const parsedSession = JSON.parse(session);
    if (new Date(parsedSession.expiresAt) < new Date()) {
      localStorage.removeItem('team_member_session');
      router.push('/team/login');
      return;
    }

    if (parsedSession.id !== memberId) {
      router.push('/team/login');
      return;
    }

    fetchMemberData();
  };

  const fetchMemberData = async () => {
    if (!supabase || !memberId) return;

    try {
      // Fetch member info
      const { data: memberData } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (memberData) {
        setMember(memberData);
      }

      // Fetch dashboard status
      const { data: statusData } = await supabase
        .from('team_member_dashboard_status')
        .select('*')
        .eq('member_id', memberId)
        .single();

      if (statusData) {
        setDashboardStatus(statusData);
      } else {
        // Create default status if not exists
        const { data: newStatus } = await supabase
          .from('team_member_dashboard_status')
          .insert({
            member_id: memberId,
            current_status: 'pending',
            status_title: 'Mission Briefing',
            status_description: 'Awaiting assignment briefing',
            progress_percentage: 0,
            priority: 'medium',
          })
          .select()
          .single();

        if (newStatus) {
          setDashboardStatus(newStatus);
        }
      }

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('team_member_tasks')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (tasksData) {
        setTasks(tasksData);
      }

      // Log activity
      await supabase.from('team_member_activity_log').insert({
        member_id: memberId,
        activity_type: 'dashboard_access',
        description: 'Accessed member dashboard',
      });
    } catch (error) {
      console.error('Error fetching member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: Task['task_status']) => {
    if (!supabase) return;

    try {
      await supabase
        .from('team_member_tasks')
        .update({ task_status: newStatus })
        .eq('id', taskId);

      setTasks(tasks.map(t => t.id === taskId ? { ...t, task_status: newStatus } : t));

      // Log activity
      await supabase.from('team_member_activity_log').insert({
        member_id: memberId,
        activity_type: 'task_status_update',
        description: `Task status changed to ${newStatus}`,
        metadata: { task_id: taskId, new_status: newStatus },
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskCompletion = async (taskId: string, percentage: number) => {
    if (!supabase) return;

    try {
      await supabase
        .from('team_member_tasks')
        .update({
          completion_percentage: percentage,
          completed_at: percentage === 100 ? new Date().toISOString() : null,
        })
        .eq('id', taskId);

      setTasks(tasks.map(t => t.id === taskId ? { ...t, completion_percentage: percentage } : t));
    } catch (error) {
      console.error('Error updating completion:', error);
    }
  };

  const handleLogout = async () => {
    if (supabase && memberId) {
      await supabase.from('team_member_activity_log').insert({
        member_id: memberId,
        activity_type: 'logout',
        description: 'Logged out from member dashboard',
      });
    }

    localStorage.removeItem('team_member_session');
    router.push('/team/login');
  };

  const toggleTaskExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rl-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rl-space-blue/20 border-t-rl-space-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-rl-light-grey/60 font-heading">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-rl-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-rl-light-grey text-lg font-heading mb-4">Member not found</p>
          <button
            onClick={handleLogout}
            className="text-rl-space-blue hover:text-rl-space-blue/80 font-heading"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const tasksGroupedByStatus = TASK_COLUMNS.map(column => ({
    ...column,
    tasks: tasks.filter(t => t.task_status === column.id),
  }));

  return (
    <div className="min-h-screen bg-rl-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-rl-black border-b border-rl-white/10 backdrop-blur-sm">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title & Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-rl-space-blue rounded-full animate-pulse"></div>
                <h1 className="text-2xl font-heading font-black text-rl-white truncate">
                  {member.name}
                </h1>
              </div>
              <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase">
                {member.role} • {member.division}
              </p>
            </div>

            {/* Right: Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-rl-white/10 hover:bg-rl-white/5 transition-colors text-rl-light-grey/80 hover:text-rl-white font-heading text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-6 py-8">
        {/* Profile & Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Member Profile Card */}
          <div className="lg:col-span-1 bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
            <div className="flex flex-col items-center text-center">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-2 border-rl-space-blue/50 mb-4 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-rl-space-blue/50 mb-4 flex items-center justify-center bg-rl-space-blue/10">
                  <User className="w-10 h-10 text-rl-space-blue" />
                </div>
              )}

              <h2 className="text-lg font-heading font-bold text-rl-white mb-1">{member.name}</h2>
              <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest mb-4">
                {member.uid}
              </p>

              <div className="w-full space-y-2 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-rl-light-grey/60">Email:</span>
                  <span className="text-rl-white/80 truncate">{member.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rl-light-grey/60">Status:</span>
                  <span className="px-2 py-1 rounded text-xs font-heading tracking-widest bg-green-400/10 text-green-400 border border-green-400/30">
                    {member.status.toUpperCase()}
                  </span>
                </div>
                {member.last_login && (
                  <div className="flex justify-between text-xs">
                    <span className="text-rl-light-grey/60">Last Login:</span>
                    <span className="text-rl-white/60">
                      {new Date(member.last_login).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dashboard Status Cards */}
          <div className="lg:col-span-2 space-y-4">
            {dashboardStatus && (
              <>
                {/* Main Status Card */}
                <div className="bg-gradient-to-r from-rl-space-blue/20 to-blue-600/20 border border-rl-space-blue/30 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">
                        Current Status
                      </h3>
                      <h2 className="text-2xl font-heading font-bold text-rl-white">
                        {dashboardStatus.status_title}
                      </h2>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-heading tracking-widest uppercase ${
                      dashboardStatus.priority === 'urgent'
                        ? 'bg-red-400/20 border border-red-400/50 text-red-400'
                        : dashboardStatus.priority === 'high'
                        ? 'bg-amber-400/20 border border-amber-400/50 text-amber-400'
                        : 'bg-blue-400/20 border border-blue-400/50 text-blue-400'
                    }`}>
                      {dashboardStatus.priority}
                    </div>
                  </div>

                  <p className="text-rl-light-grey/70 text-sm mb-4">
                    {dashboardStatus.status_description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-rl-light-grey/60 font-heading text-xs">Progress</span>
                      <span className="font-heading font-bold text-rl-space-blue">
                        {dashboardStatus.progress_percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-rl-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rl-space-blue to-blue-400 transition-all duration-300"
                        style={{ width: `${dashboardStatus.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rl-white/5 border border-rl-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest mb-1">
                          Active Tasks
                        </p>
                        <p className="text-2xl font-heading font-bold text-rl-white">
                          {tasks.filter(t => t.task_status !== 'completed').length}
                        </p>
                      </div>
                      <Zap className="w-6 h-6 text-rl-space-blue/60" />
                    </div>
                  </div>

                  <div className="bg-rl-white/5 border border-rl-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest mb-1">
                          Completed
                        </p>
                        <p className="text-2xl font-heading font-bold text-emerald-400">
                          {tasks.filter(t => t.task_status === 'completed').length}
                        </p>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400/60" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tasks Kanban Board (inherited from team dashboard) */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-rl-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-rl-space-blue" />
            Mission Tasks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tasksGroupedByStatus.map(column => {
              const ColumnIcon = column.icon;
              return (
                <div key={column.id} className={`${column.bgColor} border ${column.color} rounded-lg p-4 min-h-[400px] flex flex-col`}>
                  {/* Column Header */}
                  <div className="mb-4 pb-4 border-b border-rl-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <ColumnIcon className={`w-5 h-5 ${column.color.replace('border', 'text')}`} />
                      <h3 className={`font-heading font-bold text-sm tracking-wide ${column.color.replace('border', 'text')}`}>
                        {column.title}
                      </h3>
                    </div>
                    <p className="text-xs text-rl-light-grey/60 font-heading">
                      {column.tasks.length} {column.tasks.length === 1 ? 'Task' : 'Tasks'}
                    </p>
                  </div>

                  {/* Tasks List */}
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {column.tasks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-rl-light-grey/40 text-xs font-heading">
                          No tasks in this column
                        </p>
                      </div>
                    ) : (
                      column.tasks.map(task => (
                        <div
                          key={task.id}
                          className="bg-rl-white/5 border border-rl-white/10 rounded-lg p-3 hover:bg-rl-white/10 transition-all cursor-pointer"
                        >
                          {/* Task Header */}
                          <div
                            onClick={() => toggleTaskExpanded(task.id)}
                            className="flex items-start gap-2 mb-2"
                          >
                            <button
                              className="mt-0.5 text-rl-light-grey/60 hover:text-rl-white transition-colors flex-shrink-0"
                            >
                              {expandedTasks.has(task.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-heading font-semibold text-sm text-rl-white truncate">
                                {task.task_title}
                              </h4>
                            </div>
                          </div>

                          {/* Priority Badge */}
                          <div className="flex items-center gap-2 mb-3 px-1">
                            <span
                              className={`text-xs font-heading uppercase tracking-widest px-2 py-1 rounded border ${
                                PRIORITY_CONFIG[task.priority].bg
                              } ${PRIORITY_CONFIG[task.priority].border} ${PRIORITY_CONFIG[task.priority].color}`}
                            >
                              {PRIORITY_CONFIG[task.priority].label}
                            </span>
                          </div>

                          {/* Completion Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-rl-light-grey/60 font-heading">Completion</span>
                              <span className="text-xs font-heading font-bold text-rl-space-blue">
                                {task.completion_percentage}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-rl-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-rl-space-blue to-blue-400 transition-all"
                                style={{ width: `${task.completion_percentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {expandedTasks.has(task.id) && (
                            <div className="space-y-3 pt-3 border-t border-rl-white/10">
                              <p className="text-sm text-rl-light-grey/70 line-clamp-3">
                                {task.task_description}
                              </p>

                              {task.due_date && (
                                <div className="flex items-center gap-2 text-xs text-rl-light-grey/60">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                              )}

                              {/* Update Completion */}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskCompletion(task.id, Math.min(task.completion_percentage + 10, 100));
                                  }}
                                  className="flex-1 px-2 py-1 text-xs font-heading bg-rl-space-blue/20 border border-rl-space-blue/50 hover:bg-rl-space-blue/30 rounded transition-colors text-rl-space-blue"
                                >
                                  +10%
                                </button>
                                {task.completion_percentage < 100 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTaskCompletion(task.id, 100);
                                    }}
                                    className="flex-1 px-2 py-1 text-xs font-heading bg-emerald-400/20 border border-emerald-400/50 hover:bg-emerald-400/30 rounded transition-colors text-emerald-400"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>

                              {/* Status Actions */}
                              {task.task_status !== 'completed' && (
                                <div className="flex gap-1.5">
                                  {column.id !== 'in-progress' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskStatusChange(task.id, 'in-progress');
                                      }}
                                      className="flex-1 px-2 py-1 text-xs font-heading bg-amber-400/20 border border-amber-400/50 hover:bg-amber-400/30 rounded transition-colors text-amber-400"
                                    >
                                      Start
                                    </button>
                                  )}
                                  {column.id !== 'completed' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskStatusChange(task.id, 'completed');
                                      }}
                                      className="flex-1 px-2 py-1 text-xs font-heading bg-emerald-400/20 border border-emerald-400/50 hover:bg-emerald-400/30 rounded transition-colors text-emerald-400"
                                    >
                                      Done
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
