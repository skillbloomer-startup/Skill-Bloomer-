import Header from './components/landing/Header';
import Hero from './components/landing/Hero';
import LogosMarquee from './components/landing/LogosMarquee';
import Services from './components/landing/Services';
import About from './components/landing/About';
import Stats from './components/landing/Stats';
import Process from './components/landing/Process';
import Portfolio from './components/landing/Portfolio';
import Testimonials from './components/landing/Testimonials';
import Pricing from './components/landing/Pricing';
import FAQ from './components/landing/FAQ';
import CTA from './components/landing/CTA';
import Footer from './components/landing/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen text-[color:var(--color-fg)] overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 noise opacity-40" />
      <Header />
      <main>
        <Hero />
        <LogosMarquee />
        <Services />
        <About />
        <Stats />
        <Process />
        <Portfolio />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
