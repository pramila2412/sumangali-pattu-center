import HomeBanner from '../components/Home/HomeBanner';
import HomeAbout from '../components/Home/HomeAbout';
import HomeGallery from '../components/Home/HomeGallery';
import HomeServices from '../components/Home/HomeServices';
import HomeProcess from '../components/Home/HomeProcess';
import HomeCTA from '../components/Home/HomeCTA';

const HomeScreen = () => {
  return (
    <main>
      <HomeBanner />
      <HomeAbout />
      <HomeGallery />
      <HomeServices />
      <HomeProcess />
      <HomeCTA />
    </main>
  );
}

export default HomeScreen;
