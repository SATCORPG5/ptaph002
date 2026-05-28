'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Megaphone, MessageSquare, Settings2, Send, Pin, Bell,
  Pencil, Check, X, Plus, ChevronDown, Radio, BarChart3,
  Paperclip, Smile, AlertCircle, Info, Zap, Star, Shield,
  Hash, UserCheck, Image as ImageIcon,
} from 'lucide-react';
import { Creator } from '@/lib/creators';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface TeamSettings {
  teamName: string;
  welcomeMessage: string;
  accentColor: string;
}

interface Announcement {
  id: number;
  title: string;
  body: string;
  priority: 'info' | 'important' | 'urgent';
  pinned: boolean;
  timestamp: string;
  authorName: string;
}

interface ChatMessage {
  id: number;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: string;
  isManager: boolean;
  isSystem?: boolean;
}

interface MyTeamClientProps {
  viewer: Creator;
  manager: Creator | null;
  teamCreators: Creator[];
  allManagers: Creator[];
  isAdmin: boolean;
  isManager: boolean;
}

// â”€â”€â”€ Mock data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ACCENT_PRESETS = [
  '#14B8A6', '#6366F1', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#10B981', '#3B82F6',
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'ðŸŽ¯ Weekly Check-in',
    body: 'Hey team! Quick reminder to submit your Data Cards by Friday. Let me know if you have any questions or need help filling anything out.',
    priority: 'info',
    pinned: true,
    timestamp: '2d ago',
    authorName: 'Manager',
  },
  {
    id: 2,
    title: 'ðŸš€ New Growth Academy Module',
    body: 'There\'s a new Algorithmic Reach module live in Growth Academy. I want everyone to check it out before our next check-in session.',
    priority: 'important',
    pinned: false,
    timestamp: '5d ago',
    authorName: 'Manager',
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    authorId: 'system',
    authorName: 'System',
    text: 'ðŸ“Œ Team chat is active. All messages are visible to your manager and teammates.',
    timestamp: '7d ago',
    isManager: false,
    isSystem: true,
  },
  {
    id: 2,
    authorId: 'manager',
    authorName: 'Manager',
    text: 'Welcome to your team hub! This is where we\'ll coordinate, share updates, and keep each other motivated. Feel free to drop questions here anytime.',
    timestamp: '5d ago',
    isManager: true,
  },
  {
    id: 3,
    authorId: 'creator1',
    authorName: 'Team Member',
    text: 'Thanks! Really glad to have a dedicated space for this ðŸ™Œ',
    timestamp: '5d ago',
    isManager: false,
  },
];

