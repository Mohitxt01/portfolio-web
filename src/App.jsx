import { useEffect, useState } from 'react';
import Cursor from './components/Cursor.jsx';
import Loader from './components/Loader.jsx';
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
import useAnimations from './hooks/useAnimations.js';
import useRevealOnScroll from './hooks/useRevealOnScroll.js';
import useMagnetic from './hooks/useMagnetic.js';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useAnimations(loaded);
  useRevealOnScroll();
  useMagnetic();

  return (
    <>
      <Cursor />
      <Backdrop />
      <Loader onDone={() => setLoaded(true)} />
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
