'use client';
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import ScreenshotsSection from '../components/ScreenshotsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import DownloadSection from '../components/DownloadSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import NavBar from '../components/NavBar';
import ContactFooter from '../components/ContactFooter';

export default function HomePage() {
  return (
    <>  
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <HowItWorksSection />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, padding: '60px 20px' }}>

        <div>
          <DownloadSection />
          <FAQSection />
        </div>
        <TestimonialsSection />
      </div>
      <ContactFooter/>
    </>
  );
}
