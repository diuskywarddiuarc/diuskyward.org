"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Upload, Search, Filter, Activity, TrendingUp, Clock, Calendar, BarChart3, Users, Target, AlertCircle, Edit, Download, CheckSquare, Square, Rocket, Satellite, Star, Sun, Moon, Telescope, Radio, Sparkles, Zap as Bolt, Flame } from 'lucide-react';

// SVG space icons for mission context
const SPACE_ICONS = [Rocket, Satellite, Star, Sun, Moon, Telescope, Radio, Sparkles, Bolt, Flame];

export default function ManageMissions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '', 
    description: '', 
    detailed_content: '', 
    cover_image: '', 
    status: 'Planning', 
    launch_date: '',
    // New fields for dynamic mission pages
    mission_type: 'rocket', // rocket, satellite, balloon, test
    category: 'mission', // mission, test, demonstration
    hero_subtitle: '', // Hero subtitle (e.g., "Completed Test")
    hero_background_image: '', // Hero background image
    overview_title: '', // Overview section title
    overview_description: '', // Overview description
    key_metrics: [], // Array of {label, value} objects
    test_outcomes: [], // Array of {icon, title, description} objects
    expected_outcome: '', // Expected outcome description
    mission_objective: '', // Mission objective
    right_side_image: '', // Image for right side of hero
    status_display: '', // Custom status text for display
    additional_sections: [] // Additional content sections
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [rightSideImageFile, setRightSideImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, planning: 0 });
  const [MissionIcon, setMissionIcon] = useState<typeof Rocket>(Rocket);

  useEffect(() => {
    fetchMissions();
    // Generate random icon for mission cards on each sign-in
    const randomIcon = SPACE_ICONS[Math.floor(Math.random() * SPACE_ICONS.length)];
    setMissionIcon(randomIcon);
  }, []);

  useEffect(() => {
    filterAndSortMissions();
  }, [missions, searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    calculateStats();
  }, [missions]);

  const fetchMissions = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('missions').select('*').order('created_at', { ascending: false });
    if (data) {
      setMissions(data);
      setFilteredMissions(data);
    }
  };

  const calculateStats = () => {
    const total = missions.length;
    const active = missions.filter(m => m.status === 'In Progress').length;
    const completed = missions.filter(m => m.status === 'Completed').length;
    const planning = missions.filter(m => m.status === 'Planning').length;
    setStats({ total, active, completed, planning });
  };

  const filterAndSortMissions = () => {
    let filtered = missions;
    
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'launch_date') {
        return new Date(b.launch_date || 0).getTime() - new Date(a.launch_date || 0).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    
    setFilteredMissions(filtered);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setUploading(true);
    let imageUrl = formData.cover_image;
    let rightSideImageUrl = formData.right_side_image;

    // Upload cover image
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, imageFile);
      
      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // Upload right side image
    if (rightSideImageFile) {
      const fileExt = rightSideImageFile.name.split('.').pop();
      const fileName = `right-side-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, rightSideImageFile);
      
      if (uploadError) {
        alert("Right side image upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      rightSideImageUrl = data.publicUrl;
    }

    // Set hero_background_image to be the same as cover_image
    const payload = { 
      ...formData, 
      cover_image: imageUrl, 
      hero_background_image: imageUrl, // Automatically use cover image as hero background
      right_side_image: rightSideImageUrl,
      launch_date: formData.launch_date ? new Date(formData.launch_date).toISOString() : null 
    };
    
    const { error } = await supabase.from('missions').insert([payload]);
    if (!error) {
      setIsCreating(false);
      setFormData({ 
        title: '', 
        slug: '', 
        description: '', 
        detailed_content: '', 
        cover_image: '', 
        status: 'Planning', 
        launch_date: '',
        mission_type: 'rocket',
        category: 'mission',
        hero_subtitle: '',
        hero_background_image: '',
        overview_title: '',
        overview_description: '',
        key_metrics: [],
        test_outcomes: [],
        expected_outcome: '',
        mission_objective: '',
        right_side_image: '',
        status_display: '',
        additional_sections: []
      });
      setImageFile(null);
      setRightSideImageFile(null);
      fetchMissions();
    } else {
      alert("Error mapping mission: " + error.message);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Initiate self-destruct for this mission record?')) {
      if (supabase) {
        await supabase.from('missions').delete().eq('id', id);
        fetchMissions();
      }
    }
  };

  const handleSelectMission = (id: string) => {
    setSelectedMissions(prev => 
      prev.includes(id) 
        ? prev.filter(mId => mId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMissions.length === filteredMissions.length) {
      setSelectedMissions([]);
    } else {
      setSelectedMissions(filteredMissions.map(m => m.id));
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Initiate self-destruct for ${selectedMissions.length} mission records?`)) {
      if (supabase) {
        await supabase.from('missions').delete().in('id', selectedMissions);
        setSelectedMissions([]);
        fetchMissions();
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (supabase) {
      await supabase.from('missions').update({ status: newStatus }).in('id', selectedMissions);
      setSelectedMissions([]);
      fetchMissions();
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const dataToExport = filteredMissions.map(m => ({
      title: m.title,
      slug: m.slug,
      status: m.status,
      launch_date: m.launch_date,
      created_at: m.created_at
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'missions.csv';
      a.click();
    } else {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'missions.json';
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-rl-black">
      {/* Header Section - Added 0.5 inch padding before mission control */}
      <div className="mb-12 pt-8">
        <div className="pt-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-heading font-black text-rl-white mb-2 tracking-tighter uppercase">Mission</h1>
              <p className="text-rl-light-grey/60 font-heading text-sm tracking-widest">Operations Management Dashboard</p>
            </div>
            <button onClick={() => setIsCreating(!isCreating)} disabled={uploading} className="bg-rl-space-blue hover:bg-rl-space-blue/80 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105 shadow-lg shadow-rl-space-blue/20">
              {isCreating ? 'Abort' : <><Plus className="w-5 h-5"/> Initiate Mission</>}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <MissionIcon className="w-8 h-8 text-rl-space-blue" />
              <span className="text-2xl font-black text-rl-white">{stats.total}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Total Missions</h3>
            <div className="text-xs text-rl-white/40">All time records</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-black text-rl-white">{stats.active}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Active</h3>
            <div className="text-xs text-rl-white/40">Currently in progress</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-black text-rl-white">{stats.completed}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Completed</h3>
            <div className="text-xs text-rl-white/40">Mission success</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-black text-rl-white">{stats.planning}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Planning</h3>
            <div className="text-xs text-rl-white/40">In preparation</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
          {/* Bulk Actions Bar */}
          {selectedMissions.length > 0 && (
            <div className="bg-rl-space-blue/10 border border-rl-space-blue/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-rl-space-blue" />
                  <span className="text-rl-space-blue font-heading text-sm tracking-widest uppercase">
                    {selectedMissions.length} Mission{selectedMissions.length > 1 ? 's' : ''} Selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                    className="bg-rl-black/50 border border-rl-white/10 rounded px-3 py-2 text-rl-white text-sm focus:outline-none focus:border-rl-space-blue"
                  >
                    <option value="">Update Status</option>
                    <option value="Planning">Set Planning</option>
                    <option value="In Progress">Set In Progress</option>
                    <option value="Completed">Set Completed</option>
                    <option value="Archived">Set Archived</option>
                  </select>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg text-sm font-heading tracking-widest uppercase transition-colors"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Main Search Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rl-white/40 z-10" />
                <input
                  type="text"
                  placeholder="Search missions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 pl-12 pr-4 text-rl-white placeholder-rl-white/40 focus:outline-none focus:border-rl-space-blue focus:bg-rl-black/70 transition-all"
                />
              </div>
              <div className="flex gap-3 lg:gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-rl-black/50 border border-rl-white/10 rounded-lg px-4 py-3 text-rl-white focus:outline-none focus:border-rl-space-blue focus:bg-rl-black/70 transition-all min-w-[140px] appearance-none cursor-pointer hover:border-rl-white/20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-rl-black/50 border border-rl-white/10 rounded-lg px-4 py-3 text-rl-white focus:outline-none focus:border-rl-space-blue focus:bg-rl-black/70 transition-all min-w-[140px] appearance-none cursor-pointer hover:border-rl-white/20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="created_at">Recent First</option>
                  <option value="launch_date">Launch Date</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 text-sm text-rl-white/60">
                <Calendar className="w-4 h-4" />
                <span>Date Range:</span>
              </div>
              <div className="flex gap-2 flex-1">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-rl-black/50 border border-rl-white/10 rounded-lg px-3 py-2 text-rl-white text-sm focus:outline-none focus:border-rl-space-blue"
                />
                <span className="text-rl-white/40">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-rl-black/50 border border-rl-white/10 rounded-lg px-3 py-2 text-rl-white text-sm focus:outline-none focus:border-rl-space-blue"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 px-3 py-2 rounded-lg text-sm font-heading tracking-widest uppercase transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 px-3 py-2 rounded-lg text-sm font-heading tracking-widest uppercase transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-rl-white/5 border border-rl-space-blue/30 p-6 rounded-xl mb-8 space-y-6">
          {/* Basic Information */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Basic Mission Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Mission Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="e.g., BALLOON FLIGHT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Identifier Slug</label>
                <input type="text" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="e.g., avionics-high-alt-balloon" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Mission Type</label>
                <select value={formData.mission_type} onChange={(e) => setFormData({...formData, mission_type: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue">
                  <option value="rocket">Rocket Launch</option>
                  <option value="satellite">Satellite Mission</option>
                  <option value="balloon">High-Altitude Balloon</option>
                  <option value="test">Test Flight</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue">
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Target Launch Date</label>
                <input type="date" value={formData.launch_date} onChange={(e) => setFormData({...formData, launch_date: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Short Description</label>
                <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Brief description for mission cards" />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Hero Section Configuration</h3>
            <p className="text-rl-light-grey/60 text-sm mb-4">
              <span className="text-rl-space-blue">Note:</span> Hero Background Image will automatically use the same image as Mission Media (Cover Image).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Hero Subtitle</label>
                <input type="text" value={formData.hero_subtitle} onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="e.g., Completed Test" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Status Display Text</label>
                <input type="text" value={formData.status_display} onChange={(e) => setFormData({...formData, status_display: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="e.g., Mission Success" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Upload Right Side Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-rl-space-blue/20 border border-rl-space-blue/50 hover:bg-rl-space-blue/40 text-rl-space-blue font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors w-full justify-center lg:w-1/2">
                    <Upload className="w-4 h-4" /> 
                    <span className="truncate max-w-[200px]">{rightSideImageFile ? rightSideImageFile.name : 'Choose Right Side Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setRightSideImageFile(e.target.files ? e.target.files[0] : null)} />
                  </label>
                  {rightSideImageFile && (
                    <button type="button" onClick={() => setRightSideImageFile(null)} className="text-red-400 hover:text-red-300 text-sm">Clear</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Overview Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Overview Title</label>
                <input type="text" value={formData.overview_title} onChange={(e) => setFormData({...formData, overview_title: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="e.g., Stratospheric Validation" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Overview Description</label>
                <textarea rows={4} value={formData.overview_description} onChange={(e) => setFormData({...formData, overview_description: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Detailed mission overview description"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Mission Objective</label>
                <textarea rows={3} value={formData.mission_objective} onChange={(e) => setFormData({...formData, mission_objective: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Primary mission objective"></textarea>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Key Metrics (JSON Format)</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Metrics Array</label>
              <textarea rows={3} value={JSON.stringify(formData.key_metrics || [], null, 2)} onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormData({...formData, key_metrics: parsed});
                } catch (err) {
                  // Invalid JSON, keep as is
                }
              }} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue font-mono text-sm" placeholder="Example: [{&quot;label&quot;: &quot;Burst Altitude&quot;, &quot;value&quot;: &quot;30km&quot;}, {&quot;label&quot;: &quot;Minimum Temp&quot;, &quot;value&quot;: &quot;-60°C&quot;}]"></textarea>
              <p className="text-xs text-rl-light-grey/60 mt-1">Format: {'{'}"label": "Label", "value": "Value"{'}'}</p>
            </div>
          </div>

          {/* Test Outcomes */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Test Outcomes (JSON Format)</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Outcomes Array</label>
              <textarea rows={5} value={JSON.stringify(formData.test_outcomes || [], null, 2)} onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormData({...formData, test_outcomes: parsed});
                } catch (err) {
                  // Invalid JSON, keep as is
                }
              }} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue font-mono text-sm" placeholder="Example: [{&quot;icon&quot;: &quot;Cpu&quot;, &quot;title&quot;: &quot;MCU STABILITY&quot;, &quot;description&quot;: &quot;The primary microcontrollers operated flawlessly...&quot;}]"></textarea>
              <p className="text-xs text-rl-light-grey/60 mt-1">Format: {'{'}"icon": "IconName", "title": "Title", "description": "Description"{'}'}</p>
            </div>
          </div>

          {/* Expected Outcome */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Expected Outcome</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Expected Outcome Description</label>
              <textarea rows={3} value={formData.expected_outcome} onChange={(e) => setFormData({...formData, expected_outcome: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="What was expected to be achieved"></textarea>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <h3 className="text-rl-white font-bold mb-4 text-lg">Mission Media</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Upload Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-rl-space-blue/20 border border-rl-space-blue/50 hover:bg-rl-space-blue/40 text-rl-space-blue font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors w-full justify-center lg:w-1/2">
                    <Upload className="w-4 h-4" /> 
                    <span className="truncate max-w-[200px]">{imageFile ? imageFile.name : 'Choose Image File'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
                  </label>
                  {imageFile && (
                    <button type="button" onClick={() => setImageFile(null)} className="text-red-400 hover:text-red-300 text-sm">Clear</button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Detailed Content</label>
                <textarea required rows={6} value={formData.detailed_content} onChange={(e) => setFormData({...formData, detailed_content: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Additional detailed content for the mission"></textarea>
              </div>
            </div>
          </div>

          <button type="submit" disabled={uploading} className="bg-rl-space-blue hover:bg-rl-space-blue/80 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 mt-4 disabled:opacity-50">
            {uploading ? 'Processing...' : <><Save className="w-5 h-5"/> Initialize Mission</>}
          </button>
        </form>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-rl-white/60 font-heading text-sm tracking-widest uppercase">
          Showing {filteredMissions.length} of {missions.length} missions
        </div>
        <div className="flex items-center gap-2 text-rl-white/40 text-sm">
          <BarChart3 className="w-4 h-4" />
          <span>Advanced View</span>
        </div>
      </div>

      {/* Enhanced Mission Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Table - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2 bg-rl-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-rl-white/10 text-sm font-heading uppercase tracking-wider text-rl-white/80">
                <th className="p-4 font-black w-12">
                  <button
                    onClick={handleSelectAll}
                    className="text-rl-white/60 hover:text-rl-space-blue transition-colors"
                    title={selectedMissions.length === filteredMissions.length ? 'Deselect All' : 'Select All'}
                  >
                    {selectedMissions.length === filteredMissions.length ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-black">Mission</th>
                <th className="p-4 font-black hidden lg:table-cell">Status</th>
                <th className="p-4 font-black hidden lg:table-cell">Launch Target</th>
                <th className="p-4 font-black hidden xl:table-cell">Created</th>
                <th className="p-4 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMissions.map((m) => (
                <tr key={m.id} className="hover:bg-rl-white/5 transition-colors group">
                  <td className="p-4">
                    <button
                      onClick={() => handleSelectMission(m.id)}
                      className="text-rl-white/60 hover:text-rl-space-blue transition-colors"
                      title={selectedMissions.includes(m.id) ? 'Deselect Mission' : 'Select Mission'}
                    >
                      {selectedMissions.includes(m.id) ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rl-space-blue/20 rounded-lg flex items-center justify-center group-hover:bg-rl-space-blue/40 transition-colors">
                        <MissionIcon className="w-5 h-5 text-rl-space-blue" />
                      </div>
                      <div>
                        <div className="font-bold text-rl-white mb-1">{m.title}</div>
                        <div className="text-xs text-rl-white/40 font-heading uppercase tracking-widest">{m.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full ${
                      m.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                      m.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 
                      m.status === 'Archived' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-rl-white/70 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {m.launch_date ? new Date(m.launch_date).toLocaleDateString() : 'TBD'}
                    </div>
                  </td>
                  <td className="p-4 text-rl-white/50 hidden xl:table-cell">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => window.open(`/missions/${m.slug}`, '_blank')}
                        className="text-rl-space-blue hover:text-rl-space-blue/80 p-2 hover:bg-rl-white/5 rounded-lg transition-colors"
                        title="View Mission"
                      >
                        <Rocket className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          // Set form data with current mission data for editing
                          setFormData({
                            title: m.title,
                            slug: m.slug,
                            description: m.description,
                            detailed_content: m.detailed_content || '',
                            cover_image: m.cover_image || '',
                            status: m.status,
                            launch_date: m.launch_date ? new Date(m.launch_date).toISOString().split('T')[0] : '',
                            mission_type: m.mission_type || 'rocket',
                            category: m.category || 'mission',
                            hero_subtitle: m.hero_subtitle || '',
                            hero_background_image: m.hero_background_image || '',
                            overview_title: m.overview_title || '',
                            overview_description: m.overview_description || '',
                            key_metrics: m.key_metrics || [],
                            test_outcomes: m.test_outcomes || [],
                            expected_outcome: m.expected_outcome || '',
                            mission_objective: m.mission_objective || '',
                            right_side_image: m.right_side_image || '',
                            status_display: m.status_display || '',
                            additional_sections: m.additional_sections || []
                          });
                          setIsCreating(true);
                        }}
                        className="text-green-400 hover:text-green-300 p-2 hover:bg-green-400/10 rounded-lg transition-colors"
                        title="Update Mission"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id)} 
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete Mission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle className="w-12 h-12 text-rl-white/20" />
                      <div>
                        <div className="text-rl-white/50 font-heading text-sm tracking-widest uppercase mb-2">No Missions Found</div>
                        <div className="text-rl-white/30 text-sm">Try adjusting your search or filter criteria</div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>

        {/* Activity Timeline Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-rl-space-blue" />
              <h3 className="text-lg font-heading font-black text-rl-white uppercase tracking-tighter">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              {/* Sample activity items - in real app this would come from a database */}
              {missions.slice(0, 5).map((mission, index) => (
                <div key={mission.id} className="flex gap-3 pb-4 border-b border-rl-white/5 last:border-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-rl-space-blue rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-rl-white font-medium mb-1 truncate">{mission.title}</div>
                    <div className="text-xs text-rl-white/40 font-heading uppercase tracking-widest">
                      {mission.status} • {new Date(mission.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {missions.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-rl-white/20 text-sm mb-2">No recent activity</div>
                  <div className="text-rl-white/10 text-xs">Mission data will appear here</div>
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-rl-white/10">
              <h4 className="text-xs font-heading text-rl-white/60 tracking-widest uppercase mb-4">Quick Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-rl-white/40">Completion Rate</span>
                  <span className="text-xs font-bold text-rl-white">
                    {missions.length > 0 ? Math.round((stats.completed / missions.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-rl-white/40">Active Rate</span>
                  <span className="text-xs font-bold text-rl-white">
                    {missions.length > 0 ? Math.round((stats.active / missions.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-rl-white/40">This Month</span>
                  <span className="text-xs font-bold text-rl-white">
                    {missions.filter(m => new Date(m.created_at).getMonth() === new Date().getMonth()).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
