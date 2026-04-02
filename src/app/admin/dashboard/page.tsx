"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Newspaper, Rocket, Users, Bell, Activity, TrendingUp, Calendar, AlertCircle, Zap, Globe, BarChart3, Clock, Target, Settings, Satellite, Star, Telescope, Radio, Sparkles, Zap as Bolt, Flame, Sun, Moon } from 'lucide-react';

// SVG space icons for mission context
const SPACE_ICONS = [Rocket, Satellite, Star, Sun, Moon, Telescope, Radio, Sparkles, Bolt, Flame];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMissions: 0,
    activeMissions: 0,
    totalNews: 0,
    recentNews: 0,
    systemStatus: 'operational'
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [MissionIcon, setMissionIcon] = useState<typeof Rocket>(Rocket);

  useEffect(() => {
    fetchDashboardData();
    // Generate random icon for mission card on each sign-in
    const randomIcon = SPACE_ICONS[Math.floor(Math.random() * SPACE_ICONS.length)];
    setMissionIcon(randomIcon);
  }, []);

  const fetchDashboardData = async () => {
    if (!supabase) return;
    // Fetch missions data
    const { data: missions } = await supabase.from('missions').select('*');
    const { data: news } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(5);
    
    if (missions) {
      const active = missions.filter((m: any) => m.status === 'In Progress').length;
      setStats(prev => ({
        ...prev,
        totalMissions: missions.length,
        activeMissions: active
      }));
    }
    
    if (news) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recent = news.filter((n: any) => new Date(n.created_at) >= oneWeekAgo).length;
      setStats(prev => ({
        ...prev,
        totalNews: news.length,
        recentNews: recent
      }));
      setRecentActivity(news);
    }
  };

  return (
    <div className="min-h-screen bg-rl-black">
      {/* Header Section - Professional Aerospace Theme */}
      <div className="mb-12 pt-8">
        <div className="pt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-4 h-4 bg-rl-space-blue rounded-full animate-pulse"></div>
            <h1 className="text-4xl lg:text-5xl font-heading font-black text-rl-white tracking-tighter uppercase">Mission Control Center</h1>
          </div>
          <p className="text-rl-light-grey/60 font-heading text-sm tracking-widest mb-2">Aerospace Operations Division • Flight Systems Management</p>
          <p className="text-rl-light-grey/40 font-heading text-xs tracking-widest">Real-time Mission Monitoring • Launch Vehicle Operations • Space Systems Control</p>
        </div>

        {/* System Status Bar */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-heading text-sm tracking-widest uppercase">All Systems Operational</span>
            </div>
            <div className="flex items-center gap-2 text-rl-white/60 text-sm">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <MissionIcon className="w-8 h-8 text-rl-space-blue" />
              <span className="text-2xl font-black text-rl-white">{stats.totalMissions}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Launch Vehicles</h3>
            <div className="text-xs text-rl-white/40">Total fleet inventory</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-black text-rl-white">{stats.activeMissions}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Active Missions</h3>
            <div className="text-xs text-rl-white/40">Currently deployed</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Newspaper className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-black text-rl-white">{stats.totalNews}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Mission Reports</h3>
            <div className="text-xs text-rl-white/40">Published briefings</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-black text-rl-white">{stats.recentNews}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">This Period</h3>
            <div className="text-xs text-rl-white/40">Recent operations</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Management Modules - Takes 2 columns */}
          <div className="xl:col-span-2">
            <h2 className="text-2xl font-heading font-black text-rl-white mb-6 tracking-tighter uppercase">Mission Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/admin/missions" className="group">
                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 hover:border-rl-space-blue/50 transition-all h-full shadow-lg backdrop-blur-sm group-hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-4">
                    <MissionIcon className="w-12 h-12 text-rl-space-blue group-hover:scale-110 transition-transform" />
                    <div className="w-2 h-2 bg-rl-space-blue rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2 text-rl-white">Launch Operations</h3>
                  <p className="text-rl-white/60 text-sm mb-4">Manage launch vehicle configurations, flight trajectories, and mission parameters.</p>
                  <div className="flex items-center gap-2 text-rl-space-blue text-xs font-heading tracking-widest uppercase">
                    <span>Access Systems</span>
                    <BarChart3 className="w-3 h-3" />
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/news" className="group">
                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 hover:border-rl-space-blue/50 transition-all h-full shadow-lg backdrop-blur-sm group-hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-4">
                    <Newspaper className="w-12 h-12 text-green-400 group-hover:scale-110 transition-transform" />
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2 text-rl-white">Mission Communications</h3>
                  <p className="text-rl-white/60 text-sm mb-4">Publish mission briefings, status reports, and aerospace communications.</p>
                  <div className="flex items-center gap-2 text-rl-space-blue text-xs font-heading tracking-widest uppercase">
                    <span>Access Systems</span>
                    <BarChart3 className="w-3 h-3" />
                  </div>
                </div>
              </Link>

              <div className="group">
                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-all h-full shadow-lg backdrop-blur-sm opacity-60">
                  <div className="flex items-start justify-between mb-4">
                    <Settings className="w-12 h-12 text-rl-white/40 group-hover:scale-110 transition-transform" />
                    <div className="w-2 h-2 bg-rl-white/20 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2 text-rl-white/60">System Settings</h3>
                  <p className="text-rl-white/40 text-sm mb-4">Configure system parameters, integrations, and security protocols.</p>
                  <div className="flex items-center gap-2 text-rl-white/20 text-xs font-heading tracking-widest uppercase">
                    <span>Coming Soon</span>
                    <AlertCircle className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <Link href="/admin/team" className="group">
                <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 hover:border-rl-space-blue/50 transition-all h-full shadow-lg backdrop-blur-sm group-hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-4">
                    <Users className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform" />
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-2 text-rl-white">Team</h3>
                  <p className="text-rl-white/60 text-sm mb-4">Manage aerospace team roles, mission assignments, and crew operations with task board.</p>
                  <div className="flex items-center gap-2 text-orange-400 text-xs font-heading tracking-widest uppercase">
                    <span>Access Module</span>
                    <BarChart3 className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="xl:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-rl-space-blue" />
              <h3 className="text-lg font-heading font-black text-rl-white uppercase tracking-tighter">Activity Log</h3>
            </div>
            
            <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, index) => (
                    <div key={index} className="flex gap-3 pb-4 border-b border-rl-white/5 last:border-0">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-rl-white font-medium mb-1 truncate">{item.title}</div>
                        <div className="text-xs text-rl-white/40 font-heading uppercase tracking-widest">
                          News Published • {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-rl-white/20 text-sm mb-2">No recent activity</div>
                    <div className="text-rl-white/10 text-xs">System activity will appear here</div>
                  </div>
                )}
              </div>
              
              {/* Quick Metrics */}
              <div className="mt-6 pt-6 border-t border-rl-white/10">
                <h4 className="text-xs font-heading text-rl-white/60 tracking-widest uppercase mb-4">System Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-rl-white/40">Uptime</span>
                    <span className="text-xs font-bold text-green-400">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-rl-white/40">Response Time</span>
                    <span className="text-xs font-bold text-rl-white">12ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-rl-white/40">Storage Used</span>
                    <span className="text-xs font-bold text-rl-white">2.4GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
