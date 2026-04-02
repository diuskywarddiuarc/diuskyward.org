"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Upload, Search, Newspaper, Calendar, User, Activity, BarChart3, AlertCircle, Edit, Globe, RefreshCw, Copy, Check } from 'lucide-react';

export default function ManageNews() {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    author: 'DIU Skyward Team',
    cover_image: '',
    status: 'published',
    category: '',
    summary: '',
    seo_title: '',
    seo_description: '',
    meta_keywords: '',
    featured: false,
    tags: [],
    allow_comments: true,
    show_author: true,
    show_date: true,
    author_id: '',
    author_email: '',
    author_role: '',
    external_links: [],
    related_news: [],
    gallery_images: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('published_date');
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, thisYear: 0 });
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [jsonErrors, setJsonErrors] = useState<{[key: string]: string}>({});
  const [jsonRawText, setJsonRawText] = useState({
    tags: '[]',
    external_links: '[]',
    related_news: '[]',
    gallery_images: '[]'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterAndSortNews();
  }, [news, searchTerm, sortBy]);

  useEffect(() => {
    calculateStats();
  }, [news]);

  useEffect(() => {
    if (isCreating) {
      setJsonRawText({
        tags: '[]',
        external_links: '[]',
        related_news: '[]',
        gallery_images: '[]'
      });
    }
  }, [isCreating]);

  const fetchNews = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('news').select('*').order('published_date', { ascending: false });
    if (data) {
      setNews(data);
      setFilteredNews(data);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const thisMonth = news.filter(n => new Date(n.published_date).getMonth() === now.getMonth() && new Date(n.published_date).getFullYear() === now.getFullYear()).length;
    const thisYear = news.filter(n => new Date(n.published_date).getFullYear() === now.getFullYear()).length;
    setStats({ total: news.length, thisMonth, thisYear });
  };

  const filterAndSortNews = () => {
    let filtered = news;
    
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'published_date') {
        return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    
    setFilteredNews(filtered);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const copySlugToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.slug);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
    } catch (err) {
      console.error('Failed to copy slug:', err);
    }
  };

  const regenerateSlug = () => {
    const newSlug = generateSlug(formData.title);
    setFormData({...formData, slug: newSlug});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.author_id && !isValidUUID(formData.author_id)) {
      alert('Invalid Author ID. Please provide a valid UUID.');
      return;
    }

    if (!supabase) return;
    setUploading(true);
    let imageUrl = formData.cover_image;

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

    const newsData = {
      ...formData,
      cover_image: imageUrl
    };

    let error;
    if (editingId) {
      // Update existing news
      const { error: updateError } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', editingId);
      error = updateError;
    } else {
      // Create new news
      const { error: insertError } = await supabase
        .from('news')
        .insert([{
          ...newsData,
          published_date: new Date().toISOString()
        }]);
      error = insertError;
    }

    if (!error) {
      setIsCreating(false);
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        author: 'DIU Skyward Team',
        cover_image: '',
        status: 'published',
        category: '',
        summary: '',
        seo_title: '',
        seo_description: '',
        meta_keywords: '',
        featured: false,
        tags: [],
        allow_comments: true,
        show_author: true,
        show_date: true,
        author_id: '',
        author_email: '',
        author_role: '',
        external_links: [],
        related_news: [],
        gallery_images: []
      });
      setImageFile(null);
      setJsonRawText({
        tags: '[]',
        external_links: '[]',
        related_news: '[]',
        gallery_images: '[]'
      });
      fetchNews();
    } else {
      alert(`Error ${editingId ? 'updating' : 'creating'} news: ` + error.message);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Initiate transmission deletion protocol?')) {
      if (supabase) {
        await supabase.from('news').delete().eq('id', id);
        fetchNews();
      }
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      content: item.content,
      author: item.author,
      cover_image: item.cover_image,
      status: item.status,
      category: item.category,
      summary: item.summary,
      seo_title: item.seo_title,
      seo_description: item.seo_description,
      meta_keywords: item.meta_keywords,
      featured: item.featured,
      tags: item.tags || [],
      allow_comments: item.allow_comments,
      show_author: item.show_author,
      show_date: item.show_date,
      author_id: item.author_id || '',
      author_email: item.author_email || '',
      author_role: item.author_role || '',
      external_links: item.external_links || [],
      related_news: item.related_news || [],
      gallery_images: item.gallery_images || []
    });
    setJsonRawText({
      tags: JSON.stringify(item.tags || [], null, 2),
      external_links: JSON.stringify(item.external_links || [], null, 2),
      related_news: JSON.stringify(item.related_news || [], null, 2),
      gallery_images: JSON.stringify(item.gallery_images || [], null, 2)
    });
    setEditingId(item.id);
    setIsCreating(true);
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      author: 'DIU Skyward Team',
      cover_image: '',
      status: 'published',
      category: '',
      summary: '',
      seo_title: '',
      seo_description: '',
      meta_keywords: '',
      featured: false,
      tags: [],
      allow_comments: true,
      show_author: true,
      show_date: true,
      author_id: '',
      author_email: '',
      author_role: '',
      external_links: [],
      related_news: [],
      gallery_images: []
    });
    setJsonRawText({
      tags: '[]',
      external_links: '[]',
      related_news: '[]',
      gallery_images: '[]'
    });
    setJsonErrors({});
  };

  return (
    <div className="min-h-screen bg-rl-black">
      {/* Header Section - Added 0.5 inch padding before news hub */}
      <div className="mb-12 pt-8">
        <div className="pt-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-heading font-black text-rl-white mb-2 tracking-tighter uppercase">News</h1>
              <p className="text-rl-light-grey/60 font-heading text-sm tracking-widest">Transmission Control Center</p>
            </div>
            <button onClick={() => editingId ? handleCancelEdit() : setIsCreating(!isCreating)} disabled={uploading} className={`${editingId || isCreating ? 'bg-red-600 hover:bg-red-700' : 'bg-rl-space-blue hover:bg-rl-space-blue/80'} text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105 shadow-lg`}>
              {editingId ? 'Cancel Edit' : isCreating ? 'Abort' : <><Plus className="w-5 h-5"/> Create Transmission</>}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Newspaper className="w-8 h-8 text-rl-space-blue" />
              <span className="text-2xl font-black text-rl-white">{stats.total}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Total Transmissions</h3>
            <div className="text-xs text-rl-white/40">All time records</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-black text-rl-white">{stats.thisMonth}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">This Month</h3>
            <div className="text-xs text-rl-white/40">Recent activity</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-black text-rl-white">{stats.thisYear}</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">This Year</h3>
            <div className="text-xs text-rl-white/40">Annual total</div>
          </div>
          
          <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6 hover:bg-rl-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-black text-rl-white">LIVE</span>
            </div>
            <h3 className="text-rl-light-grey/60 font-heading text-xs tracking-widest uppercase mb-1">Broadcast Status</h3>
            <div className="text-xs text-rl-white/40">Systems active</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-rl-white/5 border border-rl-white/10 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rl-white/40 z-10" />
              <input
                type="text"
                placeholder="Search transmissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 pl-12 pr-4 text-rl-white placeholder-rl-white/40 focus:outline-none focus:border-rl-space-blue focus:bg-rl-black/70 transition-all"
              />
            </div>
            <div className="flex gap-3 lg:gap-4">
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
                <option value="published_date">Recent First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-rl-white/5 border border-rl-space-blue/30 p-6 rounded-xl mb-8 space-y-6">
          {/* Form Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-rl-white/10">
            <h2 className="text-2xl font-heading font-black text-rl-white uppercase tracking-tight">
              {editingId ? '✎ Edit Transmission' : '+ Create New Transmission'}
            </h2>
            {editingId && <span className="text-xs font-mono text-rl-white/40 bg-rl-white/5 px-3 py-1 rounded">ID: {editingId.substring(0, 8)}...</span>}
          </div>

          {/* Basic Information */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Transmission Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Enter news title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">URL Slug <span className="text-xs text-rl-light-grey/60">(Auto-generated from title)</span></label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    className="flex-1 bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue font-mono text-sm" 
                    placeholder="news-article-slug" 
                  />
                  <button
                    type="button"
                    onClick={regenerateSlug}
                    className="bg-rl-white/10 hover:bg-rl-white/20 border border-rl-white/10 rounded-lg p-3 text-rl-white/60 hover:text-rl-white transition-all hover:scale-105 flex items-center gap-1 whitespace-nowrap"
                    title="Regenerate slug from title"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Regen</span>
                  </button>
                  <button
                    type="button"
                    onClick={copySlugToClipboard}
                    className="bg-rl-space-blue/20 hover:bg-rl-space-blue/40 border border-rl-space-blue/50 rounded-lg p-3 text-rl-space-blue hover:text-rl-space-blue transition-all hover:scale-105 flex items-center gap-1"
                    title="Copy slug to clipboard"
                  >
                    {copiedSlug ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline text-xs">{copiedSlug ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Author</label>
                <input type="text" required value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Author name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue">
                  <option value="">Select Category</option>
                  <option value="Mission Updates">Mission Updates</option>
                  <option value="Announcements">Announcements</option>
                  <option value="Technology">Technology</option>
                  <option value="Research">Research</option>
                  <option value="Events">Events</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Upload Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 bg-rl-space-blue/20 border border-rl-space-blue/50 hover:bg-rl-space-blue/40 text-rl-space-blue font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors w-full justify-center">
                    <Upload className="w-4 h-4" /> 
                    <span className="truncate max-w-[200px]">{imageFile ? imageFile.name : 'Choose Image File'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
                  </label>
                  {imageFile && (
                    <button type="button" onClick={() => setImageFile(null)} className="text-red-400 hover:text-red-300 text-sm">Clear</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Summary</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Article Summary</label>
              <textarea rows={3} value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Brief summary for previews and SEO"></textarea>
            </div>
          </div>

          {/* Content */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Content</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Transmission Content</label>
              <textarea required rows={8} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Full article content"></textarea>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">SEO Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-rl-white/80 mb-1">SEO Title</label>
                <input type="text" value={formData.seo_title} onChange={(e) => setFormData({...formData, seo_title: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Custom SEO title (optional)" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-rl-white/80 mb-1">SEO Description</label>
                <textarea rows={2} value={formData.seo_description} onChange={(e) => setFormData({...formData, seo_description: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Meta description for search engines"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Meta Keywords</label>
                <input type="text" value={formData.meta_keywords} onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="keyword1, keyword2, keyword3" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Tags (JSON Format)</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Tags Array</label>
              <textarea 
                rows={2} 
                value={jsonRawText.tags} 
                onChange={(e) => {
                  setJsonRawText({...jsonRawText, tags: e.target.value});
                }}
                onBlur={() => {
                  try {
                    const parsed = JSON.parse(jsonRawText.tags);
                    setFormData({...formData, tags: parsed});
                    setJsonErrors({...jsonErrors, tags: ''});
                  } catch (err) {
                    setJsonErrors({...jsonErrors, tags: 'Invalid JSON format'});
                  }
                }}
                className={`w-full bg-rl-black/50 border rounded-lg p-3 text-rl-white focus:outline-none font-mono text-sm transition-all ${jsonErrors.tags ? 'border-red-500/50 focus:border-red-500' : 'border-rl-white/10 focus:border-rl-space-blue'}`}
                placeholder='["tag1", "tag2"]'
              />
              {jsonErrors.tags && <p className="text-xs text-red-400 mt-1">{jsonErrors.tags}</p>}
              <p className="text-xs text-rl-light-grey/60 mt-1">Format: ["tag1", "tag2"]</p>
            </div>
          </div>

          {/* Publication Settings */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Publication Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 bg-rl-black/30 border border-rl-white/10 rounded-lg p-4 cursor-pointer hover:bg-rl-black/50 transition-colors">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 rounded border-rl-white/20 bg-rl-black/50 text-rl-space-blue focus:ring-rl-space-blue" />
                <div>
                  <span className="text-rl-white font-medium">Featured Article</span>
                  <p className="text-xs text-rl-light-grey/60">Highlight this article</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-rl-black/30 border border-rl-white/10 rounded-lg p-4 cursor-pointer hover:bg-rl-black/50 transition-colors">
                <input type="checkbox" checked={formData.allow_comments} onChange={(e) => setFormData({...formData, allow_comments: e.target.checked})} className="w-5 h-5 rounded border-rl-white/20 bg-rl-black/50 text-rl-space-blue focus:ring-rl-space-blue" />
                <div>
                  <span className="text-rl-white font-medium">Allow Comments</span>
                  <p className="text-xs text-rl-light-grey/60">Enable reader comments</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-rl-black/30 border border-rl-white/10 rounded-lg p-4 cursor-pointer hover:bg-rl-black/50 transition-colors">
                <input type="checkbox" checked={formData.show_author} onChange={(e) => setFormData({...formData, show_author: e.target.checked})} className="w-5 h-5 rounded border-rl-white/20 bg-rl-black/50 text-rl-space-blue focus:ring-rl-space-blue" />
                <div>
                  <span className="text-rl-white font-medium">Show Author</span>
                  <p className="text-xs text-rl-light-grey/60">Display author name</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-rl-black/30 border border-rl-white/10 rounded-lg p-4 cursor-pointer hover:bg-rl-black/50 transition-colors">
                <input type="checkbox" checked={formData.show_date} onChange={(e) => setFormData({...formData, show_date: e.target.checked})} className="w-5 h-5 rounded border-rl-white/20 bg-rl-black/50 text-rl-space-blue focus:ring-rl-space-blue" />
                <div>
                  <span className="text-rl-white font-medium">Show Date</span>
                  <p className="text-xs text-rl-light-grey/60">Display publication date</p>
                </div>
              </label>
            </div>
          </div>

          {/* Author Information */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Author Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Author ID (UUID)</label>
                <input type="text" value={formData.author_id} onChange={(e) => setFormData({...formData, author_id: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Author UUID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Author Email</label>
                <input type="email" value={formData.author_email} onChange={(e) => setFormData({...formData, author_email: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="author@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rl-white/80 mb-1">Author Role</label>
                <input type="text" value={formData.author_role} onChange={(e) => setFormData({...formData, author_role: e.target.value})} className="w-full bg-rl-black/50 border border-rl-white/10 rounded-lg p-3 text-rl-white focus:outline-none focus:border-rl-space-blue" placeholder="Chief Engineer, Lead Scientist, etc." />
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">External Links (JSON Format)</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">External Links Array</label>
              <textarea 
                rows={3} 
                value={jsonRawText.external_links} 
                onChange={(e) => {
                  setJsonRawText({...jsonRawText, external_links: e.target.value});
                }}
                onBlur={() => {
                  try {
                    const parsed = JSON.parse(jsonRawText.external_links);
                    setFormData({...formData, external_links: parsed});
                    setJsonErrors({...jsonErrors, external_links: ''});
                  } catch (err) {
                    setJsonErrors({...jsonErrors, external_links: 'Invalid JSON format'});
                  }
                }}
                className={`w-full bg-rl-black/50 border rounded-lg p-3 text-rl-white focus:outline-none font-mono text-sm transition-all ${jsonErrors.external_links ? 'border-red-500/50 focus:border-red-500' : 'border-rl-white/10 focus:border-rl-space-blue'}`}
                placeholder='[]'
              />
              {jsonErrors.external_links && <p className="text-xs text-red-400 mt-1">{jsonErrors.external_links}</p>}
              <p className="text-xs text-rl-light-grey/60 mt-1">Format: [name: value pairs for title and url]</p>
            </div>
          </div>

          {/* Related News */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Related News (JSON Format)</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Related News Slugs Array</label>
              <textarea 
                rows={2} 
                value={jsonRawText.related_news} 
                onChange={(e) => {
                  setJsonRawText({...jsonRawText, related_news: e.target.value});
                }}
                onBlur={() => {
                  try {
                    const parsed = JSON.parse(jsonRawText.related_news);
                    setFormData({...formData, related_news: parsed});
                    setJsonErrors({...jsonErrors, related_news: ''});
                  } catch (err) {
                    setJsonErrors({...jsonErrors, related_news: 'Invalid JSON format'});
                  }
                }}
                className={`w-full bg-rl-black/50 border rounded-lg p-3 text-rl-white focus:outline-none font-mono text-sm transition-all ${jsonErrors.related_news ? 'border-red-500/50 focus:border-red-500' : 'border-rl-white/10 focus:border-rl-space-blue'}`}
                placeholder='[]'
              />
              {jsonErrors.related_news && <p className="text-xs text-red-400 mt-1">{jsonErrors.related_news}</p>}
              <p className="text-xs text-rl-light-grey/60 mt-1">Format: ["slug1", "slug2"]</p>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="border-b border-rl-white/10 pb-4">
            <h3 className="text-rl-white font-bold mb-4 text-lg">Gallery Images (JSON Format)</h3>
            <div>
              <label className="block text-sm font-medium text-rl-white/80 mb-1">Gallery Images Array</label>
              <textarea 
                rows={3} 
                value={jsonRawText.gallery_images} 
                onChange={(e) => {
                  setJsonRawText({...jsonRawText, gallery_images: e.target.value});
                }}
                onBlur={() => {
                  try {
                    const parsed = JSON.parse(jsonRawText.gallery_images);
                    setFormData({...formData, gallery_images: parsed});
                    setJsonErrors({...jsonErrors, gallery_images: ''});
                  } catch (err) {
                    setJsonErrors({...jsonErrors, gallery_images: 'Invalid JSON format'});
                  }
                }}
                className={`w-full bg-rl-black/50 border rounded-lg p-3 text-rl-white focus:outline-none font-mono text-sm transition-all ${jsonErrors.gallery_images ? 'border-red-500/50 focus:border-red-500' : 'border-rl-white/10 focus:border-rl-space-blue'}`}
                placeholder='[]'
              />
              {jsonErrors.gallery_images && <p className="text-xs text-red-400 mt-1">{jsonErrors.gallery_images}</p>}
              <p className="text-xs text-rl-light-grey/60 mt-1">Format: [image objects with url and caption]</p>
            </div>
          </div>

          <button type="submit" disabled={uploading} className="bg-rl-space-blue hover:bg-rl-space-blue/80 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 mt-4 disabled:opacity-50 transition-all hover:scale-105 w-full justify-center">
            {uploading ? 'Processing...' : editingId ? <><Save className="w-5 h-5"/> Update Transmission</> : <><Save className="w-5 h-5"/> Broadcast Transmission</>}
          </button>
        </form>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-rl-white/60 font-heading text-sm tracking-widest uppercase">
          Showing {filteredNews.length} of {news.length} transmissions
        </div>
        <div className="flex items-center gap-2 text-rl-white/40 text-sm">
          <BarChart3 className="w-4 h-4" />
          <span>Advanced View</span>
        </div>
      </div>

      {/* Enhanced News Table */}
      <div className="bg-rl-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-rl-white/10 text-sm font-heading uppercase tracking-wider text-rl-white/80">
                <th className="p-4 font-black">Transmission</th>
                <th className="p-4 font-black hidden lg:table-cell">Transmitter</th>
                <th className="p-4 font-black hidden lg:table-cell">Broadcast Date</th>
                <th className="p-4 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-rl-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center group-hover:bg-green-400/40 transition-colors">
                        <Newspaper className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-rl-white mb-1">{item.title}</div>
                        <div className="text-xs text-rl-white/40 font-heading uppercase tracking-widest">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-rl-white/70 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {item.author}
                    </div>
                  </td>
                  <td className="p-4 text-rl-white/70 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.published_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => window.open(`/news/${item.slug}`, '_blank')}
                        className="text-green-400 hover:text-green-300 p-2 hover:bg-green-400/10 rounded-lg transition-colors"
                        title="View Transmission"
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Edit Transmission"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete Transmission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNews.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle className="w-12 h-12 text-rl-white/20" />
                      <div>
                        <div className="text-rl-white/50 font-heading text-sm tracking-widest uppercase mb-2">No Transmissions Found</div>
                        <div className="text-rl-white/30 text-sm">Try adjusting your search criteria</div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
