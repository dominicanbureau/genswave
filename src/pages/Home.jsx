import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Process from '../components/Process';
import AppointmentForm from '../components/AppointmentForm';
import Footer from '../components/Footer';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <AppointmentForm />
      <Footer />
    </div>
  );
}

export default Home;
