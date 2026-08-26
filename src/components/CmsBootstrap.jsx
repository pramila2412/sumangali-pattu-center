import { useEffect, useState } from 'react';
import { loadCmsSection } from '../lib/cms';
import { AboutData } from '../data/AboutData';
import { ServicesData } from '../data/ServicesData';
import { GalleryData } from '../data/GalleryData';
import { HomeAboutData, HomeProcessData, HomeCTAData } from '../data/HomeData';
import { GlobalData } from '../data/GlobalData';
import { ContactData } from '../data/ContactData';

const googleReviewLink = {
  id: 'google-review',
  platform: 'Google Review',
  url: 'https://www.google.com/maps/search/?api=1&query=Sumangali%20Pattu%20Center%20Nanganallur',
  icon: 'bxl-google',
};

const withRequiredGoogleReview = (socials = []) => (
  socials.some((item) => item.platform === 'Google Review')
    ? socials
    : [...socials, googleReviewLink]
);

// Existing public components consume these data modules. Hydrating the modules before
// they render keeps all public locations in sync without duplicating content logic.
export function useCmsBootstrap() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      loadCmsSection('about'), loadCmsSection('dashboard'), loadCmsSection('services'),
      loadCmsSection('gallery'), loadCmsSection('contact'),
    ]).then(([about, dashboard, services, gallery, contact]) => {
      if (about) {
        AboutData.marquee = about.marquee ?? AboutData.marquee;
        Object.assign(AboutData.stats, about.statsHeader ?? {});
        AboutData.stats.counters = about.counters ?? AboutData.stats.counters;
        Object.assign(AboutData.faq, about.faqHeader ?? {});
        AboutData.faq.questions = about.faqs ?? AboutData.faq.questions;
      }
      if (dashboard) {
        Object.assign(HomeAboutData, {
          experience: dashboard.aboutGeneral?.experience ?? HomeAboutData.experience,
          title: dashboard.aboutGeneral?.title ?? HomeAboutData.title,
          description: dashboard.aboutGeneral?.description ?? HomeAboutData.description,
          features: dashboard.aboutFeatures ?? HomeAboutData.features,
        });
        Object.assign(HomeAboutData.stats, { number: dashboard.aboutGeneral?.statsNumber ?? HomeAboutData.stats.number, text: dashboard.aboutGeneral?.statsText ?? HomeAboutData.stats.text });
        Object.assign(HomeProcessData, dashboard.processGeneral ?? {});
        HomeProcessData.steps = dashboard.processSteps ?? HomeProcessData.steps;
        Object.assign(HomeCTAData, dashboard.ctaData ?? {});
      }
      if (services?.services) {
        ServicesData.servicesList = services.services;
        const servicesLink = GlobalData.navLinks.find((link) => link.name === 'Services');
        if (servicesLink) servicesLink.dropdown = services.services.map((service) => ({ name: service.title, path: `/services/${service.id}` }));
      }
      if (gallery?.categories) GalleryData.categories = gallery.categories;
      if (contact) {
        const phones = contact.phones?.filter((item) => item.value?.trim()) ?? [];
        const emails = contact.emails?.filter((item) => item.value?.trim()) ?? [];
        const primaryPhone = phones.find((item) => item.isPrimary)?.value ?? phones[0]?.value;
        const primaryEmail = emails.find((item) => item.isPrimary)?.value ?? emails[0]?.value;
        Object.assign(GlobalData.contactInfo, { phone: primaryPhone ?? GlobalData.contactInfo.phone, email: primaryEmail ?? GlobalData.contactInfo.email, address: contact.address ?? GlobalData.contactInfo.address });
        if (contact.logo) GlobalData.logo = contact.logo;
        GlobalData.contactInfo.phones = phones.length ? phones : GlobalData.contactInfo.phones;
        GlobalData.contactInfo.emails = emails.length ? emails : GlobalData.contactInfo.emails;
        const socialChannels = withRequiredGoogleReview(contact.socials?.filter((item) => item.url?.trim()) ?? []);
        const byPlatform = (name) => socialChannels.find((item) => item.platform === name)?.url;
        Object.assign(GlobalData.socialLinks, { facebook: byPlatform('Facebook') ?? GlobalData.socialLinks.facebook, instagram: byPlatform('Instagram') ?? GlobalData.socialLinks.instagram });
        GlobalData.socialLinks.channels = socialChannels;
        Object.assign(GlobalData.footer, { about: contact.footerAbout ?? GlobalData.footer.about, copyright: contact.footerCopyright ?? GlobalData.footer.copyright });
        Object.assign(ContactData.sectionInfo, { title: contact.contactIntroTitle ?? ContactData.sectionInfo.title, description: contact.contactIntroDesc ?? ContactData.sectionInfo.description });
        ContactData.form.successMessage = contact.formSuccessMsg ?? ContactData.form.successMessage;
        ContactData.contactDetails = [
          ...GlobalData.contactInfo.phones.map((item) => ({ id: `phone-${item.id}`, icon: 'phone-call', title: item.label, value: item.value, link: `tel:${item.value.replace(/[^0-9+]/g, '')}` })),
          { id: 'address', icon: 'map', title: 'Address', value: GlobalData.contactInfo.address, link: null },
          ...GlobalData.contactInfo.emails.map((item) => ({ id: `email-${item.id}`, icon: 'envelope', title: item.label, value: item.value, link: `mailto:${item.value}` })),
        ];
      }
    }).catch(() => {
      // No CMS data yet or an offline visitor: render the bundled defaults.
    }).finally(() => setLoaded(true));
  }, []);

  return loaded;
}
