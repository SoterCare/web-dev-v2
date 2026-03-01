import Navbar from '@/components/Navbar';
import FooterSimple from '@/components/FooterSimple';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <FooterSimple />
    </>
  );
}
