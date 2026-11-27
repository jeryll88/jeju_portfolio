import CustomCursor from '../components/CustomCursor';
import ParticleBackground from '../components/ParticleBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen transition-colors duration-300">
      <CustomCursor />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
