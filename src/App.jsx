import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShortcutsSection from './sections/ShortcutsSection';
import KeyboardSection from './sections/KeyboardSection';
import ExtensionsSection from './sections/ExtensionsSection';
import AISection from './sections/AISection';
import TestimonialsSection from './sections/TestimonialsSection';
import SnippetsSection from './sections/SnippetsSection';
import FeaturesSection from './sections/FeaturesSection';
import CommunitySection from './sections/CommunitySection';
import DeveloperSection from './sections/DeveloperSection';
import DownloadSection from './sections/DownloadSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ShortcutsSection />
      <KeyboardSection />
      <ExtensionsSection />
      <AISection />
      <TestimonialsSection />
      <SnippetsSection />
      <FeaturesSection />
      <CommunitySection />
      <DeveloperSection />
      <DownloadSection />
      <Footer />
    </>
  );
}