const PRIORITY_CONFIG = {
  info: { label: 'Info', color: 'text-portal-accent', bg: 'bg-portal-accent/10 border-portal-accent/20', icon: Info },
  important: { label: 'Important', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', icon: Zap },
  urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', icon: AlertCircle },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function MyTeamClient({
  viewer, manager, teamCreators, allManagers, isAdmin, isManager,
}: MyTeamClientProps) {
  const isCreator = !isAdmin && !isManager;

  // Admin: pick which team to view
  const [selectedManagerId, setSelectedManagerId] = useState<string>(
    manager?.id || allManagers[0]?.id || ''
  );
  const activeManager = isAdmin
    ? allManagers.find(m => m.id === selectedManagerId) || allManagers[0]
    : manager;

  // Team settings (manager/admin can edit)
  const [settings, setSettings] = useState<TeamSettings>({
    teamName: activeManager ? `${activeManager.name.split(' ')[0]}'s Team` : 'My Team',
    welcomeMessage: 'Welcome to the team hub. Stay connected, get updates, and grow together.',
    accentColor: '#14B8A6',
  });
  const [editingSettings, setEditingSettings] = useState(false);
  const [draftSettings, setDraftSettings] = useState<TeamSettings>(settings);

  // Active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'announcements' | 'chat' | 'roster'>('overview');

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [showComposeAnnouncement, setShowComposeAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '', priority: 'info' as 'info' | 'important' | 'urgent', pinned: false });
  const [readAnnouncements, setReadAnnouncements] = useState<number[]>([]);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES.map(m => ({
    ...m,
    authorName: m.isManager ? (activeManager?.name || 'Manager') : m.authorName,
  })));
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Update settings teamName when activeManager changes
  useEffect(() => {
    if (activeManager) {
      setSettings(s => ({
        ...s,
        teamName: `${activeManager.name.split(' ')[0]}'s Team`,
      }));
    }
  }, [activeManager?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const unreadCount = announcements.filter(a => !readAnnouncements.includes(a.id)).length;

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: Date.now(),
      authorId: viewer.id,
      authorName: viewer.name,
      text: chatInput.trim(),
      timestamp: 'just now',
      isManager: isManager || isAdmin,
    };
    setMessages(prev => [...prev, msg]);
    setChatInput('');
  };

  const postAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.body.trim()) return;
    const a: Announcement = {
      id: Date.now(),
      ...newAnnouncement,
      timestamp: 'just now',
      authorName: viewer.name,
    };
    setAnnouncements(prev => [a, ...prev]);
    setNewAnnouncement({ title: '', body: '', priority: 'info', pinned: false });
    setShowComposeAnnouncement(false);
  };

  const saveSettings = () => {
    setSettings(draftSettings);
    setEditingSettings(false);
  };

  // â”€â”€ Tab definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const TABS: { id: 'overview' | 'announcements' | 'chat' | 'roster'; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'announcements', label: 'Board', icon: Megaphone, badge: isCreator ? unreadCount : 0 },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'roster', label: 'Roster', icon: Users },
  ];

  const accentHex = settings.accentColor;

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* â”€â”€â”€ ADMIN: Team Picker â”€â”€â”€ */}
      {isAdmin && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl px-4 py-3">
          <Shield size={14} className="text-foreground/40 flex-shrink-0" />
          <span className="text-xs font-bold text-foreground/40">Viewing team:</span>
          <div className="relative">
            <select
              value={selectedManagerId}
              onChange={e => setSelectedManagerId(e.target.value)}
              className="bg-[#0F1623] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-portal-accent/30 [color-scheme:dark] pr-7 appearance-none cursor-pointer"
            >
              {allManagers.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.handle})</option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
          <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-wider ml-auto">Admin View</span>
        </motion.div>
      )}

      {/* â”€â”€â”€ TEAM BANNER â”€â”€â”€ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden border border-foreground/[0.06]"
        style={{ background: `linear-gradient(135deg, ${accentHex}18 0%, transparent 60%), linear-gradient(to right, var(--color-background-surface, #0c111d), var(--color-portal-surface-1))` }}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-64 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: accentHex }} />

        <div className="relative px-6 py-6 flex items-start gap-4">
          {/* Manager avatar */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border"
            style={{ background: `${accentHex}25`, borderColor: `${accentHex}40` }}>
            <span className="text-xl font-black" style={{ color: accentHex }}>
              {(activeManager?.name || 'T').charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editingSettings ? (
              <input
                value={draftSettings.teamName}
                onChange={e => setDraftSettings(d => ({ ...d, teamName: e.target.value }))}
                className="bg-foreground/[0.08] border border-foreground/20 rounded-xl px-3 py-1.5 text-xl font-black text-foreground outline-none w-full max-w-xs mb-1.5"
              />
            ) : (
              <h1 className="text-2xl font-black text-foreground tracking-tight">{settings.teamName}</h1>
            )}

            <p className="text-xs font-bold mt-0.5 mb-2" style={{ color: accentHex }}>
              {activeManager ? `${activeManager.name} Â· ${activeManager.handle}` : 'No manager selected'}
            </p>

            {editingSettings ? (
              <input
                value={draftSettings.welcomeMessage}
                onChange={e => setDraftSettings(d => ({ ...d, welcomeMessage: e.target.value }))}
                className="bg-foreground/[0.08] border border-foreground/20 rounded-xl px-3 py-1.5 text-xs text-foreground outline-none w-full max-w-lg"
              />
            ) : (
              <p className="text-xs text-foreground/50 max-w-lg">{settings.welcomeMessage}</p>
            )}

            {/* Color pickers (edit mode) */}
            {editingSettings && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-wider">Accent:</span>
                {ACCENT_PRESETS.map(color => (
                  <button
                    key={color}
                    onClick={() => setDraftSettings(d => ({ ...d, accentColor: color }))}
                    className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      background: color,
                      borderColor: draftSettings.accentColor === color ? '#fff' : 'transparent',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Edit controls */}
          {(isManager || isAdmin) && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {editingSettings ? (
                <>
                  <button onClick={saveSettings}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
                    style={{ background: accentHex }}>
                    <Check size={12} /> Save
                  </button>
                  <button onClick={() => { setEditingSettings(false); setDraftSettings(settings); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 text-xs font-bold text-foreground/50 hover:text-foreground transition-all">
                    <X size={12} /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => { setEditingSettings(true); setDraftSettings(settings); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/[0.08] text-xs font-bold text-foreground/40 hover:text-foreground hover:bg-foreground/[0.08] transition-all">
                  <Settings2 size={12} /> Customize
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick stats strip */}
        <div className="border-t border-foreground/[0.05] px-6 py-3 flex items-center gap-6">
          {[
            { label: 'Members', value: teamCreators.length },
            { label: 'Announcements', value: announcements.length },
            { label: 'Pinned', value: announcements.filter(a => a.pinned).length },
            { label: 'Unread', value: unreadCount },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-sm font-black text-foreground">{stat.value}</span>
              <span className="text-[9px] font-bold text-foreground/25 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* â”€â”€â”€ TABS â”€â”€â”€ */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'announcements') setReadAnnouncements(prev => [...prev, ...announcements.map(a => a.id)]);
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold flex-1 transition-all justify-center ${
                isActive ? 'bg-foreground/[0.08] text-foreground border border-foreground/10' : 'text-foreground/30 hover:text-foreground/60'
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-black text-white flex items-center justify-center"
                  style={{ background: accentHex }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* â”€â”€â”€ OVERVIEW TAB â”€â”€â”€ */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-6">

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Team Members', value: teamCreators.length, icon: Users, sub: 'assigned creators' },
                { label: 'Active', value: teamCreators.filter(c => c.tier === 'new' || c.tier === 'top').length, icon: Radio, sub: 'this week' },
                { label: 'Announcements', value: announcements.length, icon: Megaphone, sub: 'posted total' },
                { label: 'Messages', value: messages.filter(m => !m.isSystem).length, icon: MessageSquare, sub: 'in chat' },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={14} className="text-foreground/25" />
                      <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <p className="text-3xl font-black text-foreground">{stat.value}</p>
                    <p className="text-[9px] text-foreground/25 mt-0.5">{stat.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Pinned announcements */}
            {announcements.filter(a => a.pinned).length > 0 && (
              <div>
                <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Pin size={10} /> Pinned Announcements
                </p>
                <div className="space-y-2">
                  {announcements.filter(a => a.pinned).map(a => {
                    const pc = PRIORITY_CONFIG[a.priority];
                    const PIcon = pc.icon;
                    return (
                      <div key={a.id} className={`p-4 rounded-2xl border ${pc.bg}`}>
                        <div className="flex items-start gap-3">
                          <PIcon size={14} className={`${pc.color} flex-shrink-0 mt-0.5`} />
                          <div>
                            <p className="text-sm font-black text-foreground">{a.title}</p>
                            <p className="text-xs text-foreground/50 mt-1 leading-relaxed">{a.body}</p>
                            <p className="text-[9px] text-foreground/20 mt-2 font-bold">{a.authorName} Â· {a.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick roster */}
            <div>
              <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Users size={10} /> Team Members
              </p>
              {teamCreators.length === 0 ? (
                <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-8 text-center">
                  <Users size={24} className="text-foreground/20 mx-auto mb-2" />
                  <p className="text-sm font-bold text-foreground/30">No creators assigned yet</p>
                  <p className="text-xs text-foreground/20 mt-1">Creators assigned to this manager will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {teamCreators.map(c => (
                    <div key={c.id} className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border"
                        style={{ background: `${accentHex}15`, borderColor: `${accentHex}30` }}>
                        <span className="text-xs font-black" style={{ color: accentHex }}>{c.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{c.name}</p>
                        <p className="text-[9px] text-foreground/25 truncate">{c.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* â”€â”€â”€ ANNOUNCEMENTS TAB â”€â”€â”€ */}
        {activeTab === 'announcements' && (
          <motion.div key="announcements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">

            {/* Compose button (manager/admin only) */}
            {(isManager || isAdmin) && (
              <div>
                {!showComposeAnnouncement ? (
                  <button
                    onClick={() => setShowComposeAnnouncement(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-foreground/15 text-xs font-bold text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all w-full justify-center"
                  >
                    <Plus size={13} /> New Announcement
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-foreground/50 uppercase tracking-wider">New Announcement</p>
                      <button onClick={() => setShowComposeAnnouncement(false)}>
                        <X size={14} className="text-foreground/30 hover:text-foreground" />
                      </button>
                    </div>

                    <input
                      placeholder="Announcement title..."
                      value={newAnnouncement.title}
                      onChange={e => setNewAnnouncement(a => ({ ...a, title: e.target.value }))}
                      className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-3 py-2.5 text-sm font-bold text-foreground placeholder-foreground/20 outline-none focus:border-foreground/20"
                    />
                    <textarea
                      rows={3}
                      placeholder="Write your announcement..."
                      value={newAnnouncement.body}
                      onChange={e => setNewAnnouncement(a => ({ ...a, body: e.target.value }))}
                      className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-3 py-2.5 text-xs text-foreground placeholder-foreground/20 outline-none resize-none focus:border-foreground/20"
                    />

                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Priority */}
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-wider">Priority:</span>
                        {(['info', 'important', 'urgent'] as const).map(p => {
                          const pc = PRIORITY_CONFIG[p];
                          const PIcon = pc.icon;
                          return (
                            <button
                              key={p}
                              onClick={() => setNewAnnouncement(a => ({ ...a, priority: p }))}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${
                                newAnnouncement.priority === p ? pc.bg + ' ' + pc.color : 'border-foreground/[0.06] text-foreground/25 hover:border-foreground/[0.1]'
                              }`}
                            >
                              <PIcon size={9} /> {pc.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Pin toggle */}
                      <button
                        onClick={() => setNewAnnouncement(a => ({ ...a, pinned: !a.pinned }))}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${
                          newAnnouncement.pinned ? 'bg-foreground/10 border-foreground/20 text-foreground' : 'border-foreground/[0.06] text-foreground/25'
                        }`}
                      >
                        <Pin size={9} /> Pin
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 pt-1 border-t border-foreground/[0.05]">
                      <button
                        onClick={() => setShowComposeAnnouncement(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-foreground/40 hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!newAnnouncement.title.trim() || !newAnnouncement.body.trim()}
                        onClick={postAnnouncement}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white transition-all disabled:opacity-30"
                        style={{ background: accentHex }}
                      >
                        <Send size={11} /> Post to Team
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Announcement feed */}
            {announcements.length === 0 ? (
              <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-12 text-center">
                <Megaphone size={28} className="text-foreground/15 mx-auto mb-3" />
                <p className="text-sm font-bold text-foreground/30">No announcements yet</p>
                <p className="text-xs text-foreground/20 mt-1">Announcements from your manager will appear here</p>
              </div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
                {announcements.map(a => {
                  const pc = PRIORITY_CONFIG[a.priority];
                  const PIcon = pc.icon;
                  const isUnread = isCreator && !readAnnouncements.includes(a.id);
                  return (
                    <motion.div key={a.id} variants={fadeUp}
                      className={`rounded-2xl border p-4 transition-colors ${isUnread ? 'border-foreground/[0.12] bg-foreground/[0.04]' : 'border-foreground/[0.06] bg-foreground/[0.01]'}`}>
                      <div className="flex items-start gap-3">
                        {/* Priority indicator */}
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border ${pc.bg}`}>
                          <PIcon size={12} className={pc.color} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-sm font-black text-foreground">{a.title}</p>
                            {a.pinned && (
                              <span className="flex items-center gap-1 text-[8px] font-black text-foreground/30 uppercase tracking-wider">
                                <Pin size={8} /> Pinned
                              </span>
                            )}
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentHex }} />
                            )}
                          </div>
                          <p className="text-xs text-foreground/50 leading-relaxed">{a.body}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${pc.bg} ${pc.color}`}>{pc.label}</span>
                            <span className="text-[9px] text-foreground/20 font-bold">{a.authorName} Â· {a.timestamp}</span>
                          </div>
                        </div>

                        {/* Delete (manager/admin only) */}
                        {(isManager || isAdmin) && (
                          <button
                            onClick={() => setAnnouncements(prev => prev.filter(x => x.id !== a.id))}
                            className="w-6 h-6 flex items-center justify-center text-foreground/20 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* â”€â”€â”€ TEAM CHAT TAB â”€â”€â”€ */}
        {activeTab === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">

            {/* Chat window */}
            <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] flex flex-col"
              style={{ height: '480px' }}>

              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/[0.05]">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accentHex }} />
                <span className="text-xs font-black text-foreground/50">{settings.teamName} Â· Team Chat</span>
                <span className="ml-auto text-[9px] text-foreground/20 font-bold">{teamCreators.length + 1} members</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
                {messages.map(msg => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center">
                        <span className="text-[9px] font-bold text-foreground/20 bg-foreground/[0.04] border border-foreground/[0.06] rounded-full px-3 py-1">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }
                  const isMine = msg.authorId === viewer.id;
                  const isManagerMsg = msg.isManager;
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black mt-0.5"
                        style={{
                          background: isManagerMsg ? `${accentHex}25` : 'rgba(255,255,255,0.06)',
                          color: isManagerMsg ? accentHex : 'rgba(255,255,255,0.4)',
                          border: `1px solid ${isManagerMsg ? accentHex + '40' : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        {msg.authorName.charAt(0)}
                      </div>
                      <div className={`flex-1 max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black ${isManagerMsg ? '' : 'text-foreground/30'}`}
                            style={isManagerMsg ? { color: accentHex } : {}}>
                            {msg.authorName}
                          </span>
                          {isManagerMsg && <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full"
                            style={{ background: `${accentHex}20`, color: accentHex }}>Manager</span>}
                          <span className="text-[8px] text-foreground/20">{msg.timestamp}</span>
                        </div>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'
                          }`}
                          style={isMine
                            ? { background: accentHex, color: '#fff' }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--color-foreground)' }
                          }
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="border-t border-foreground/[0.05] px-3 py-3 flex items-end gap-2">
                <div className="flex-1 flex items-center gap-2 bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-3 py-2">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={`Message ${settings.teamName}...`}
                    className="flex-1 bg-transparent text-xs text-foreground placeholder-foreground/25 outline-none"
                  />
                  <Hash size={12} className="text-foreground/20 flex-shrink-0" />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: chatInput.trim() ? accentHex : undefined, border: chatInput.trim() ? 'none' : '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Send size={13} className={chatInput.trim() ? 'text-white' : 'text-foreground/30'} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* â”€â”€â”€ ROSTER TAB â”€â”€â”€ */}
        {activeTab === 'roster' && (
          <motion.div key="roster" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">

            {/* Manager card */}
            {activeManager && (
              <div>
                <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Star size={10} /> Manager
                </p>
                <div className="rounded-2xl border p-4 flex items-center gap-4"
                  style={{ borderColor: `${accentHex}30`, background: `${accentHex}08` }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                    style={{ background: `${accentHex}20`, borderColor: `${accentHex}40` }}>
                    <span className="text-sm font-black" style={{ color: accentHex }}>{activeManager.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground">{activeManager.name}</p>
                    <p className="text-xs text-foreground/30">{activeManager.handle}</p>
                    {activeManager.title && (
                      <p className="text-[9px] font-bold mt-0.5" style={{ color: accentHex }}>{activeManager.title}</p>
                    )}
                  </div>
                  <span className="text-[8px] font-black uppercase px-2 py-1 rounded-full border"
                    style={{ background: `${accentHex}15`, borderColor: `${accentHex}30`, color: accentHex }}>
                    Manager
                  </span>
                </div>
              </div>
            )}

            {/* Team members */}
            <div>
              <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Users size={10} /> Team Members
                <span className="ml-1 text-foreground/30">({teamCreators.length})</span>
              </p>
              {teamCreators.length === 0 ? (
                <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-10 text-center">
                  <Users size={24} className="text-foreground/15 mx-auto mb-2" />
                  <p className="text-sm font-bold text-foreground/25">No creators assigned yet</p>
                </div>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
                  {teamCreators.map(c => (
                    <motion.div key={c.id} variants={fadeUp}
                      className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1] transition-all p-4 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-foreground/10 bg-foreground/5">
                        <span className="text-xs font-black text-foreground/40">{c.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{c.name}</p>
                        <p className="text-[9px] text-foreground/25">{c.handle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.category?.slice(0, 2).map(cat => (
                          <span key={cat} className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-foreground/5 border border-foreground/[0.06] text-foreground/30">
                            {cat}
                          </span>
                        ))}
                        {c.tier && (
                          <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-foreground/5 border border-foreground/[0.06] text-foreground/25">
                            {c.tier}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
