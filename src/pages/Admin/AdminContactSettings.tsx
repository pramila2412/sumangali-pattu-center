import React, { useState } from 'react';
import { GlobalData } from '../../data/GlobalData';
import { ContactData } from '../../data/ContactData';
import { useToast } from '../../components/Toast/ToastProvider';

interface ContactFieldItem {
  id: string;
  label: string;
  value: string;
  isPrimary?: boolean;
}

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

const availableSocialPlatforms = [
  { platform: 'Facebook', key: 'facebook', icon: 'bxl-facebook' },
  { platform: 'Instagram', key: 'instagram', icon: 'bxl-instagram' },
  { platform: 'WhatsApp', key: 'whatsapp', icon: 'bxl-whatsapp' },
  { platform: 'LinkedIn', key: 'linkedin', icon: 'bxl-linkedin' },
  { platform: 'YouTube', key: 'youtube', icon: 'bxl-youtube' },
  { platform: 'Twitter / X', key: 'twitter', icon: 'bxl-twitter' },
  { platform: 'Pinterest', key: 'pinterest', icon: 'bxl-pinterest' },
];

export const AdminContactSettings: React.FC = () => {
  const { showToast } = useToast();

  // 1. Phone Numbers State
  const [phones, setPhones] = useState<ContactFieldItem[]>([
    { id: 'p1', label: 'Primary Contact & WhatsApp', value: GlobalData.contactInfo.phone, isPrimary: true },
    { id: 'p2', label: 'Secondary / Alternate Mobile', value: '9840123456', isPrimary: false }
  ]);

  // 2. Email Addresses State
  const [emails, setEmails] = useState<ContactFieldItem[]>([
    { id: 'e1', label: 'Primary Inquiry Email', value: GlobalData.contactInfo.email, isPrimary: true },
    { id: 'e2', label: 'Support & Valuation Email', value: 'support@sumangalipattu.com', isPrimary: false }
  ]);

  // 3. Address State
  const [address, setAddress] = useState(GlobalData.contactInfo.address);

  // 4. Social Links State
  const [socials, setSocials] = useState<SocialLinkItem[]>([
    { id: 's1', platform: 'Facebook', url: GlobalData.socialLinks.facebook, icon: 'bxl-facebook' },
    { id: 's2', platform: 'Instagram', url: GlobalData.socialLinks.instagram, icon: 'bxl-instagram' },
    { id: 's3', platform: 'LinkedIn', url: GlobalData.socialLinks.linkedin, icon: 'bxl-linkedin' },
  ]);

  // 5. Footer & Contact Screen Content State
  const [footerAbout, setFooterAbout] = useState(GlobalData.footer.about);
  const [footerCopyright, setFooterCopyright] = useState(GlobalData.footer.copyright);
  const [contactIntroTitle, setContactIntroTitle] = useState(ContactData.sectionInfo.title);
  const [contactIntroDesc, setContactIntroDesc] = useState(ContactData.sectionInfo.description);
  const [formSuccessMsg, setFormSuccessMsg] = useState(ContactData.form.successMessage);

  // Modal States
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<ContactFieldItem | null>(null);
  const [phoneForm, setPhoneForm] = useState({ label: '', value: '' });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<ContactFieldItem | null>(null);
  const [emailForm, setEmailForm] = useState({ label: '', value: '' });

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLinkItem | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: 'Facebook', url: '' });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'phone' | 'email' | 'social';
    id: string;
    label: string;
  } | null>(null);

  // Active Tab in Common Settings
  const [activeTab, setActiveTab] = useState<'contact' | 'socials' | 'footer' | 'preview'>('contact');

  // --- Phone Handlers ---
  const handleOpenAddPhone = () => {
    setEditingPhone(null);
    setPhoneForm({ label: 'Mobile Number', value: '' });
    setIsPhoneModalOpen(true);
  };

  const handleOpenEditPhone = (item: ContactFieldItem) => {
    setEditingPhone(item);
    setPhoneForm({ label: item.label, value: item.value });
    setIsPhoneModalOpen(true);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneForm.value.trim()) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    if (editingPhone) {
      setPhones(prev =>
        prev.map(p => (p.id === editingPhone.id ? { ...p, label: phoneForm.label, value: phoneForm.value } : p))
      );
      showToast('Phone number updated successfully!', 'success');
    } else {
      const newPhone: ContactFieldItem = {
        id: `p-${Date.now()}`,
        label: phoneForm.label || 'Mobile Number',
        value: phoneForm.value.trim(),
        isPrimary: phones.length === 0
      };
      setPhones(prev => [...prev, newPhone]);
      showToast('New phone number added to common space!', 'success');
    }
    setIsPhoneModalOpen(false);
  };

  const handleDeletePhone = (id: string) => {
    if (phones.length <= 1) {
      showToast('You must keep at least one primary contact number.', 'error');
      return;
    }
    setPhones(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast('Phone number deleted.', 'info');
  };

  // --- Email Handlers ---
  const handleOpenAddEmail = () => {
    setEditingEmail(null);
    setEmailForm({ label: 'Email Address', value: '' });
    setIsEmailModalOpen(true);
  };

  const handleOpenEditEmail = (item: ContactFieldItem) => {
    setEditingEmail(item);
    setEmailForm({ label: item.label, value: item.value });
    setIsEmailModalOpen(true);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.value.trim()) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (editingEmail) {
      setEmails(prev =>
        prev.map(item => (item.id === editingEmail.id ? { ...item, label: emailForm.label, value: emailForm.value } : item))
      );
      showToast('Email address updated successfully!', 'success');
    } else {
      const newEmail: ContactFieldItem = {
        id: `e-${Date.now()}`,
        label: emailForm.label || 'Email Address',
        value: emailForm.value.trim(),
        isPrimary: emails.length === 0
      };
      setEmails(prev => [...prev, newEmail]);
      showToast('New email address added to common space!', 'success');
    }
    setIsEmailModalOpen(false);
  };

  const handleDeleteEmail = (id: string) => {
    if (emails.length <= 1) {
      showToast('You must keep at least one primary email address.', 'error');
      return;
    }
    setEmails(prev => prev.filter(e => e.id !== id));
    setDeleteConfirm(null);
    showToast('Email address deleted.', 'info');
  };

  // --- Social Links Handlers ---
  const handleOpenAddSocial = () => {
    setEditingSocial(null);
    setSocialForm({ platform: 'Facebook', url: '' });
    setIsSocialModalOpen(true);
  };

  const handleOpenEditSocial = (item: SocialLinkItem) => {
    setEditingSocial(item);
    setSocialForm({ platform: item.platform, url: item.url });
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialForm.url.trim()) {
      showToast('Please enter a social profile URL.', 'error');
      return;
    }

    const matched = availableSocialPlatforms.find(p => p.platform === socialForm.platform) || availableSocialPlatforms[0];

    if (editingSocial) {
      setSocials(prev =>
        prev.map(s =>
          s.id === editingSocial.id
            ? { ...s, platform: socialForm.platform, url: socialForm.url.trim(), icon: matched.icon }
            : s
        )
      );
      showToast('Social media link updated!', 'success');
    } else {
      const newSocial: SocialLinkItem = {
        id: `s-${Date.now()}`,
        platform: socialForm.platform,
        url: socialForm.url.trim(),
        icon: matched.icon
      };
      setSocials(prev => [...prev, newSocial]);
      showToast(`${socialForm.platform} link added!`, 'success');
    }
    setIsSocialModalOpen(false);
  };

  const handleDeleteSocial = (id: string) => {
    setSocials(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
    showToast('Social media link removed.', 'info');
  };

  const handleSaveAll = () => {
    showToast('All contact, header, footer, and social media settings saved successfully!', 'success');
  };

  const primaryPhone = phones.find(p => p.isPrimary)?.value || phones[0]?.value || '';
  const primaryEmail = emails.find(e => e.isPrimary)?.value || emails[0]?.value || '';

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header Info Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-2">
            <i className="bx bx-check-shield text-sm"></i>
            Common Space for Site Contact & Socials
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#1F1215]">
            Contact, Header & Footer Settings
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            A single, central place to manage phone numbers, email addresses, store physical location, and social media channels. Automatically reflects across Top Header, Main Navbar, Footer, and Floating Action Buttons.
          </p>
        </div>

        <a
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FCF9F4] hover:bg-[#FFF9E8] text-[#6A0F1F] border border-[#E5D3A3] text-xs font-bold transition-all shadow-xs shrink-0 self-start md:self-auto"
        >
          <i className="bx bx-external-link text-base text-[#D9AD5B]"></i>
          <span>Preview Contact Screen</span>
        </a>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-200/70 rounded-2xl max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-white text-[#6A0F1F] shadow-sm'
              : 'text-stone-600 hover:text-[#6A0F1F]'
          }`}
        >
          <i className="bx bxs-phone-call text-base"></i>
          Phones & Emails
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('socials')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'socials'
              ? 'bg-white text-[#6A0F1F] shadow-sm'
              : 'text-stone-600 hover:text-[#6A0F1F]'
          }`}
        >
          <i className="bx bxl-instagram text-base"></i>
          Social Media ({socials.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'footer'
              ? 'bg-white text-[#6A0F1F] shadow-sm'
              : 'text-stone-600 hover:text-[#6A0F1F]'
          }`}
        >
          <i className="bx bx-layout text-base"></i>
          Footer & Texts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'preview'
              ? 'bg-white text-[#6A0F1F] shadow-sm'
              : 'text-stone-600 hover:text-[#6A0F1F]'
          }`}
        >
          <i className="bx bx-show text-base"></i>
          Live Preview
        </button>
      </div>

      {/* TAB 1: Phones, Emails & Store Address */}
      {activeTab === 'contact' && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          
          {/* Store Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-[#6A0F1F]/10 text-[#6A0F1F] flex items-center justify-center text-lg">
                <i className="bx bxs-map"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                  Physical Store Address
                </h3>
                <p className="text-xs text-stone-500">Synced across Footer, Contact Page, and Marquee banner</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Street Address & Landmark
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white"
                placeholder="No.13 4th Main Road Nanganallur Chennai-6000061"
              />
            </div>
          </div>

          {/* Phone Numbers Manager */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D9AD5B]/20 text-[#A37E39] flex items-center justify-center text-lg">
                  <i className="bx bxs-phone-call"></i>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                    Mobile & Contact Numbers ({phones.length})
                  </h3>
                  <p className="text-xs text-stone-500">Used for Header Call button, Floating WhatsApp, and Footer</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddPhone}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-all shadow-xs"
              >
                <i className="bx bx-plus text-sm"></i>
                <span>Add Number</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phones.map((phone) => (
                <div
                  key={phone.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FCF9F4] transition-all flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5D3A3] text-[#6A0F1F] flex items-center justify-center text-xl shadow-xs">
                      <i className="bx bxs-phone"></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-500">{phone.label}</span>
                        {phone.isPrimary && (
                          <span className="text-[10px] bg-[#D9AD5B] text-[#1F1215] font-bold px-1.5 py-0.2 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#1F1215] tracking-wide">{phone.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPhone(phone)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center text-sm shadow-xs transition-colors"
                      title="Edit"
                    >
                      <i className="bx bx-edit"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: 'phone', id: phone.id, label: phone.value })}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-red-100 text-red-600 flex items-center justify-center text-sm shadow-xs transition-colors"
                      title="Delete"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Addresses Manager */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2B4C7E]/10 text-[#2B4C7E] flex items-center justify-center text-lg">
                  <i className="bx bxs-envelope"></i>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                    Email Addresses ({emails.length})
                  </h3>
                  <p className="text-xs text-stone-500">Synced across Top Header bar, Footer, and Contact details card</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddEmail}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-all shadow-xs"
              >
                <i className="bx bx-plus text-sm"></i>
                <span>Add Email</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FCF9F4] transition-all flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#2B4C7E] flex items-center justify-center text-xl shadow-xs shrink-0">
                      <i className="bx bxs-envelope"></i>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-500">{email.label}</span>
                        {email.isPrimary && (
                          <span className="text-[10px] bg-[#D9AD5B] text-[#1F1215] font-bold px-1.5 py-0.2 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#1F1215] truncate">{email.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditEmail(email)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center text-sm shadow-xs transition-colors"
                      title="Edit"
                    >
                      <i className="bx bx-edit"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: 'email', id: email.id, label: email.value })}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-red-100 text-red-600 flex items-center justify-center text-sm shadow-xs transition-colors"
                      title="Delete"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Social Media Channels */}
      {activeTab === 'socials' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D9AD5B]/20 text-[#A37E39] flex items-center justify-center text-lg">
                <i className="bx bxl-instagram"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                  Social Media Channels ({socials.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Manage Facebook, Instagram, LinkedIn, WhatsApp & YouTube profile URLs
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddSocial}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-all shadow-xs"
            >
              <i className="bx bx-plus text-sm"></i>
              <span>Add Social Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {socials.map((social) => (
              <div
                key={social.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FCF9F4] transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#6A0F1F] flex items-center justify-center text-2xl shadow-xs shrink-0">
                    <i className={`bx ${social.icon}`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#1F1215] uppercase tracking-wider">
                      {social.platform}
                    </h4>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stone-500 hover:text-[#6A0F1F] truncate block font-mono hover:underline"
                    >
                      {social.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditSocial(social)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center text-sm shadow-xs transition-colors"
                    title="Edit URL"
                  >
                    <i className="bx bx-edit"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ type: 'social', id: social.id, label: social.platform })}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-red-100 text-red-600 flex items-center justify-center text-sm shadow-xs transition-colors"
                    title="Delete"
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Footer & Contact Screen Descriptions */}
      {activeTab === 'footer' && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          
          {/* Footer Texts Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-[#1F1215] text-[#D9AD5B] flex items-center justify-center text-lg">
                <i className="bx bx-layout"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                  Footer Content & Brand Note
                </h3>
                <p className="text-xs text-stone-500">Edit the about snippet and copyright text in the global footer</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Footer Brand Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={footerAbout}
                  onChange={(e) => setFooterAbout(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Copyright Notice Line
                </label>
                <input
                  type="text"
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>
            </div>
          </div>

          {/* Contact Screen Headings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-[#6A0F1F]/10 text-[#6A0F1F] flex items-center justify-center text-lg">
                <i className="bx bx-chat"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1F1215]">
                  Contact Us Screen Form Texts
                </h3>
                <p className="text-xs text-stone-500">Intro texts and success confirmation message</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Section Sub-Title
                  </label>
                  <input
                    type="text"
                    value={contactIntroTitle}
                    onChange={(e) => setContactIntroTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Form Submission Success Alert
                  </label>
                  <input
                    type="text"
                    value={formSuccessMsg}
                    onChange={(e) => setFormSuccessMsg(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Contact Intro Description
                </label>
                <textarea
                  rows={2}
                  value={contactIntroDesc}
                  onChange={(e) => setContactIntroDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: Live Preview Visualizer */}
      {activeTab === 'preview' && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          
          {/* Header Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A0F1F]">
                1. Top Header Bar Live Preview
              </span>
              <span className="text-[11px] text-stone-400">Renders on top of every page</span>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-md">
              <div className="bg-[#6A0F1F] text-white py-2 px-6 flex flex-col sm:flex-row justify-between items-center text-xs gap-2 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center gap-1 text-[#D9AD5B]">
                    <i className="bx bxs-phone-call"></i> {primaryPhone}
                  </span>
                  <span className="flex items-center gap-1 text-white/90">
                    <i className="bx bxs-envelope"></i> {primaryEmail}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {socials.map((s, idx) => (
                    <span key={idx} className="text-white hover:text-[#D9AD5B] text-base cursor-pointer">
                      <i className={`bx ${s.icon}`}></i>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6A0F1F]">
                2. Footer Contact Widget Live Preview
              </span>
              <span className="text-[11px] text-stone-400">Renders at the bottom of every page</span>
            </div>

            <div className="bg-[#1F1215] text-white/80 p-6 rounded-2xl text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 font-['Playfair_Display']">
                    Sumangali Pattu Center
                  </h4>
                  <p className="leading-relaxed text-white/70">{footerAbout}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 font-['Playfair_Display']">
                    Contact Information
                  </h4>
                  <p className="flex items-start gap-2 mb-1.5">
                    <i className="bx bx-map text-[#D9AD5B] text-base mt-0.5 shrink-0"></i>
                    <span>{address}</span>
                  </p>
                  <p className="flex items-center gap-2 mb-1.5">
                    <i className="bx bx-phone-call text-[#D9AD5B] text-base shrink-0"></i>
                    <span>{primaryPhone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <i className="bx bx-envelope text-[#D9AD5B] text-base shrink-0"></i>
                    <span>{primaryEmail}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-center text-white/50 text-[11px]">
                {footerCopyright}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Global Save Button Bar */}
      <div className="sticky bottom-4 z-20 bg-[#1F1215] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-[#D9AD5B]/30">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <i className="bx bx-check-double text-lg text-[#D9AD5B]"></i>
          <span>Common contact & social information ready to publish</span>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-2.5 rounded-xl bg-[#D9AD5B] hover:bg-[#A37E39] text-[#1F1215] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
        >
          <i className="bx bx-save text-base"></i>
          Save Settings
        </button>
      </div>

      {/* Phone Modal */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                {editingPhone ? 'Edit Contact Number' : 'Add Contact Number'}
              </h3>
              <button
                type="button"
                onClick={() => setIsPhoneModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSavePhone} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Label / Description
                </label>
                <input
                  type="text"
                  value={phoneForm.label}
                  onChange={(e) => setPhoneForm({ ...phoneForm, label: e.target.value })}
                  placeholder="e.g. Primary WhatsApp & Doorstep Inquiries"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Phone / Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phoneForm.value}
                  onChange={(e) => setPhoneForm({ ...phoneForm, value: e.target.value })}
                  placeholder="9944118349 or +91 99441 18349"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  {editingPhone ? 'Update Number' : 'Add Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                {editingEmail ? 'Edit Email Address' : 'Add Email Address'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Label / Department
                </label>
                <input
                  type="text"
                  value={emailForm.label}
                  onChange={(e) => setEmailForm({ ...emailForm, label: e.target.value })}
                  placeholder="e.g. General Saree Inquiries"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={emailForm.value}
                  onChange={(e) => setEmailForm({ ...emailForm, value: e.target.value })}
                  placeholder="contact@sumangalipattucenter.com"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  {editingEmail ? 'Update Email' : 'Add Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Social Media Link Modal */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                {editingSocial ? 'Edit Social Media Link' : 'Add Social Media Channel'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSocialModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Platform
                </label>
                <select
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                >
                  {availableSocialPlatforms.map((p) => (
                    <option key={p.key} value={p.platform}>
                      {p.platform}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Profile / Account URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={socialForm.url}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  placeholder="https://instagram.com/sumangali_pattu"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  {editingSocial ? 'Update Link' : 'Add Link'}
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
                Are you sure you want to remove <span className="font-bold text-stone-900">"{deleteConfirm.label}"</span> from common settings?
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
                  if (deleteConfirm.type === 'phone') {
                    handleDeletePhone(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'email') {
                    handleDeleteEmail(deleteConfirm.id);
                  } else {
                    handleDeleteSocial(deleteConfirm.id);
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

export default AdminContactSettings;
