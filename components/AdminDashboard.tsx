import React, { useState, useEffect } from 'react';
import { Registration, EventID } from '../types';
import { Database, Download, Eye, EyeOff, ShieldAlert, Trash2, Settings, Edit3, LayoutDashboard, RefreshCw } from 'lucide-react';
import { useSiteConfig } from '../contexts/SiteContext';
import { fetchRegistrations } from '../services/registrationApi';

const BROCHURES_STORAGE_KEY = 'nexus_brochures';

interface AdminDashboardProps {
  onNavigateBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateBack }) => {
  const { config, updateConfig } = useSiteConfig();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'data' | 'hero' | 'events'>('data');
  const [brochureVisibility, setBrochureVisibility] = useState<Record<EventID, boolean>>({
    [EventID.VAC]: false,
    [EventID.CODEVERSE]: false,
    [EventID.AGENTS]: false,
    [EventID.ROBO]: false,
    [EventID.BRIDGE]: false,
    [EventID.VIBE]: false,
  });
  
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRegistrations();
        setRegistrations(data);
      } catch (e) {
        console.error('Failed to load cloud registrations', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    try {
      const storedVisibility = localStorage.getItem(BROCHURES_STORAGE_KEY);
      if (storedVisibility) {
        setBrochureVisibility(JSON.parse(storedVisibility));
      }
    } catch (e) {
      console.error('Failed to load brochure settings', e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'nexus2026admin') {
      setIsAdminAuth(true);
    } else {
      alert('Invalid admin password');
    }
  };

  const toggleBrochure = (eventId: EventID) => {
    const updated = { ...brochureVisibility, [eventId]: !brochureVisibility[eventId] };
    setBrochureVisibility(updated);
    localStorage.setItem(BROCHURES_STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAllRegistrations = () => {
    alert("Bulk deletion is disabled in Cloud Mode. Please manage records directly via the Supabase Dashboard.");
  };

  const handleEventChange = (index: number, field: string, value: any) => {
    const newEvents = [...config.events];
    (newEvents[index] as any)[field] = value;
    updateConfig({ ...config, events: newEvents });
  };

  const downloadCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = ['Registration ID', 'Event ID', 'Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'Leader College', 'Total Members', 'Squad Breakdown', 'Timestamp', 'Status'];
    
    const rows = registrations.map(reg => {
      const membersStr = reg.members.map(m => `${m.name} (${m.email}) [${m.college}]`).join(' | ');
      return [
        reg.id,
        reg.eventId,
        `"${reg.teamName}"`,
        `"${reg.leaderName}"`,
        reg.leaderEmail,
        reg.leaderPhone,
        `"${reg.leaderCollege}"`,
        reg.members.length + 1,
        `"${membersStr}"`,
        new Date(reg.timestamp).toLocaleString(),
        reg.status
      ];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_registrations_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdminAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center -mt-20">
        <div className="glass p-8 rounded-3xl max-w-md w-full border-red-500/20 shadow-2xl shadow-red-500/10 text-center">
          <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase font-futuristic text-purple-500 mb-2 tracking-tighter">Restricted Access</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Admin Level Clearance Required</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-center font-black tracking-[0.2em] text-white focus:border-purple-500 outline-none"
            />
            <button type="submit" className="w-full py-4 bg-purple-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-purple-600 transition-colors">
              Authorize
            </button>
            <button type="button" onClick={onNavigateBack} className="w-full py-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
              Return to Base
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-futuristic font-black uppercase text-teal-400 tracking-tighter">Command Center</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">System Administration & Data Governance</p>
        </div>
        <button onClick={onNavigateBack} className="px-6 py-3 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 hover:text-teal-400 transition-colors">
          Exit Admin
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="glass p-6 rounded-3xl border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-teal-500/10 text-teal-500 rounded-xl flex items-center justify-center"><Database size={20} /></div>
            <h3 className="font-futuristic uppercase font-bold text-lg">Total Registrations</h3>
          </div>
          <p className="text-5xl font-black text-white">{registrations.length}</p>
        </div>

         <div className="glass p-6 rounded-3xl border-white/5 lg:col-span-2">
            <h3 className="font-futuristic uppercase font-bold text-lg mb-6 flex items-center gap-3">
              <Eye size={20} className="text-teal-500"/> Brochure Visibility Control
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
               {config.events.map(event => (
                 <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{event.id}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">{brochureVisibility[event.id] ? 'Visible' : 'Hidden'}</span>
                    </div>
                    <button 
                      onClick={() => toggleBrochure(event.id as EventID)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${brochureVisibility[event.id] ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                    >
                      {brochureVisibility[event.id] ? <Eye size={16}/> : <EyeOff size={16}/>}
                    </button>
                 </div>
               ))}
            </div>
         </div>
       </div>

       <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-2xl w-fit border border-white/10">
          <button 
            onClick={() => setActiveTab('data')}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'data' ? 'bg-[#06b6d4] text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Database size={16} /> Registrations
          </button>
          <button 
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'hero' ? 'bg-[#06b6d4] text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={16} /> Hero Editor
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'events' ? 'bg-[#06b6d4] text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={16} /> Event Manager
          </button>
       </div>

       {activeTab === 'hero' && (
         <div className="glass rounded-3xl border-white/5 p-8 animate-in fade-in duration-300">
           <h3 className="font-futuristic uppercase font-bold text-2xl text-[#06b6d4] mb-6 flex items-center gap-3">
             <Edit3 size={24} /> Hero Content Editor
           </h3>
           <div className="grid md:grid-cols-2 gap-6">
             {Object.keys(config.hero).map((key) => (
               <div key={key} className="flex flex-col gap-2">
                 <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">
                   {key === 'countdownDate' ? 'Countdown Date' : key.replace(/([A-Z])/g, ' $1').trim()}
                 </label>
                 <input 
                   type={key === 'countdownDate' ? 'datetime-local' : 'text'} 
                   value={(config.hero as any)[key]}
                   onChange={(e) => updateConfig({
                     ...config,
                     hero: { ...config.hero, [key]: e.target.value }
                   })}
                   className="bg-black/50 border border-white/10 p-4 rounded-xl text-sm font-medium text-white focus:border-[#06b6d4] outline-none transition-colors"
                 />
               </div>
             ))}
           </div>
         </div>
       )}

       {activeTab === 'events' && (
         <div className="glass rounded-3xl border-white/5 p-8 animate-in fade-in duration-300">
            <h3 className="font-futuristic uppercase font-bold text-2xl text-[#06b6d4] mb-6 flex items-center gap-3">
              <Settings size={24} /> Global Event Manager
            </h3>
            <div className="space-y-8">
              {config.events.map((event, index) => (
                <div key={event.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                  <h4 className="font-futuristic font-bold text-lg text-teal-400 mb-4">{event.name} ({event.id})</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Event Name</label>
                      <input 
                        type="text" 
                        value={event.name}
                        onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                        className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Tagline</label>
                      <input 
                        type="text" 
                        value={event.tagline}
                        onChange={(e) => handleEventChange(index, 'tagline', e.target.value)}
                        className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                      />
                    </div>
                    
                    {/* Grid for small metrics */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Fee (₹)</label>
                        <input 
                          type="number" 
                          value={event.fee}
                          onChange={(e) => handleEventChange(index, 'fee', parseInt(e.target.value) || 0)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Min Team</label>
                        <input 
                          type="number" 
                          value={event.minTeam}
                          onChange={(e) => handleEventChange(index, 'minTeam', parseInt(e.target.value) || 1)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Max Team</label>
                        <input 
                          type="number" 
                          value={event.maxTeam}
                          onChange={(e) => handleEventChange(index, 'maxTeam', parseInt(e.target.value) || 1)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Prize Pool</label>
                        <input 
                          type="text" 
                          value={event.prizePool}
                          onChange={(e) => handleEventChange(index, 'prizePool', e.target.value)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Logistics */}
                    <div className="md:col-span-2 grid md:grid-cols-3 gap-4 mt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Date</label>
                        <input 
                          type="text" 
                          value={event.eventDateLabel}
                          onChange={(e) => handleEventChange(index, 'eventDateLabel', e.target.value)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Time</label>
                        <input 
                          type="text" 
                          value={event.eventTimeLabel}
                          onChange={(e) => handleEventChange(index, 'eventTimeLabel', e.target.value)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Venue</label>
                        <input 
                          type="text" 
                          value={event.venueLabel}
                          onChange={(e) => handleEventChange(index, 'venueLabel', e.target.value)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Coordinators */}
                    <div className="md:col-span-2 grid md:grid-cols-3 gap-4 mt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Coord. Name</label>
                        <input 
                          type="text" 
                          value={event.coordinatorName}
                          onChange={(e) => handleEventChange(index, 'coordinatorName', e.target.value)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Coord. Email</label>
                        <input 
                          type="email" 
                          value={event.coordinatorEmail}
                          onChange={(e) => handleEventChange(index, 'coordinatorEmail', e.target.value)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Coord. Phone</label>
                        <input 
                          type="text" 
                          value={event.coordinatorPhone}
                          onChange={(e) => handleEventChange(index, 'coordinatorPhone', e.target.value)}
                          className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Description</label>
                    <textarea 
                      value={event.description}
                      rows={3}
                      onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                      className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-teal-500 outline-none resize-none"
                    />
                  </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
       )}

       {activeTab === 'data' && (
         <div className="glass rounded-3xl border-white/5 overflow-hidden animate-in fade-in duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
           <h3 className="font-futuristic uppercase font-bold text-lg">Local Storage Database</h3>
           <div className="flex gap-3">
             <button onClick={downloadCSV} className="px-4 py-2 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-teal-500/30 transition-colors">
               <Download size={14} /> Export CSV
             </button>
             <button onClick={clearAllRegistrations} className="px-4 py-2 bg-purple-500/20 text-purple-500 border border-purple-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-500/30 transition-colors">
               <Trash2 size={14} /> Nuke DB
             </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 bg-black/20">
                <th className="p-4 font-black">Ref ID</th>
                <th className="p-4 font-black">Event</th>
                <th className="p-4 font-black">Team / Leader</th>
                <th className="p-4 font-black">Contact</th>
                <th className="p-4 font-black">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No local registrations found</td>
                </tr>
              ) : registrations.map(reg => (
                <tr key={reg.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs text-amber-500">{reg.id}</td>
                  <td className="p-4 font-bold">{reg.eventId}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{reg.teamName}</span>
                      <span className="text-[10px] text-slate-500">{reg.leaderName} ({reg.members.length + 1} pax)</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400">{reg.leaderEmail}</span>
                      <span className="text-[10px] text-slate-400">{reg.leaderPhone}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{new Date(reg.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       )}
    </div>
  );
};
