import LandingPage from '@/components/LandingPage';
import BlogFull from '@/components/BlogFull';

export default function Home() {
  return <LandingPage blogSection={<BlogFull />} />;
}
