export const GlobalData = {
  brandName: "Sumangali Pattu Center",
  logo: "logo.png", // Ensure this matches the filename in src/assets/logo/
  contactInfo: {
    phone: "9944118349",
    email: "Akajith2928@gmail.com",
    address: "6/224 Raji Nagar 3rd Street Nanmangalam Chennai -129"
  },
  socialLinks: {
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/"
  },
  navLinks: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { 
      name: "Services", 
      path: "/services",
      dropdown: [
        { name: "Old Mysore Silk Saree", path: "/services/old-mysore-silk" },
        { name: "Old Kanchipuram Silk Saree", path: "/services/old-kanchipuram-silk" },
        { name: "Old Banarasi Silk Saree", path: "/services/old-banarasi-silk" },
        { name: "Saree Exchange", path: "/services/saree-exchange" }
      ]
    },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" }
  ],
  footer: {
    about: "Sumangali Pattu Center is your trusted buyer for old silk and pattu sarees. We offer instant cash and free doorstep pickup.",
    copyright: "© 2024 Sumangali Pattu Center. All Rights Reserved."
  }
};
