import React, { useState } from 'react';
import { AboutData } from '../../data/AboutData';
import { useToast } from '../../components/Toast/ToastProvider';

interface Counter {
  id: number;
  icon: string;
  number: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const availableIcons = [
  { label: 'Shopping Cart', value: 'cart' },
  { label: 'Exchange / Transfer', value: 'transfer' },
  { label: 'Money / Cash', value: 'money' },
  { label: 'Car / Doorstep Pickup', value: 'car' },
  { label: 'Gift / Reward', value: 'gift' },
  { label: 'Shield / Trust', value: 'shield' },
  { label: 'Star / Rating', value: 'star' },
  { label: 'User / Customer', value: 'user' },
  { label: 'Check Circle', value: 'check-circle' },
  { label: 'Medal / Award', value: 'medal' },
];

export const AdminAbout: React.FC = () => {
  const { showToast } = useToast();

  // State initialized from AboutData
  const [marquee, setMarquee] = useState(AboutData.marquee);
  const [statsHeader, setStatsHeader] = useState({
    title: AboutData.stats.title,
    subtitle: AboutData.stats.subtitle,
    description: AboutData.stats.description
  });
  const [counters, setCounters] = useState<Counter[]>([...AboutData.stats.counters]);
  
  const [faqHeader, setFaqHeader] = useState({
    title: AboutData.faq.title,
    subtitle: AboutData.faq.subtitle
  });
  const [faqs, setFaqs] = useState<FaqItem[]>([...AboutData.faq.questions]);

  // Modal States
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [counterForm, setCounterForm] = useState({ icon: 'cart', number: '', text: '' });

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'counter' | 'faq';
    idOrIndex: number;
    title: string;
  } | null>(null);

