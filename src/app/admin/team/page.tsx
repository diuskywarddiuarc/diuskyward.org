"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Calendar,
  Clock,
  Search,
  Users,
  CheckCircle2,
  Circle,
  ArrowRightCircle,
  AlertCircle,
  X,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Edit3,
  Trash2,
  Layout,
  MoreVertical,
  Filter,
  ChevronDown,
  User,
  Rocket,
  Target,
  UserPlus,
  Shield,
  Lock,
} from 'lucide-react';

// ============ TYPES ============
interface TeamMember {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  division: string;
  avatar_url: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  last_login: string;
}

interface DashboardStatus {
  id: string;
  member_id: string;
  current_status: string;
  status_title: string;
  status_description: string;
  progress_percentage: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface TeamMemberTask {
  id: string;
  member_id: string;
  task_title: string;
  task_description: string;
  task_status: 'assigned' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  completion_percentage: number;
  assigned_at: string;
}

// ============ CONSTANTS ============
const PRIORITIES = {
  urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/50', dot: 'bg-red-400' },
  high: { label: 'High', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/50', dot: 'bg-amber-400' },
  medium: { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/50', dot: 'bg-blue-400' },
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/50', dot: 'bg-slate-400' }
};

interface CustomDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function CustomDropdown({ label, value, options, onChange }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative min-h-[80px]">
      <label className="block text-sm text-rl-light-grey/70 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={options.length === 0}
        className={`w-full bg-rl-white/5 border border-rl-white/20 rounded-lg px-3 py-2.5 text-rl-white text-left flex items-center justify-between focus:outline-none focus:border-rl-space-blue/50 hover:bg-rl-white/10 transition-colors ${options.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{selectedOption?.label || (options.length === 0 ? 'No members available' : 'Select...')}</span>
        <ChevronDown className={`w-4 h-4 text-rl-light-grey/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-rl-black border border-rl-white/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                value === option.value
                  ? 'bg-rl-space-blue/20 text-rl-space-blue'
                  : 'text-rl-white hover:bg-rl-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminTeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'tasks' | 'overview'>('overview');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [memberStatuses, setMemberStatuses] = useState<Map<string, DashboardStatus>>(new Map());
  const [memberTasks, setMemberTasks] = useState<TeamMemberTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedMemberStatus, setSelectedMemberStatus] = useState<DashboardStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<TeamMemberTask | null>(null);

  // Form states
  const [memberFormData, setMemberFormData] = useState({
    uid: '',
    email: '',
    name: '',
    password: '',
    role: '',
    division: '',
  });

  const [statusFormData, setStatusFormData] = useState({
    status_title: '',
    status_description: '',
    progress_percentage: 0,
    priority: 'medium' as const,
    current_status: 'pending',
  });

  const [taskFormData, setTaskFormData] = useState({
    task_title: '',
    task_description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    due_date: '',
    member_id: '',
    task_status: 'assigned' as 'assigned' | 'in-progress' | 'completed' | 'on-hold',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;

      if (membersData) {
        setTeamMembers(membersData);

        // Fetch dashboard statuses for all members
        const { data: statusesData } = await supabase
          .from('team_member_dashboard_status')
          .select('*');

        if (statusesData) {
          const statusMap = new Map();
          statusesData.forEach(status => {
            statusMap.set(status.member_id, status);
          });
          setMemberStatuses(statusMap);
        }
      }

      // Fetch all tasks
      const { data: tasksData } = await supabase
        .from('team_member_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksData) {
        setMemberTasks(tasksData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase || !memberFormData.uid || !memberFormData.email || !memberFormData.name) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          uid: memberFormData.uid,
          email: memberFormData.email,
          name: memberFormData.name,
          password_hash: memberFormData.password || 'default',
          role: memberFormData.role,
          division: memberFormData.division,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTeamMembers([data, ...teamMembers]);
        setIsAddMemberModalOpen(false);
        setMemberFormData({ uid: '', email: '', name: '', password: '', role: '', division: '' });

        // Create default dashboard status
        await supabase.from('team_member_dashboard_status').insert({
          member_id: data.id,
          current_status: 'pending',
          status_title: 'Mission Briefing',
          status_description: 'Awaiting assignment briefing',
          progress_percentage: 0,
          priority: 'medium',
        });
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding team member');
    }
  };

  const handleUpdateMemberStatus = async (memberId: string) => {
    if (!supabase) return;

    const status = memberStatuses.get(memberId);
    if (!status) return;

    try {
      const { error } = await supabase
        .from('team_member_dashboard_status')
        .update(statusFormData)
        .eq('id', status.id);

      if (error) throw error;

      const updatedStatus = { ...status, ...statusFormData };
      const newMap = new Map(memberStatuses);
      newMap.set(memberId, updatedStatus);
      setMemberStatuses(newMap);
      setSelectedMember(null);
      setSelectedMemberStatus(null);
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('Error updating member status');
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase || !taskFormData.member_id || !taskFormData.task_title) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('team_member_tasks')
        .insert({
          member_id: taskFormData.member_id,
          task_title: taskFormData.task_title,
          task_description: taskFormData.task_description,
          priority: taskFormData.priority,
          due_date: taskFormData.due_date || null,
          task_status: taskFormData.task_status || 'assigned',
          completion_percentage: 0,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMemberTasks([data, ...memberTasks]);
        setIsTaskModalOpen(false);
        setTaskFormData({
          task_title: '',
          task_description: '',
          priority: 'medium',
          due_date: '',
          member_id: '',
          task_status: 'assigned',
        });
      }
    } catch (error: any) {
      console.error('Error assigning task:', error);
      alert('Error assigning task: ' + (error.message || 'Unknown error'));
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase || !selectedTask) {
      alert('No task selected');
      return;
    }

    console.log('Updating task:', selectedTask.id);
    console.log('Form data:', taskFormData);

    try {
      const updateData = {
        task_title: taskFormData.task_title,
        task_description: taskFormData.task_description,
        priority: taskFormData.priority,
        due_date: taskFormData.due_date || null,
        task_status: taskFormData.task_status,
        member_id: taskFormData.member_id,
      };
      console.log('Update payload:', updateData);

      const { data, error } = await supabase
        .from('team_member_tasks')
        .update(updateData)
        .eq('id', selectedTask.id)
        .select()
        .single();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Task updated successfully:', data);
        setMemberTasks(memberTasks.map(t => t.id === selectedTask.id ? data : t));
        setIsEditTaskModalOpen(false);
        setSelectedTask(null);
        setTaskFormData({
          task_title: '',
          task_description: '',
          priority: 'medium',
          due_date: '',
          member_id: '',
          task_status: 'assigned',
        });
        alert('Task updated successfully!');
      } else {
        console.warn('No data returned from update');
        alert('Update may have failed - no data returned');
      }
    } catch (error: any) {
      console.error('Error updating task:', error);
      alert('Error updating task: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!supabase || !window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const { error } = await supabase.from('team_members').delete().eq('id', memberId);

      if (error) throw error;

      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      const newMap = new Map(memberStatuses);
      newMap.delete(memberId);
      setMemberStatuses(newMap);
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error deleting team member');
    }
  };

  const handleActivateMember = async (memberId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'active' })
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(teamMembers.map(m => m.id === memberId ? { ...m, status: 'active' } : m));
    } catch (error) {
      console.error('Error activating member:', error);
      alert('Error activating member');
    }
  };

  const filteredMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksForMember = (memberId: string) => memberTasks.filter(t => t.member_id === memberId);

  if (loading) {
    return (
      <div className="min-h-screen bg-rl-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rl-space-blue/20 border-t-rl-space-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-rl-light-grey/60 font-heading">Loading team management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rl-black">
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="pt-12 px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-4 h-4 bg-rl-space-blue rounded-full animate-pulse"></div>
            <h1 className="text-4xl lg:text-5xl font-heading font-black text-rl-white tracking-tighter uppercase">Team Management</h1>
          </div>
          <p className="text-rl-light-grey/60 font-heading text-sm tracking-widest">Member Administration • Task Assignment • Status Tracking</p>
        </div>

        {/* Tabs */}
        <div className="px-6 lg:px-8 mb-6 border-b border-rl-white/10">
          <div className="flex gap-6">
            {(['overview', 'members', 'tasks'] as const).map(tabName => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-3 font-heading font-semibold text-sm tracking-widest uppercase transition-all border-b-2 ${
                  activeTab === tabName
                    ? 'border-rl-space-blue text-rl-space-blue'
                    : 'border-transparent text-rl-light-grey/60 hover:text-rl-white'
                }`}
              >
                {tabName === 'overview' ? 'Overview' : tabName === 'members' ? 'Members' : 'Tasks'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 lg:px-8 pb-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Users className="w-6 h-6 text-rl-space-blue" />
                    <span className="text-2xl font-black text-rl-white">{teamMembers.length}</span>
                  </div>
                  <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest">Total Members</p>
                </div>

                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-2xl font-black text-emerald-400">{teamMembers.filter(m => m.status === 'active').length}</span>
                  </div>
                  <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest">Active Members</p>
                </div>

                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Target className="w-6 h-6 text-rl-space-blue" />
                    <span className="text-2xl font-black text-rl-white">{memberTasks.length}</span>
                  </div>
                  <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest">Total Tasks</p>
                </div>

                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <CheckSquare className="w-6 h-6 text-emerald-400" />
                    <span className="text-2xl font-black text-emerald-400">{memberTasks.filter(t => t.task_status === 'completed').length}</span>
                  </div>
                  <p className="text-rl-light-grey/60 font-heading text-xs tracking-widest">Completed</p>
                </div>
              </div>

              {/* Recent Members */}
              <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
                <h3 className="text-lg font-heading font-bold text-rl-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-rl-space-blue" />
                  Recent Members
                </h3>

                <div className="space-y-3">
                  {teamMembers.slice(0, 5).map(member => {
                    const status = memberStatuses.get(member.id);
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-rl-black/40 rounded-lg border border-rl-white/10">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rl-space-blue/30 to-blue-600/30 border border-rl-space-blue/30 flex items-center justify-center">
                              <span className="text-xs font-bold text-rl-space-blue">{member.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-rl-white">{member.name}</h4>
                              <p className="text-rl-light-grey/60 text-xs">{member.role} • {member.division}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-xs font-heading px-2 py-1 rounded border ${member.status === 'active' ? 'bg-green-400/10 border-green-400/30 text-green-400' : 'bg-amber-400/10 border-amber-400/30 text-amber-400'}`}>
                              {member.status.toUpperCase()}
                            </p>
                          </div>
                          {status && (
                            <div className="text-right">
                              <div className="w-24 h-2 bg-rl-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-rl-space-blue" style={{ width: `${status.progress_percentage}%` }} />
                              </div>
                              <p className="text-xs text-rl-light-grey/60 mt-1">{status.progress_percentage}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Search & Add */}
              <div className="flex gap-4 items-end">
                <div className="flex-1 relative">
                  <label className="block text-sm text-rl-light-grey/70 mb-2 font-heading">Search Members</label>
                  <Search className="absolute left-3 top-10 w-4 h-4 text-rl-light-grey/50 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or UID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 bg-rl-white/5 border border-rl-white/20 rounded-lg pl-10 pr-4 text-rl-white placeholder-rl-light-grey/50 focus:outline-none focus:border-rl-space-blue/50"
                  />
                </div>

                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rl-space-blue to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-heading font-semibold rounded-lg transition-all whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-rl-light-grey/20 mx-auto mb-3" />
                    <p className="text-rl-light-grey/60 font-heading">No members found</p>
                  </div>
                ) : (
                  filteredMembers.map(member => {
                    const status = memberStatuses.get(member.id);
                    const memberTaskCount = getTasksForMember(member.id).length;

                    return (
                      <div key={member.id} className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-5 group hover:bg-rl-white/10 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          {/* Member Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rl-space-blue/30 to-blue-600/30 border border-rl-space-blue/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-rl-space-blue">{member.name.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-heading font-bold text-rl-white text-base">{member.name}</h4>
                                <p className="text-rl-light-grey/60 text-sm">{member.role}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-rl-light-grey/60">
                              <span>{member.email}</span>
                              <span>•</span>
                              <span>{member.division}</span>
                              <span>•</span>
                              <span>UID: {member.uid}</span>
                            </div>
                          </div>

                          {/* Status & Stats */}
                          <div className="flex items-center gap-6 flex-shrink-0">
                            <div className="text-right">
                              <p className={`text-xs font-heading px-3 py-1 rounded-lg border mb-2 whitespace-nowrap ${
                                member.status === 'active'
                                  ? 'bg-green-400/10 border-green-400/30 text-green-400'
                                  : member.status === 'pending'
                                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                                  : 'bg-slate-400/10 border-slate-400/30 text-slate-400'
                              }`}>
                                {member.status.toUpperCase()}
                              </p>

                              <div className="flex items-center gap-2 text-xs">
                                <Target className="w-3 h-3 text-rl-space-blue" />
                                <span className="text-rl-light-grey/60">{memberTaskCount} tasks</span>
                              </div>
                            </div>

                            {status && (
                              <div className="text-center hidden sm:block">
                                <div className="w-20 h-2 bg-rl-white/10 rounded-full overflow-hidden mb-1">
                                  <div className="h-full bg-rl-space-blue" style={{ width: `${status.progress_percentage}%` }} />
                                </div>
                                <p className="text-xs text-rl-light-grey/60">{status.progress_percentage}%</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                              {member.status === 'pending' && (
                                <button
                                  onClick={() => handleActivateMember(member.id)}
                                  className="px-3 py-1.5 text-xs font-heading bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors whitespace-nowrap"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedMember(member);
                                  setSelectedMemberStatus(status || null);
                                  setStatusFormData({
                                    status_title: status?.status_title || '',
                                    status_description: status?.status_description || '',
                                    progress_percentage: status?.progress_percentage || 0,
                                    priority: (status?.priority as any) || 'medium',
                                    current_status: status?.current_status || 'pending',
                                  });
                                }}
                                className="px-3 py-1.5 text-xs font-heading bg-rl-space-blue/10 border border-rl-space-blue/30 text-rl-space-blue hover:bg-rl-space-blue/20 rounded-lg transition-colors"
                              >
                                Status
                              </button>
                              <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="px-3 py-1.5 text-xs font-heading bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Assign Task Button */}
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rl-space-blue to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-heading font-semibold rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Assign Task
              </button>

              {/* Tasks List */}
              <div className="space-y-3">
                {memberTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-rl-light-grey/20 mx-auto mb-3" />
                    <p className="text-rl-light-grey/60 font-heading">No tasks assigned yet</p>
                  </div>
                ) : (
                  memberTasks.map(task => {
                    const memberName = teamMembers.find(m => m.id === task.member_id)?.name || 'Unknown';

                    return (
                      <div key={task.id} className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h4 className="font-heading font-bold text-rl-white text-base mb-1">{task.task_title}</h4>
                            <p className="text-rl-light-grey/60 text-sm line-clamp-2">{task.task_description}</p>
                          </div>

                          <span className={`text-xs font-heading px-2 py-1 rounded border whitespace-nowrap ${PRIORITIES[task.priority].bg} ${PRIORITIES[task.priority].border} ${PRIORITIES[task.priority].color}`}>
                            {PRIORITIES[task.priority].label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-6 h-6 rounded-full bg-rl-space-blue/20 border border-rl-space-blue/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-rl-space-blue text-center">{memberName.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <span className="text-rl-light-grey/60">{memberName}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-rl-light-grey/60 mb-1">Progress</p>
                              <div className="w-24 h-1.5 bg-rl-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-rl-space-blue" style={{ width: `${task.completion_percentage}%` }} />
                              </div>
                            </div>

                            <span className={`text-xs font-heading px-2 py-1 rounded border whitespace-nowrap ${
                              task.task_status === 'completed'
                                ? 'bg-green-400/10 border-green-400/30 text-green-400'
                                : task.task_status === 'in-progress'
                                ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                                : 'bg-blue-400/10 border-blue-400/30 text-blue-400'
                            }`}>
                              {task.task_status.toUpperCase()}
                            </span>

                            {/* Edit Task Button */}
                            <button
                              onClick={() => {
                                setSelectedTask(task);
                                setTaskFormData({
                                  task_title: task.task_title,
                                  task_description: task.task_description || '',
                                  priority: task.priority,
                                  due_date: task.due_date ? task.due_date.split('T')[0] : '',
                                  member_id: task.member_id,
                                  task_status: task.task_status,
                                });
                                setIsEditTaskModalOpen(true);
                              }}
                              className="px-2 py-1 text-xs font-heading bg-rl-space-blue/10 border border-rl-space-blue/30 text-rl-space-blue hover:bg-rl-space-blue/20 rounded transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-rl-black border border-rl-white/20 rounded-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-rl-white/10">
              <h3 className="text-xl font-heading font-bold text-rl-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rl-space-blue" />
                Add Team Member
              </h3>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="text-rl-light-grey/60 hover:text-rl-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-5 space-y-4">
              <input
                type="text"
                placeholder="UID"
                required
                value={memberFormData.uid}
                onChange={(e) => setMemberFormData({ ...memberFormData, uid: e.target.value })}
                className="w-full bg-rl-white/5 border border-rl-white/20 rounded-lg px-3 py-2.5 text-rl-white placeholder-rl-light-grey/50 focus:outline-none focus:border-rl-space-blue/50"
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={memberFormData.email}
                onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                className="w-full bg-rl-white/5 border border-rl-white/20 rounded-lg px-3 py-2.5 text-rl-white placeholder-rl-light-grey/50 focus:outline-none focus:border-rl-space-blue/50"
              />

              <input
                type="text"
                placeholder="Full Name"
                required
                value={memberFormData.name}
                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                className="w-full bg-rl-white/5 border border-rl-white/20 rounded-lg px-3 py-2.5 text-rl-white placeholder-rl-light-grey/50 focus:outline-none focus:border-rl-space-blue/50"
              />

              <input
                type="password"
                placeholder="Password (optional)"
                value={memberFormData.password}
                onChange={(e) => setMemberFormData({ ...memberFormData, password: e.target.value })}
                className="w-full bg-rl-white/5 border border-rl-white/20 rounded-lg px-3 py-2.5 text-rl-white placeholder-rl-light-grey/50 focus:outline-none focus:border-rl-space-blue/50"
              />

              <input
                type="text"
                placeholder="Role (e.g., Avionics Engineer)"
                value={memberFormData.role}
                onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                className="w-full bg-rl-white/5 border border-rl-white/20 rounded-lg px-3 py-2.5 text-rl-white placeholder-rl-light-grey/50 focus:outline-none focus:border-rl-space-blue/50"
              />

              <input
                type="text"
                placeholder="Division (e.g., Systems, Avionics)"
                value={memberFormData.division}
                onChange={(e) => setMemberFormData({ ...memberFormData, division: e.target.value })}
                className="w-full bg-rl-white/5 border border-rl-white/20 rounded-lg px-3 py-2.5 text-rl-white placeholder-rl-light-grey/50 focus:outline-none focus:border-rl-space-blue/50"
              />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddMemberModalOpen(false)} className="flex-1 py-2.5 bg-rl-white/5 border border-rl-white/20 rounded-lg text-rl-white hover:bg-rl-white/10 transition-colors font-heading">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-rl-space-blue to-blue-600 rounded-lg text-white font-heading font-semibold hover:from-blue-400 hover:to-blue-500 transition-all">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Member Status Modal */}
      {selectedMember && selectedMemberStatus && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}>
          <div 
            className="bg-rl-black border-2 border-rl-space-blue rounded-xl" 
            style={{ width: '400px', maxWidth: '90vw', padding: '24px', boxShadow: '0 0 30px rgba(0,82,255,0.5)' }}
          >
            <h3 className="text-xl font-heading font-bold text-rl-space-blue mb-6">Update Status: {selectedMember.name}</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateMemberStatus(selectedMember.id); }} className="space-y-4">
              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Status Title</label>
                <input
                  type="text"
                  placeholder="Status Title"
                  value={statusFormData.status_title}
                  onChange={(e) => setStatusFormData({ ...statusFormData, status_title: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Description</label>
                <textarea
                  placeholder="Status Description"
                  rows={3}
                  value={statusFormData.status_description}
                  onChange={(e) => setStatusFormData({ ...statusFormData, status_description: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Progress: {statusFormData.progress_percentage}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={statusFormData.progress_percentage}
                  onChange={(e) => setStatusFormData({ ...statusFormData, progress_percentage: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Priority</label>
                <select
                  value={statusFormData.priority}
                  onChange={(e) => setStatusFormData({ ...statusFormData, priority: e.target.value as any })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                >
                  <option value="low" className="bg-rl-black">Low</option>
                  <option value="medium" className="bg-rl-black">Medium</option>
                  <option value="high" className="bg-rl-black">High</option>
                  <option value="urgent" className="bg-rl-black">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Current Status</label>
                <select
                  value={statusFormData.current_status}
                  onChange={(e) => setStatusFormData({ ...statusFormData, current_status: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                >
                  <option value="pending" className="bg-rl-black">Pending</option>
                  <option value="active" className="bg-rl-black">Active</option>
                  <option value="on-hold" className="bg-rl-black">On Hold</option>
                  <option value="completed" className="bg-rl-black">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setSelectedMember(null); setSelectedMemberStatus(null); }} 
                  className="flex-1 py-3 bg-rl-white/10 border border-rl-white/30 rounded-lg text-rl-white font-heading"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-rl-space-blue rounded-lg text-white font-heading font-bold"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}>
          <div 
            className="bg-rl-black border-2 border-rl-space-blue rounded-xl" 
            style={{ width: '400px', maxWidth: '90vw', padding: '24px', boxShadow: '0 0 30px rgba(0,82,255,0.5)' }}
          >
            <h3 className="text-xl font-heading font-bold text-rl-space-blue mb-6">Assign New Task</h3>
            
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Member</label>
                <select
                  value={taskFormData.member_id}
                  onChange={(e) => setTaskFormData({ ...taskFormData, member_id: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                  required
                >
                  <option value="" className="bg-rl-black">Select member...</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id} className="bg-rl-black">{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  required
                  value={taskFormData.task_title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, task_title: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Description</label>
                <textarea
                  placeholder="Enter description"
                  rows={3}
                  value={taskFormData.task_description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, task_description: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Due Date (Optional)</label>
                <input
                  type="date"
                  value={taskFormData.due_date}
                  onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Status</label>
                <select
                  value={taskFormData.task_status || 'assigned'}
                  onChange={(e) => setTaskFormData({ ...taskFormData, task_status: e.target.value as any })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                >
                  <option value="assigned" className="bg-rl-black">Assigned</option>
                  <option value="in-progress" className="bg-rl-black">In Progress</option>
                  <option value="completed" className="bg-rl-black">Completed</option>
                  <option value="on-hold" className="bg-rl-black">On Hold</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsTaskModalOpen(false)} 
                  className="flex-1 py-3 bg-rl-white/10 border border-rl-white/30 rounded-lg text-rl-white font-heading"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-rl-space-blue rounded-lg text-white font-heading font-bold"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}>
          <div 
            className="bg-rl-black border-2 border-rl-space-blue rounded-xl" 
            style={{ width: '400px', maxWidth: '90vw', padding: '24px', boxShadow: '0 0 30px rgba(0,82,255,0.5)' }}
          >
            <h3 className="text-xl font-heading font-bold text-rl-space-blue mb-6">Edit Task</h3>
            
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Member</label>
                <select
                  value={taskFormData.member_id}
                  onChange={(e) => setTaskFormData({ ...taskFormData, member_id: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                  required
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id} className="bg-rl-black">{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  required
                  value={taskFormData.task_title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, task_title: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Description</label>
                <textarea
                  placeholder="Enter description"
                  rows={3}
                  value={taskFormData.task_description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, task_description: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Due Date (Optional)</label>
                <input
                  type="date"
                  value={taskFormData.due_date}
                  onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                />
              </div>

              <div>
                <label className="block text-sm text-rl-light-grey mb-2">Status</label>
                <select
                  value={taskFormData.task_status || 'assigned'}
                  onChange={(e) => setTaskFormData({ ...taskFormData, task_status: e.target.value as any })}
                  className="w-full bg-rl-white/10 border border-rl-white/30 rounded-lg px-3 py-3 text-rl-white"
                >
                  <option value="assigned" className="bg-rl-black">Assigned</option>
                  <option value="in-progress" className="bg-rl-black">In Progress</option>
                  <option value="completed" className="bg-rl-black">Completed</option>
                  <option value="on-hold" className="bg-rl-black">On Hold</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditTaskModalOpen(false);
                    setSelectedTask(null);
                  }} 
                  className="flex-1 py-3 bg-rl-white/10 border border-rl-white/30 rounded-lg text-rl-white font-heading"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-rl-space-blue rounded-lg text-white font-heading font-bold"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
