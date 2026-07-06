import { useEffect, useState } from 'react';
import Cursor from './components/Cursor.jsx';
import NeuralCanvas from './components/NeuralCanvas.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Backdrop from './components/Backdrop.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import EasterEgg from './components/EasterEgg.jsx';
import useAnimations from './hooks/useAnimations.js';
import useRevealOnScroll from './hooks/useRevealOnScroll.js';
import useMagnetic from './hooks/useMagnetic.js';

export default function App() {
  useAnimations(true);
  useRevealOnScroll();
  useMagnetic();

  return (
    <>
      <Cursor />
      <NeuralCanvas />
      <Backdrop />
      <ScrollProgress />
      <EasterEgg />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

