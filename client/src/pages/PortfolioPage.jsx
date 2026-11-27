import PublicLayout from '../layouts/PublicLayout';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import SkillsSection from '../sections/SkillsSection';
import ProjectsSection from '../sections/ProjectsSection';
import AwardsSection from '../sections/AwardsSection';
import ContactSection from '../sections/ContactSection';

export default function PortfolioPage() {
  return (
    <PublicLayout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <AwardsSection />
      <ContactSection />
    </PublicLayout>
  );
}