  // Active FAQ preview
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Handle Save Header & Marquee
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('About Us story and marquee updated successfully!', 'success');
  };

  // Counter Handlers
  const handleOpenAddCounter = () => {
    setEditingCounter(null);
    setCounterForm({ icon: 'cart', number: '', text: '' });
    setIsCounterModalOpen(true);
  };

  const handleOpenEditCounter = (counter: Counter) => {
    setEditingCounter(counter);
    setCounterForm({ icon: counter.icon, number: counter.number, text: counter.text });
    setIsCounterModalOpen(true);
  };

  const handleSaveCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterForm.number.trim() || !counterForm.text.trim()) {
      showToast('Please fill in both the number and label.', 'error');
      return;
    }

    if (editingCounter) {
      setCounters(prev =>
        prev.map(c =>
          c.id === editingCounter.id
            ? { ...c, icon: counterForm.icon, number: counterForm.number.trim(), text: counterForm.text.trim() }
            : c
        )
      );
      showToast('Counter metric updated successfully!', 'success');
    } else {
      const newCounter: Counter = {
        id: Date.now(),
        icon: counterForm.icon,
        number: counterForm.number.trim(),
        text: counterForm.text.trim()
      };
      setCounters(prev => [...prev, newCounter]);
      showToast('New counter metric added!', 'success');
    }
    setIsCounterModalOpen(false);
  };

  const handleDeleteCounter = (id: number) => {
    setCounters(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
    showToast('Counter removed successfully.', 'info');
  };

  // FAQ Handlers
  const handleOpenAddFaq = () => {
    setEditingFaqIndex(null);
    setFaqForm({ question: '', answer: '' });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (index: number) => {
    const faq = faqs[index];
    setEditingFaqIndex(index);
    setFaqForm({ question: faq.question, answer: faq.answer });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      showToast('Please enter both question and answer.', 'error');
      return;
    }

    if (editingFaqIndex !== null) {
      setFaqs(prev =>
        prev.map((f, idx) =>
          idx === editingFaqIndex ? { question: faqForm.question.trim(), answer: faqForm.answer.trim() } : f
        )
      );
      showToast('FAQ updated successfully!', 'success');
    } else {
      setFaqs(prev => [...prev, { question: faqForm.question.trim(), answer: faqForm.answer.trim() }]);
      showToast('New FAQ added successfully!', 'success');
    }
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, idx) => idx !== index));
    setDeleteConfirm(null);
    showToast('FAQ removed.', 'info');
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqs.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const next = [...faqs];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setFaqs(next);
    showToast('FAQ order updated.', 'info');
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header Info Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D9AD5B] bg-[#1F1215] px-3 py-1 rounded-full inline-block mb-2">
            Banner-Free Content Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#1F1215]">
            About Us Screen Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Update scrolling announcements, business trust counters, story copy, and customer FAQs without affecting the high-definition video banner.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FCF9F4] hover:bg-[#FFF9E8] text-[#6A0F1F] border border-[#E5D3A3] text-xs font-bold transition-all shadow-xs shrink-0 self-start md:self-auto"
        >
          <i className="bx bx-external-link text-base text-[#D9AD5B]"></i>
          <span>Preview About Us Page</span>
        </a>
      </div>

      {/* 1. Marquee Announcement Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6A0F1F]/10 text-[#6A0F1F] flex items-center justify-center text-lg">
              <i className="bx bx-broadcast"></i>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                Scrolling Announcement Marquee
              </h3>
              <p className="text-xs text-stone-500">Displays on the About Us page right below the banner</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Marquee Message / Address Text
            </label>
            <input
              type="text"
              value={marquee}
              onChange={(e) => setMarquee(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white transition-all"
              placeholder="Address: No.13 4th Main Road Nanganallur Chennai-6000061"
            />
          </div>

          {/* Live Marquee Preview Box */}
          <div className="rounded-xl overflow-hidden bg-[#6A0F1F] text-white py-3 px-4 border-y-2 border-[#D9AD5B]">
            <p className="text-[11px] uppercase tracking-wider text-[#D9AD5B] font-bold mb-1">Live Marquee Preview:</p>
            <div className="font-bold text-sm truncate flex items-center gap-2">
              <span className="text-[#D9AD5B] shrink-0">Announcement:</span>
              <span className="truncate">{marquee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Business Success Story & Counters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D9AD5B]/20 text-[#A37E39] flex items-center justify-center text-lg">
              <i className="bx bx-stats"></i>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                Business Success Story & Metric Counters
              </h3>
              <p className="text-xs text-stone-500">Edit heading titles and manage the 4+ trust metric boxes</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddCounter}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-all shadow-xs"
          >
            <i className="bx bx-plus text-base"></i>
            <span>Add Counter</span>
          </button>
        </div>

        {/* Story Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Section Tagline / Title
            </label>
            <input
              type="text"
              value={statsHeader.title}
              onChange={(e) => setStatsHeader({ ...statsHeader, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Main Heading Subtitle
            </label>
            <input
              type="text"
              value={statsHeader.subtitle}
              onChange={(e) => setStatsHeader({ ...statsHeader, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Story Paragraph Description
            </label>
            <textarea
              rows={3}
              value={statsHeader.description}
              onChange={(e) => setStatsHeader({ ...statsHeader, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white"
            />
          </div>
        </div>

        {/* Counter Cards Grid */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Active Counters ({counters.length})
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {counters.map((counter) => (
              <div
                key={counter.id}
                className="rounded-2xl border border-stone-200 p-5 bg-[#FCF9F4] hover:border-[#D9AD5B] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E5D3A3] text-[#6A0F1F] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                    <i className={`bx bx-${counter.icon}`}></i>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCounter(counter)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center text-sm shadow-xs transition-colors"
                      title="Edit Counter"
                    >
                      <i className="bx bx-edit"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: 'counter', idOrIndex: counter.id, title: counter.text })}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-red-100 text-red-600 flex items-center justify-center text-sm shadow-xs transition-colors"
                      title="Delete Counter"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-extrabold text-[#6A0F1F] font-['Playfair_Display']">
                    {counter.number}
                  </h4>
                  <p className="text-xs font-bold text-[#1F1215] mt-1">
                    {counter.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FAQ Section Manager */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2B4C7E]/10 text-[#2B4C7E] flex items-center justify-center text-lg">
              <i className="bx bx-help-circle"></i>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                Frequently Asked Questions (FAQ)
              </h3>
              <p className="text-xs text-stone-500">Manage accordion Q&As shown on the About Us page</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddFaq}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-all shadow-xs"
          >
            <i className="bx bx-plus text-base"></i>
            <span>Add New FAQ</span>
          </button>
        </div>

        {/* FAQ Header Titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              FAQ Section Title
            </label>
            <input
              type="text"
              value={faqHeader.title}
              onChange={(e) => setFaqHeader({ ...faqHeader, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              FAQ Subtitle / Help Text
            </label>
            <input
              type="text"
              value={faqHeader.subtitle}
              onChange={(e) => setFaqHeader({ ...faqHeader, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Questions & Answers ({faqs.length})
            </p>
            <span className="text-[11px] text-stone-400">Click to preview answer or reorder</span>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FCF9F4] transition-all overflow-hidden"
                >
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div 
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    >
                      <span className="w-6 h-6 rounded-full bg-[#6A0F1F]/10 text-[#6A0F1F] text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-[#1F1215] truncate">
                        {faq.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, 'up')}
                        disabled={idx === 0}
                        className="w-7 h-7 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-600 flex items-center justify-center text-sm"
                        title="Move Up"
                      >
                        <i className="bx bx-chevron-up"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, 'down')}
                        disabled={idx === faqs.length - 1}
                        className="w-7 h-7 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-600 flex items-center justify-center text-sm"
                        title="Move Down"
                      >
                        <i className="bx bx-chevron-down"></i>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditFaq(idx)}
                        className="w-7 h-7 rounded-md bg-stone-100 hover:bg-stone-200 text-[#6A0F1F] flex items-center justify-center text-sm ml-1"
                        title="Edit FAQ"
                      >
                        <i className="bx bx-edit"></i>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ type: 'faq', idOrIndex: idx, title: faq.question })}
                        className="w-7 h-7 rounded-md bg-stone-100 hover:bg-red-100 text-red-600 flex items-center justify-center text-sm"
                        title="Delete FAQ"
                      >
                        <i className="bx bx-trash"></i>
                      </button>

                      {/* Accordion toggle */}
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-7 h-7 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-base ml-1"
                      >
                        <i className={`bx ${isOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-stone-600 border-t border-stone-200 bg-white leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Save Button Bar */}
      <div className="sticky bottom-4 z-20 bg-[#1F1215] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-[#D9AD5B]/30">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <i className="bx bx-check-double text-lg text-[#D9AD5B]"></i>
          <span>Changes are ready to publish</span>
        </div>
        <button
          type="button"
          onClick={handleSaveGeneral}
          className="px-6 py-2.5 rounded-xl bg-[#D9AD5B] hover:bg-[#A37E39] text-[#1F1215] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
        >
          <i className="bx bx-save text-base"></i>
          Save About Us Changes
        </button>
      </div>

      {/* Counter Add/Edit Modal */}
      {isCounterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                {editingCounter ? 'Edit Counter Metric' : 'Add New Counter Metric'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCounterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCounter} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Metric Icon
                </label>
                <select
                  value={counterForm.icon}
                  onChange={(e) => setCounterForm({ ...counterForm, icon: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                >
                  {availableIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label} (bx-{icon.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Metric Value / Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={counterForm.number}
                  onChange={(e) => setCounterForm({ ...counterForm, number: e.target.value })}
                  placeholder="e.g. 4205+ or 15+ Years"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Metric Description Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={counterForm.text}
                  onChange={(e) => setCounterForm({ ...counterForm, text: e.target.value })}
                  placeholder="e.g. Sarees Purchased"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCounterModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  {editingCounter ? 'Update Counter' : 'Add Counter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Add/Edit Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                {editingFaqIndex !== null ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. How does the doorstep saree evaluation work?"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide a clear, detailed answer for your clients..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  {editingFaqIndex !== null ? 'Update FAQ' : 'Add FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">
              <i className="bx bx-trash"></i>
            </div>
            <div>
              <h4 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                Confirm Deletion
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Are you sure you want to delete <span className="font-bold text-stone-900">"{deleteConfirm.title}"</span>?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirm.type === 'counter') {
                    handleDeleteCounter(deleteConfirm.idOrIndex);
                  } else {
                    handleDeleteFaq(deleteConfirm.idOrIndex);
                  }
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAbout;
