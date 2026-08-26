export const GlobalData = {
  brandName: "Sumangali Pattu Center",
  logo: "logo.png", // Ensure this matches the filename in src/assets/logo/
  contactInfo: {
    phone: "9944118349",
    email: "Sumangalipattucenter@gmail.com",
    address: "No.13 4th Main Road Nanganallur Chennai-6000061 "
  },
  socialLinks: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
  navLinks: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { 
      name: "Services", 
      path: "/services",
      dropdown: [
        { name: "Old Mysore Silk Saree", path: "/services/old-mysore-silk-saree" },
        { name: "Old Kanchipuram Silk Saree", path: "/services/old-kanchipuram-silk" },
        { name: "Old Banarasi Silk Saree", path: "/services/old-banarasi-silk-saree" },
        { name: "Zari Testing & Evaluation", path: "/services/zari-testing-evaluation" }
      ]
    },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" }
  ],
  footer: {
    about: "Sumangali Pattu Center is your trusted buyer for old silk and pattu sarees. We offer instant cash and free doorstep pickup.",
    copyright: "© 2026 Sumangali Pattu Center. All Rights Reserved."
  }
};
