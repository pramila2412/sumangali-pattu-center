import saree1 from '../assets/saree/saree1.jpg';
import saree2 from '../assets/saree/saree2.jpg';
import saree3 from '../assets/saree/saree3.jpg';
import saree4 from '../assets/saree/saree4.webp';
import saree5 from '../assets/saree/saree5.jpg';
import saree6 from '../assets/saree/saree6.jpeg';
import saree7 from '../assets/saree/saree7.jpeg';

export const GalleryData = {
  header: {
    title: "Our Gallery",
    breadcrumb: "Our Gallery"
  },
  sectionInfo: {
    tagline: "Our Collections",
    title: "Explore Our Saree Categories"
  },
  categories: [
    {
      id: "kanchipuram",
      title: "Kanchipuram Silk",
      coverImage: saree1,
      description: "Authentic Kanchipuram silk sarees with pure zari.",
      images: [saree1, saree2, saree3]
    },
    {
      id: "banaras",
      title: "Banarasi Silk",
      coverImage: saree2,
      description: "Rich brocade and intricate Banarasi craftsmanship.",
      images: [saree2, saree4, saree5]
    },
    {
      id: "mysore",
      title: "Mysore Silk",
      coverImage: saree3,
      description: "Lightweight, elegant, and timeless Mysore silks.",
      images: [saree3, saree6, saree7]
    },
    {
      id: "vintage",
      title: "Vintage & Antique Silk",
      coverImage: saree4,
      description: "Rare and treasured vintage silk collections.",
      images: [saree4, saree1, saree2]
    },
    {
      id: "bridal",
      title: "Bridal Pattu",
      coverImage: saree5,
      description: "Heavy zari work bridal sarees.",
      images: [saree5, saree6, saree3]
    },
    {
      id: "zari",
      title: "Pure Zari Designs",
      coverImage: saree6,
      description: "Closeups of beautiful gold and silver zari work.",
      images: [saree6, saree7, saree1]
    }
  ]
};
