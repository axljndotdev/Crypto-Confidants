import React, { useState, useRef } from 'react';
import { 
  Shield, 
  FileText, 
  Edit3, 
  Users, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Save, 
  Trash2, 
  Check, 
  Sparkles,
  Settings,
  FileUp,
  Download,
  Eye,
  Paperclip,
  Loader2,
  FileX,
  AlertTriangle
} from 'lucide-react';
import { AdminUser, SiteContent } from '../../types';
import { Newsletter } from '../../data/newsletters';
import { 
  getStoredSiteContent, 
  saveStoredSiteContent, 
  getStoredNewsletters, 
  saveStoredNewsletters, 
  getStoredAdminUsers, 
  saveStoredAdminUsers,
  formatNewsletterDate,
  sortNewslettersLatestFirst,
  getIssueNumberNumeric
} from '../../lib/contentStore';
import { 
  savePdfToIndexedDb, 
  getPdfBlobUrl, 
  deletePdfFromIndexedDb, 
  formatFileSize 
} from '../../lib/pdfStorage';
interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onViewLiveSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onViewLiveSite,
}) => {
  const defaultTab = currentUser.role === 'editor' ? 'newsletters' : 'site-copy';
  const [activeTab, setActiveTab] = useState<'site-copy' | 'newsletters' | 'team' | 'system'>(defaultTab);

  const [siteContent, setSiteContent] = useState<SiteContent>(getStoredSiteContent());
  const [newsletters, setNewsletters] = useState<Newsletter[]>(getStoredNewsletters());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getStoredAdminUsers());

  const [editingIssue, setEditingIssue] = useState<Newsletter | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'owner' | 'editor'>('editor');

  const pdfFileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfImportInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const flashMessage = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleStartEditIssue = async (issue: Newsletter) => {
    setEditingIssue(issue);
    setIsCreatingNew(false);

    // Always fetch fresh live blob from IndexedDB to avoid stale/expired blob URLs across page reloads
    const storedPdf = await getPdfBlobUrl(issue.id);
    if (storedPdf) {
      setEditingIssue((prev) => (prev && prev.id === issue.id ? {
        ...prev,
        pdfUrl: storedPdf.blobUrl,
        pdfFileName: storedPdf.fileName || prev.pdfFileName,
        pdfFileSize: storedPdf.fileSize || prev.pdfFileSize,
      } : prev));
    } else if (issue.pdfUrl && issue.pdfUrl.startsWith('blob:')) {
      // If issue had an expired blob URL and no file in IndexedDB, reset it cleanly
      setEditingIssue((prev) => (prev && prev.id === issue.id ? {
        ...prev,
        pdfUrl: undefined,
        pdfFileName: undefined,
        pdfFileSize: undefined,
      } : prev));
    }
  };

  const handlePdfUploadFile = async (file: File, targetIssue?: Newsletter | null) => {
    const activeIssue = targetIssue || editingIssue;
    if (!activeIssue) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document (.pdf).');
      return;
    }

    setIsUploadingPdf(true);
    try {
      let pdfUrl: string | undefined;
      let pdfFileName = file.name;
      let pdfFileSize = formatFileSize(file.size);

      try {
        const saved = await savePdfToIndexedDb(activeIssue.id, file);
        pdfUrl = saved.blobUrl;
        pdfFileName = saved.fileName;
        pdfFileSize = saved.fileSize;
      } catch (err) {
        console.error('Error saving PDF:', err);
        pdfUrl = URL.createObjectURL(file);
      }

      const cleanTitle = activeIssue.title.trim() ||
        file.name
          .replace(/\.pdf$/i, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

      const updatedIssue: Newsletter = {
        ...activeIssue,
        title: cleanTitle,
        pdfUrl,
        pdfFileName,
        pdfFileSize,
        introParagraphs: activeIssue.introParagraphs?.filter(p => p.trim()).length
          ? activeIssue.introParagraphs
          : ['Official intelligence dispatch and security advisory.'],
      };

      setEditingIssue(updatedIssue);
      flashMessage(`PDF attached: ${file.name}`);
    } catch (err) {
      console.error('Error processing PDF:', err);
      flashMessage(`PDF attached: ${file.name}`);
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleImportPdfDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxNum = newsletters.reduce((max, n) => Math.max(max, getIssueNumberNumeric(n.issueNumber)), 0);
      const nextNum = (maxNum + 1).toString().padStart(2, '0');
      const cleanTitle = file.name
        .replace(/\.pdf$/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const placeholderIssue: Newsletter = {
        id: `newsletter-${Date.now()}`,
        issueNumber: `Newsletter ${nextNum}`,
        title: cleanTitle || `Newsletter ${nextNum}`,
        date: formatNewsletterDate(new Date().toISOString()),
        category: 'Hardware Security',
        readTime: '5 min read',
        introParagraphs: ['Official intelligence dispatch and security advisory.'],
        sources: [],
      };
      setEditingIssue(placeholderIssue);
      setIsCreatingNew(true);
      await handlePdfUploadFile(file, placeholderIssue);
      e.target.value = '';
    }
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePdfUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handlePdfUploadFile(e.target.files[0]);
    }
  };

  const handleHardDeletePdf = async (issueId: string) => {
    const target = newsletters.find((n) => n.id === issueId) || (editingIssue?.id === issueId ? editingIssue : null);
    const title = target?.title || target?.issueNumber || 'this newsletter';

    const confirmed = window.confirm(
      `PERMANENT HARD DELETION WARNING:\n\nAre you sure you want to permanently delete the attached PDF for "${title}"?\n\nThis will completely purge the PDF binary from IndexedDB database storage immediately and update the newsletter. This action CANNOT be undone.`
    );
    if (!confirmed) return;

    try {
      // 1. Permanently delete from IndexedDB storage
      await deletePdfFromIndexedDb(issueId);

      // 2. Immediately update newsletters list & persist to storage (NO soft deletion)
      const updatedList = newsletters.map((n) => {
        if (n.id === issueId) {
          return {
            ...n,
            pdfUrl: undefined,
            pdfFileName: undefined,
            pdfFileSize: undefined,
          };
        }
        return n;
      });

      setNewsletters(updatedList);
      saveStoredNewsletters(updatedList);

      // 3. If currently editing this issue, update form state immediately
      if (editingIssue && editingIssue.id === issueId) {
        if (editingIssue.pdfUrl && editingIssue.pdfUrl.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(editingIssue.pdfUrl);
          } catch {
            // ignore
          }
        }
        setEditingIssue({
          ...editingIssue,
          pdfUrl: undefined,
          pdfFileName: undefined,
          pdfFileSize: undefined,
        });
      }

      flashMessage(`PDF document for "${title}" was permanently hard-deleted from storage.`);
    } catch (err) {
      console.error('Failed to hard delete PDF from storage:', err);
      alert('Error during hard deletion of PDF. Please try again.');
    }
  };

  const handleSaveSiteCopy = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteContent(siteContent);
    flashMessage('Site copy updated! Changes are live immediately.');
  };

  const handleSaveNewsletter = () => {
    if (!editingIssue) return;
    
    const formattedDate = formatNewsletterDate(editingIssue.date) || editingIssue.date;
    const normalizedIssue: Newsletter = {
      ...editingIssue,
      date: formattedDate,
    };

    let updatedList: Newsletter[];
    const exists = newsletters.some((n) => n.id === normalizedIssue.id);

    if (exists) {
      updatedList = newsletters.map((n) => (n.id === normalizedIssue.id ? normalizedIssue : n));
    } else {
      updatedList = [normalizedIssue, ...newsletters];
    }

    const sorted = sortNewslettersLatestFirst(updatedList);
    setNewsletters(sorted);
    saveStoredNewsletters(sorted);
    setEditingIssue(null);
    setIsCreatingNew(false);
    flashMessage(`Newsletter "${editingIssue.title}" saved successfully!`);
  };

  const handleDeleteNewsletter = async (id: string) => {
    const target = newsletters.find((n) => n.id === id);
    const title = target?.title || target?.issueNumber || 'this newsletter issue';

    const confirmed = window.confirm(
      `PERMANENT HARD DELETION WARNING:\n\nAre you sure you want to permanently delete "${title}" and any attached PDF from storage?\n\nThis will completely purge the newsletter record and its PDF binary from storage. This action CANNOT be undone.`
    );
    if (!confirmed) return;

    try {
      // 1. Permanently purge the PDF binary from IndexedDB
      await deletePdfFromIndexedDb(id);

      // 2. Remove newsletter record and persist to storage
      const updated = newsletters.filter((n) => n.id !== id);
      const sorted = sortNewslettersLatestFirst(updated);
      setNewsletters(sorted);
      saveStoredNewsletters(sorted);

      if (editingIssue?.id === id) {
        setEditingIssue(null);
        setIsCreatingNew(false);
      }
      flashMessage(`"${title}" and attached assets were permanently deleted.`);
    } catch (err) {
      console.error('Error deleting newsletter:', err);
      alert('Error during newsletter deletion. Please try again.');
    }
  };

  const handleStartNewNewsletter = () => {
    const maxNum = newsletters.reduce((max, n) => Math.max(max, getIssueNumberNumeric(n.issueNumber)), 0);
    const nextNum = (maxNum + 1).toString().padStart(2, '0');
    const newIssue: Newsletter = {
      id: `newsletter-${Date.now()}`,
      issueNumber: `Newsletter ${nextNum}`,
      title: '',
      date: formatNewsletterDate(new Date().toISOString()),
      category: 'Hardware Security',
      readTime: '6 min read',
      introParagraphs: [''],
      summaryTable: {
        how: '',
        when: '',
        where: '',
        why: '',
      },
      protectionSteps: [],
      sources: [],
    };
    setEditingIssue(newIssue);
    setIsCreatingNew(true);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    const user: AdminUser = {
      id: `usr_${Date.now()}`,
      username: newUserEmail.split('@')[0],
      email: newUserEmail.trim(),
      name: newUserName.trim() || newUserEmail.split('@')[0],
      role: newUserRole,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...adminUsers, user];
    setAdminUsers(updated);
    saveStoredAdminUsers(updated);
    setNewUserEmail('');
    setNewUserName('');
    flashMessage(`Staff account created for ${user.email}`);
  };

  const handleToggleUser = (userId: string) => {
    const updated = adminUsers.map((u) => (u.id === userId ? { ...u, active: !u.active } : u));
    setAdminUsers(updated);
    saveStoredAdminUsers(updated);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#ECE6D6]">
      <header className="sticky top-0 z-40 bg-[#131210]/90 backdrop-blur-md border-b border-[#C4AC76]/20 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8A5A1E]/20 border border-[#C4AC76]/40 flex items-center justify-center text-[#C4AC76]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#ECE6D6] tracking-wide">CryptoConfidant</span>
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#8A5A1E]/30 text-[#C4AC76] border border-[#C4AC76]/30">
                {currentUser.role}
              </span>
            </div>
            <div className="text-[11px] text-[#8E8E8E]">{currentUser.name} ({currentUser.username})</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewLiveSite}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C4AC76]/30 hover:border-[#C4AC76] text-xs font-mono text-[#C4AC76] hover:bg-[#8A5A1E]/10 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D1B17] hover:bg-red-950/40 border border-[#C4AC76]/20 hover:border-red-500/40 text-xs text-[#8E8E8E] hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {saveSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1B17] border border-[#C4AC76] text-[#ECE6D6] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-2 border-b border-[#C4AC76]/20 pb-4 mb-8 overflow-x-auto">
          {(currentUser.role === 'superadmin' || currentUser.role === 'owner') && (
            <button
              onClick={() => setActiveTab('site-copy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'site-copy'
                  ? 'bg-[#8A5A1E]/30 text-[#C4AC76] border border-[#C4AC76]/40'
                  : 'text-[#8E8E8E] hover:text-[#ECE6D6] hover:bg-[#1D1B17]'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Site Copy & Pricing</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('newsletters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'newsletters'
                ? 'bg-[#8A5A1E]/30 text-[#C4AC76] border border-[#C4AC76]/40'
                : 'text-[#8E8E8E] hover:text-[#ECE6D6] hover:bg-[#1D1B17]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Newsletters</span>
          </button>

          {currentUser.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-[#8A5A1E]/30 text-[#C4AC76] border border-[#C4AC76]/40'
                  : 'text-[#8E8E8E] hover:text-[#ECE6D6] hover:bg-[#1D1B17]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team & Access Control</span>
            </button>
          )}

          {currentUser.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-[#8A5A1E]/30 text-[#C4AC76] border border-[#C4AC76]/40'
                  : 'text-[#8E8E8E] hover:text-[#ECE6D6] hover:bg-[#1D1B17]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System Defaults</span>
            </button>
          )}
        </div>

        {activeTab === 'site-copy' && (
          <form onSubmit={handleSaveSiteCopy} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif text-[#ECE6D6]">Website Content & Pricing Editor</h2>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Edit every text section across the website. Any changes published here update the live site immediately.
                </p>
              </div>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-[#8A5A1E] hover:bg-[#B27B36] text-[#131210] font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#8A5A1E]/20 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Publish All Changes</span>
              </button>
            </div>

            {/* SECTION 1: HERO */}
            <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <div className="border-b border-[#C4AC76]/10 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif text-[#C4AC76]">1. Hero (Landing)</h3>
                <span className="text-[11px] font-mono text-[#8E8E8E]">Above-the-fold banner</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Eyebrow Tagline</label>
                  <input
                    type="text"
                    value={siteContent.hero.eyebrow}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, eyebrow: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Main Headline</label>
                  <textarea
                    rows={2}
                    value={siteContent.hero.headline}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, headline: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Sub-paragraph / Overview</label>
                  <textarea
                    rows={3}
                    value={siteContent.hero.subparagraph}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, subparagraph: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={siteContent.hero.primaryCta}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, primaryCta: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={siteContent.hero.secondaryCta}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, secondaryCta: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Pillar 1</label>
                  <input
                    type="text"
                    value={siteContent.hero.pillar1}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, pillar1: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Pillar 2</label>
                  <input
                    type="text"
                    value={siteContent.hero.pillar2}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, pillar2: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Pillar 3</label>
                  <input
                    type="text"
                    value={siteContent.hero.pillar3}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, pillar3: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: WHY WE EXIST */}
            <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <div className="border-b border-[#C4AC76]/10 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif text-[#C4AC76]">2. Why We Exist</h3>
                <span className="text-[11px] font-mono text-[#8E8E8E]">Story & Legal Battle Narrative</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.eyebrow}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, eyebrow: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Heading</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.heading}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, heading: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Paragraph 1 (The Legal Battle)</label>
                  <textarea
                    rows={2}
                    value={siteContent.whyWeExist.paragraph1}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, paragraph1: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Paragraph 2 (Asset Freezing & Vulnerability)</label>
                  <textarea
                    rows={3}
                    value={siteContent.whyWeExist.paragraph2}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, paragraph2: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Paragraph 3 (Departure & The Mission)</label>
                  <textarea
                    rows={3}
                    value={siteContent.whyWeExist.paragraph3}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, paragraph3: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Featured Quote</label>
                  <textarea
                    rows={2}
                    value={siteContent.whyWeExist.quote}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, quote: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Comparison 1 Title</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.comparisonItem1Title}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, comparisonItem1Title: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Comparison 1 Subtitle</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.comparisonItem1Subtitle}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, comparisonItem1Subtitle: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Comparison 2 Title</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.comparisonItem2Title}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, comparisonItem2Title: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Comparison 2 Subtitle</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.comparisonItem2Subtitle}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, comparisonItem2Subtitle: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Comparison 3 Title</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.comparisonItem3Title}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, comparisonItem3Title: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Comparison 3 Subtitle</label>
                  <input
                    type="text"
                    value={siteContent.whyWeExist.comparisonItem3Subtitle}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whyWeExist: { ...siteContent.whyWeExist, comparisonItem3Subtitle: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: WHO WE HELP */}
            <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <div className="border-b border-[#C4AC76]/10 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif text-[#C4AC76]">3. Who We Help</h3>
                <span className="text-[11px] font-mono text-[#8E8E8E]">3 Target Personas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={siteContent.whoWeHelp.eyebrow}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whoWeHelp: { ...siteContent.whoWeHelp, eyebrow: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Heading</label>
                  <input
                    type="text"
                    value={siteContent.whoWeHelp.heading}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whoWeHelp: { ...siteContent.whoWeHelp, heading: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Persona 1</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.whoWeHelp.persona1Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whoWeHelp: { ...siteContent.whoWeHelp, persona1Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.whoWeHelp.persona1Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whoWeHelp: { ...siteContent.whoWeHelp, persona1Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Persona 2</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.whoWeHelp.persona2Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whoWeHelp: { ...siteContent.whoWeHelp, persona2Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.whoWeHelp.persona2Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whoWeHelp: { ...siteContent.whoWeHelp, persona2Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Persona 3</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.whoWeHelp.persona3Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whoWeHelp: { ...siteContent.whoWeHelp, persona3Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.whoWeHelp.persona3Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whoWeHelp: { ...siteContent.whoWeHelp, persona3Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: WHAT WE OFFER */}
            <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <div className="border-b border-[#C4AC76]/10 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif text-[#C4AC76]">4. What We Offer</h3>
                <span className="text-[11px] font-mono text-[#8E8E8E]">4 Numbered Value Pillars</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={siteContent.whatWeOffer.eyebrow}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whatWeOffer: { ...siteContent.whatWeOffer, eyebrow: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Heading</label>
                  <input
                    type="text"
                    value={siteContent.whatWeOffer.heading}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whatWeOffer: { ...siteContent.whatWeOffer, heading: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Description / Lead Paragraph</label>
                  <textarea
                    rows={2}
                    value={siteContent.whatWeOffer.description}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      whatWeOffer: { ...siteContent.whatWeOffer, description: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Pillar 01</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.whatWeOffer.offering1Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering1Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.whatWeOffer.offering1Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering1Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Pillar 02</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.whatWeOffer.offering2Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering2Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.whatWeOffer.offering2Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering2Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Pillar 03</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.whatWeOffer.offering3Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering3Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.whatWeOffer.offering3Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering3Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Pillar 04</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.whatWeOffer.offering4Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering4Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.whatWeOffer.offering4Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        whatWeOffer: { ...siteContent.whatWeOffer, offering4Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: HOW WE COMMUNICATE */}
            <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <div className="border-b border-[#C4AC76]/10 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif text-[#C4AC76]">5. How We Communicate</h3>
                <span className="text-[11px] font-mono text-[#8E8E8E]">5 Step Process & Channels</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={siteContent.comms.eyebrow}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      comms: { ...siteContent.comms, eyebrow: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Heading</label>
                  <input
                    type="text"
                    value={siteContent.comms.heading}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      comms: { ...siteContent.comms, heading: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={siteContent.comms.description}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      comms: { ...siteContent.comms, description: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Step 01</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.comms.step1Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step1Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.comms.step1Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step1Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Step 02</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.comms.step2Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step2Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.comms.step2Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step2Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Step 03</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.comms.step3Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step3Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.comms.step3Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step3Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Step 04</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.comms.step4Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step4Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.comms.step4Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step4Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">Step 05</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={siteContent.comms.step5Title}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step5Title: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={siteContent.comms.step5Description}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        comms: { ...siteContent.comms, step5Description: e.target.value }
                      })}
                      className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: START HERE */}
            <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <div className="border-b border-[#C4AC76]/10 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif text-[#C4AC76]">6. Start Here (Footer Call to Action)</h3>
                <span className="text-[11px] font-mono text-[#8E8E8E]">Closing section before footer</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={siteContent.startHere.eyebrow}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      startHere: { ...siteContent.startHere, eyebrow: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Heading</label>
                  <input
                    type="text"
                    value={siteContent.startHere.heading}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      startHere: { ...siteContent.startHere, heading: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Subparagraph</label>
                  <textarea
                    rows={2}
                    value={siteContent.startHere.subparagraph}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      startHere: { ...siteContent.startHere, subparagraph: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={siteContent.startHere.ctaButtonText}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      startHere: { ...siteContent.startHere, ctaButtonText: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Legal Disclaimer Text</label>
                  <textarea
                    rows={3}
                    value={siteContent.startHere.disclaimerText}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      startHere: { ...siteContent.startHere, disclaimerText: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 7: PRICING & BOOKING PAGE */}
            <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <div className="border-b border-[#C4AC76]/10 pb-3 flex items-center justify-between">
                <h3 className="text-base font-serif text-[#C4AC76]">7. Pricing & Booking Page (Advisory Sessions)</h3>
                <span className="text-[11px] font-mono text-[#8E8E8E]">Matches live Cal.com booking tiers</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Page Eyebrow</label>
                  <input
                    type="text"
                    value={siteContent.pricing.headerEyebrow}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, headerEyebrow: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Page Title</label>
                  <input
                    type="text"
                    value={siteContent.pricing.headerTitle}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, headerTitle: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Page Subtitle / Backstory Narrative</label>
                  <textarea
                    rows={6}
                    value={siteContent.pricing.headerSubtitle}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, headerSubtitle: e.target.value }
                    })}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>

                {/* Tier 1 */}
                <div className="md:col-span-2 pt-3 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">
                    Tier 1: Introductory Session (Primary Cal.com Booking)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Top Label</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier1TopLabel}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier1TopLabel: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Name</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier1Name}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier1Name: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Price</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier1Price}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier1Price: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={siteContent.pricing.tier1Description}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier1Description: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Button Label</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier1ButtonLabel}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier1ButtonLabel: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="md:col-span-2 pt-3 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">
                    Tier 2: Single Session
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Top Label</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier2TopLabel}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier2TopLabel: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Name</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier2Name}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier2Name: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Price</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier2Price}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier2Price: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={siteContent.pricing.tier2Description}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier2Description: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Button Label</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier2ButtonLabel}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier2ButtonLabel: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="md:col-span-2 pt-3 border-t border-[#C4AC76]/10">
                  <h4 className="text-xs font-mono text-[#C4AC76] uppercase tracking-wider mb-2">
                    Tier 3: Multiple Session
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Top Label</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier3TopLabel}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier3TopLabel: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Name</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier3Name}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier3Name: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Price</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier3Price}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier3Price: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={siteContent.pricing.tier3Description}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier3Description: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mb-1">Validity Feature</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier3Feature}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier3Feature: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                      <label className="block text-[11px] font-mono text-[#8E8E8E] mt-2 mb-1">Button Label</label>
                      <input
                        type="text"
                        value={siteContent.pricing.tier3ButtonLabel}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          pricing: { ...siteContent.pricing, tier3ButtonLabel: e.target.value }
                        })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-3 py-1.5 text-xs text-[#ECE6D6]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-end pb-8">
              <button
                type="submit"
                className="py-3 px-8 rounded-xl bg-[#8A5A1E] hover:bg-[#B27B36] text-[#131210] font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#8A5A1E]/20"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'newsletters' && (
          <div className="space-y-8">
            {editingIssue ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingIssue(null);
                      setIsCreatingNew(false);
                    }}
                    className="text-xs font-mono text-[#C4AC76] hover:underline"
                  >
                    ← Back to Newsletter List
                  </button>

                  <div className="flex items-center gap-3">
                    {editingIssue.pdfUrl && (
                      <a
                        href={editingIssue.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-4 rounded-xl bg-[#1D1B17] hover:bg-[#8A5A1E]/20 border border-[#C4AC76]/30 text-[#C4AC76] font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Attached PDF</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveNewsletter}
                      className="py-2 px-5 rounded-xl bg-[#8A5A1E] hover:bg-[#B27B36] text-[#131210] font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#8A5A1E]/20"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Newsletter</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Issue #</label>
                      <input
                        type="text"
                        value={editingIssue.issueNumber}
                        onChange={(e) => setEditingIssue({ ...editingIssue, issueNumber: e.target.value })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Title</label>
                      <input
                        type="text"
                        value={editingIssue.title}
                        onChange={(e) => setEditingIssue({ ...editingIssue, title: e.target.value })}
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Date (Format: YYYY-MMM-DD, e.g. 2026-SEP-04)</label>
                      <input
                        type="text"
                        value={editingIssue.date}
                        onChange={(e) => setEditingIssue({ ...editingIssue, date: e.target.value })}
                        placeholder="2026-SEP-04"
                        className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                      />
                    </div>
                  </div>


                  {/* Newsletter PDF Edition Upload & Attachment */}
                  <div className="p-5 rounded-2xl bg-[#181613] border border-[#C4AC76]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-[#C4AC76]" />
                        <span className="text-xs font-mono uppercase tracking-wider text-[#C4AC76] font-semibold">
                          Newsletter PDF Edition (Downloadable PDF)
                        </span>
                      </div>
                      {editingIssue.pdfUrl && (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                          PDF Attached
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#8E8E8E] leading-relaxed">
                      Upload the official PDF version of this newsletter. Readers will be able to read and download the PDF edition directly from the newsletter page.
                    </p>

                    {/* Attached PDF Card or Upload Dropzone */}
                    {editingIssue.pdfUrl ? (
                      <div className="p-4 rounded-xl bg-[#131210] border border-[#C4AC76]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#8A5A1E]/20 border border-[#C4AC76]/40 flex items-center justify-center text-[#C4AC76] shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[#ECE6D6] truncate">
                              {editingIssue.pdfFileName || `${editingIssue.issueNumber}.pdf`}
                            </div>
                            <div className="text-[11px] font-mono text-[#8E8E8E] flex items-center gap-2 mt-0.5">
                              <span>{editingIssue.pdfFileSize || 'PDF Document'}</span>
                              <span>•</span>
                              <span className="text-emerald-400">Available for public download</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={editingIssue.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#1D1B17] hover:bg-[#8A5A1E]/20 border border-[#C4AC76]/30 text-xs text-[#C4AC76] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview PDF</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => pdfFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-[#1D1B17] hover:bg-[#C4AC76]/15 border border-[#C4AC76]/20 text-xs text-[#ECE6D6] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <FileUp className="w-3.5 h-3.5" />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHardDeletePdf(editingIssue.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-xs text-red-300 hover:text-red-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Execute permanent hard deletion of this PDF file from storage"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Hard Delete PDF</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        id="newsletter-pdf-dropzone"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingPdf(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDraggingPdf(false);
                        }}
                        onDrop={handlePdfDrop}
                        onClick={() => pdfFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                          isDraggingPdf
                            ? 'border-[#C4AC76] bg-[#8A5A1E]/15'
                            : 'border-[#C4AC76]/30 hover:border-[#C4AC76]/60 bg-[#131210]/60'
                        }`}
                      >
                        {isUploadingPdf ? (
                          <div className="flex flex-col items-center justify-center py-4 space-y-2">
                            <Loader2 className="w-8 h-8 text-[#C4AC76] animate-spin" />
                            <span className="text-xs font-mono text-[#C4AC76] font-medium">
                              Uploading newsletter PDF...
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#8A5A1E]/20 border border-[#C4AC76]/40 flex items-center justify-center text-[#C4AC76]">
                              <FileUp className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-medium text-[#ECE6D6]">
                              Upload Newsletter PDF
                            </div>
                            <div className="text-xs text-[#8E8E8E] mt-1">
                              Drop your newsletter PDF here or click to browse. Readers will be able to read and download the PDF edition directly on the page.
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Hidden Native File Input */}
                    <input
                      ref={pdfFileInputRef}
                      id="newsletter-pdf-file-input"
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={handlePdfFileChange}
                    />

                    {/* External PDF URL input */}
                    
                  </div>

                
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-serif text-[#ECE6D6]">Newsletter Manager</h2>
                    <p className="text-xs text-[#8E8E8E] mt-1">Upload PDF dispatches or edit website editions.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => pdfImportInputRef.current?.click()}
                      className="py-2.5 px-5 rounded-xl bg-[#1D1B17] hover:bg-[#8A5A1E]/20 border border-[#C4AC76]/40 text-[#C4AC76] font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                    >
                      <FileUp className="w-4 h-4 text-[#C4AC76]" />
                      <span>Upload Newsletter PDF</span>
                    </button>
                    <button
                      onClick={handleStartNewNewsletter}
                      className="py-2.5 px-6 rounded-xl bg-[#8A5A1E] hover:bg-[#B27B36] text-[#131210] font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-[#8A5A1E]/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Newsletter</span>
                    </button>
                    <input
                      ref={pdfImportInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={handleImportPdfDirect}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {sortNewslettersLatestFirst(newsletters).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-5 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#8A5A1E]/20 border border-[#C4AC76]/30 flex items-center justify-center text-[#C4AC76] font-mono text-xs font-semibold shrink-0">
                          {issue.issueNumber}
                        </div>
                        <div>
                          <h3 className="text-base font-serif text-[#ECE6D6]">{issue.title || 'Untitled Issue'}</h3>
                          <p className="text-xs text-[#8E8E8E] mt-1 line-clamp-1">{issue.introParagraphs?.[0] || ''}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-mono text-[#C4AC76]">{formatNewsletterDate(issue.date)} • {issue.readTime}</span>
                            {issue.pdfUrl && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                                <FileText className="w-3 h-3" />
                                <span>PDF Attached</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEditIssue(issue)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#1D1B17] hover:bg-[#8A5A1E]/20 border border-[#C4AC76]/20 text-xs text-[#C4AC76] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        {issue.pdfUrl && (
                          <button
                            onClick={() => handleHardDeletePdf(issue.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-xs text-red-400 hover:text-red-200 cursor-pointer flex items-center gap-1"
                            title="Permanently hard-delete attached PDF from storage"
                          >
                            <FileX className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline text-[11px]">Delete PDF</span>
                          </button>
                        )}
                        {(currentUser.role === 'superadmin' || currentUser.role === 'owner' || currentUser.role === 'editor') && (
                          <button
                            onClick={() => handleDeleteNewsletter(issue.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#1D1B17] hover:bg-red-950/50 border border-[#C4AC76]/20 hover:border-red-500/40 text-xs text-[#8E8E8E] hover:text-red-400 cursor-pointer"
                            title="Permanently hard-delete newsletter & attached PDF"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'team' && currentUser.role === 'superadmin' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-[#ECE6D6]">Team & Role Assignment</h2>
              <p className="text-xs text-[#8E8E8E] mt-1">Manage staff accounts and permissions.</p>
            </div>

            <form onSubmit={handleAddUser} className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
              <h3 className="text-sm font-serif text-[#C4AC76]">Add New Staff Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="teammate@cryptoconfidants.com"
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Name</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Name or Title"
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8E8E8E] mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'owner' | 'editor')}
                    className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl px-4 py-2 text-sm text-[#ECE6D6]"
                  >
                    <option value="owner">Owner (Site Copy & Pricing)</option>
                    <option value="editor">Editor (Newsletters)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-6 rounded-xl bg-[#8A5A1E] text-[#131210] font-semibold text-xs cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-[#C4AC76]">Active Accounts</h3>
              {adminUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-xl bg-[#131210] border border-[#C4AC76]/20 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#ECE6D6] font-medium">{user.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8A5A1E]/20 text-[#C4AC76]">
                        {user.role}
                      </span>
                    </div>
                    <span className="text-xs text-[#8E8E8E] font-mono">{user.email} (username: {user.username})</span>
                  </div>

                  {user.role !== 'superadmin' && (
                    <button
                      onClick={() => handleToggleUser(user.id)}
                      className="text-xs font-mono text-[#8E8E8E] hover:text-[#C4AC76] underline cursor-pointer"
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && currentUser.role === 'superadmin' && (
          <div className="p-6 rounded-2xl bg-[#131210] border border-[#C4AC76]/20 space-y-4">
            <h2 className="text-2xl font-serif text-[#ECE6D6]">System Defaults</h2>
            <p className="text-xs text-[#8E8E8E]">Reset local storage state back to original initial values.</p>
            <button
              onClick={() => {
                if (window.confirm('Reset local content to default?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="py-2 px-4 rounded-xl border border-red-500/30 text-xs font-mono text-red-300 cursor-pointer"
            >
              Reset Content Cache
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
