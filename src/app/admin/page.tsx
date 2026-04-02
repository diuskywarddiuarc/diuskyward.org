"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Rocket, Shield, Users, Activity, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  const adminSections = [
    {
      title: 'Mission Control',
      description: 'Manage aerospace missions, launches, and flight operations',
      icon: Rocket,
      href: '/admin/missions',
      color: 'from-rl-space-blue to-blue-600'
    },
    {
      title: 'Team Management',
      description: 'Oversee personnel, roles, and team assignments',
      icon: Users,
      href: '/admin/team',
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'News & Communications',
      description: 'Publish press releases and corporate communications',
      icon: Activity,
      href: '/admin/news',
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View performance metrics and operational statistics',
      icon: BarChart3,
      href: '/admin/dashboard',
      color: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-heading font-black text-rl-white mb-4 tracking-tight uppercase">
          Mission Control Center
        </h1>
        <p className="text-xl text-rl-light-grey font-light">
          Aerospace Operations Administration Portal
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Rocket className="w-8 h-8 text-rl-space-blue" />
            <span className="text-2xl font-heading font-bold text-rl-white">12</span>
          </div>
          <span className="text-rl-light-grey text-sm tracking-widest uppercase">Active Missions</span>
        </div>
        
        <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-heading font-bold text-rl-white">48</span>
          </div>
          <span className="text-rl-light-grey text-sm tracking-widest uppercase">Team Members</span>
        </div>
        
        <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-heading font-bold text-rl-white">23</span>
          </div>
          <span className="text-rl-light-grey text-sm tracking-widest uppercase">News Articles</span>
        </div>
        
        <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-heading font-bold text-rl-white">98%</span>
          </div>
          <span className="text-rl-light-grey text-sm tracking-widest uppercase">System Status</span>
        </div>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Link
              key={index}
              href={section.href}
              className="group relative overflow-hidden rounded-xl border border-rl-white/10 bg-gradient-to-br from-rl-white/5 to-rl-white/0 hover:border-rl-space-blue/50 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${section.color}`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-rl-light-grey group-hover:text-rl-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-rl-white mb-3 uppercase tracking-widest">
                  {section.title}
                </h3>
                
                <p className="text-rl-light-grey font-light leading-relaxed">
                  {section.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 border-t border-rl-white/10 pt-8">
        <h2 className="text-2xl font-heading font-bold text-rl-white mb-6 uppercase tracking-widest">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/missions"
            className="bg-rl-space-blue hover:bg-rl-space-blue/80 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <Rocket className="w-5 h-5" />
            New Mission
          </Link>
          
          <Link
            href="/admin/news"
            className="bg-rl-white/10 hover:bg-rl-white/20 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all hover:scale-105 border border-rl-white/10"
          >
            <Activity className="w-5 h-5" />
            Publish News
          </Link>
          
          <Link
            href="/admin/team"
            className="bg-rl-white/10 hover:bg-rl-white/20 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all hover:scale-105 border border-rl-white/10"
          >
            <Users className="w-5 h-5" />
            Manage Team
          </Link>
        </div>
      </div>
    </div>
  );
}
