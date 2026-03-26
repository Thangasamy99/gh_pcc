import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hospital,
  Stethoscope,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Heart,
  Activity,
  Baby,
  Search,
  Star,
  CheckCircle2,
  ChevronUp,
  MessageCircle,
  ShieldCheck,
  Microscope,
  Pill,
  BabyIcon,
  Accessibility,
  Smile,
  Info
} from 'lucide-react';
import CountUp from 'react-countup';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useInView } from 'react-intersection-observer';

const departments = [
  { id: 1, name: 'Emergency Care', icon: <Activity className="w-8 h-8" />, color: 'bg-red-500', patients: 15000 },
  { id: 2, name: 'Cardiology', icon: <Heart className="w-8 h-8" />, color: 'bg-rose-500', patients: 12000 },
  { id: 3, name: 'Neurology', icon: <Activity className="w-8 h-8" />, color: 'bg-teal-500', patients: 8000 },
  { id: 4, name: 'Pediatrics', icon: <Baby className="w-8 h-8" />, color: 'bg-cyan-500', patients: 18000 },
  { id: 5, name: 'Maternity', icon: <BabyIcon className="w-8 h-8" />, color: 'bg-emerald-500', patients: 10000 },
  { id: 6, name: 'Orthopedics', icon: <Accessibility className="w-8 h-8" />, color: 'bg-amber-500', patients: 9000 },
  { id: 7, name: 'Dental Care', icon: <Smile className="w-8 h-8" />, color: 'bg-orange-500', patients: 7000 },
  { id: 8, name: 'Laboratory', icon: <Microscope className="w-8 h-8" />, color: 'bg-green-500', patients: 25000 },
  { id: 9, name: 'Pharmacy', icon: <Pill className="w-8 h-8" />, color: 'bg-blue-500', patients: 30000 },
  { id: 10, name: 'Radiology', icon: <Activity className="w-8 h-8" />, color: 'bg-yellow-500', patients: 11000 },
  { id: 11, name: 'Psychiatry', icon: <ShieldCheck className="w-8 h-8" />, color: 'bg-purple-500', patients: 5000 },
  { id: 12, name: 'Dermatology', icon: <Stethoscope className="w-8 h-8" />, color: 'bg-orange-600', patients: 6000 },
  { id: 13, name: 'Ophthalmology', icon: <Search className="w-8 h-8" />, color: 'bg-sky-500', patients: 8500 },
  { id: 14, name: 'ENT', icon: <Stethoscope className="w-8 h-8" />, color: 'bg-teal-600', patients: 7500 },
  { id: 15, name: 'Urology', icon: <Stethoscope className="w-8 h-8" />, color: 'bg-red-600', patients: 5500 },
  { id: 16, name: 'Gastroenterology', icon: <Activity className="w-8 h-8" />, color: 'bg-green-600', patients: 6500 },
  { id: 17, name: 'Pulmonology', icon: <Activity className="w-8 h-8" />, color: 'bg-orange-700', patients: 7000 },
  { id: 18, name: 'Physical Therapy', icon: <Accessibility className="w-8 h-8" />, color: 'bg-purple-600', patients: 4000 },
];

const branches = [
  { id: 1, name: 'Buea General Hospital', location: 'Buea, SW Region', beds: 250, doctors: 45 },
  { id: 2, name: 'Douala Medical Center', location: 'Douala, Littoral', beds: 300, doctors: 60 },
  { id: 3, name: 'Yaoundé Central Hospital', location: 'Yaoundé, Centre', beds: 350, doctors: 70 },
  { id: 4, name: 'Bamenda Regional', location: 'Bamenda, NW', beds: 200, doctors: 35 },
  { id: 5, name: 'Kumba District Hospital', location: 'Kumba, SW', beds: 150, doctors: 25 },
];

const achievements = [
  { id: 1, value: 45, suffix: '+', label: 'Years of Service', icon: <Clock /> },
  { id: 2, value: 21, suffix: '', label: 'Hospital Branches', icon: <Hospital /> },
  { id: 3, value: 18, suffix: '', label: 'Medical Departments', icon: <Stethoscope /> },
  { id: 4, value: 500, suffix: '+', label: 'Medical Staff', icon: <Users /> },
  { id: 5, value: 100000, suffix: '+', label: 'Patients Served', icon: <Heart /> },
  { id: 6, value: 95, suffix: '%', label: 'Patient Satisfaction', icon: <Star /> },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mbella',
    role: 'Patient',
    content: 'The care I received at PCC General Hospital was exceptional. The staff was professional and compassionate.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 2,
    name: 'John Ndifor',
    role: 'Family Member',
    content: 'I am grateful for the excellent care my father received during his stay. The doctors are truly dedicated.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 3,
    name: 'Marie Claire',
    role: 'Patient',
    content: 'Modern facilities and caring staff. The maternity ward is especially wonderful.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-primary p-2 rounded-lg">
            <Hospital className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className={`font-bold text-xl ${scrolled ? 'text-primary' : 'text-white'}`}>PCC HEALTH SERVICES</h1>
            <p className={`text-xs ${scrolled ? 'text-gray-500' : 'text-gray-200'}`}>GENERAL HOSPITAL HMS</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {['Home', 'About', 'Departments', 'Branches', 'Contact'].map((item) => (
            <ScrollLink
              key={item}
              to={item.toLowerCase()}
              smooth={true}
              duration={500}
              offset={-80}
              className={`cursor-pointer font-medium hover:text-primary transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {item}
            </ScrollLink>
          ))}
          <RouterLink to="/login" className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-all transform hover:scale-105">
            Staff Login
          </RouterLink>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={32} /> : <Menu size={32} className={scrolled ? 'text-primary' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="flex flex-col p-6 space-y-4">
              {['Home', 'About', 'Departments', 'Branches', 'Contact'].map((item) => (
                <ScrollLink
                  key={item}
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  onClick={() => setMobileMenu(false)}
                  className="text-gray-700 font-medium hover:text-primary text-lg"
                >
                  {item}
                </ScrollLink>
              ))}
              <RouterLink to="/login" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold w-full text-center">
                Staff Login
              </RouterLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const StatCard = ({ stat, index }: { stat: any, index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 text-center group"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
        {stat.icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">
        {inView && <CountUp end={stat.value} duration={3} />}
        {stat.suffix}
      </h3>
      <p className="text-gray-500 font-medium">{stat.label}</p>
    </motion.div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-12 items-center pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block backdrop-blur-md border border-white/30">
              Trusted Excellence Since 1978
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Presbyterian Church <br />
              <span className="text-primary-light">In Cameroon</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl leading-relaxed">
              PCC Health Services provides compassionate, high-quality medical care through 21 branches and 18 specialized departments across Cameroon.
            </p>
            <div className="flex flex-wrap gap-4">
              <ScrollLink to="contact" smooth={true} className="cursor-pointer bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:bg-slate-50 transition-all flex items-center group">
                Book Appointment
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </ScrollLink>
              <ScrollLink to="departments" smooth={true} className="cursor-pointer border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                Explore Services
              </ScrollLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden md:block relative"
          >
            <div className="animate-float">
              <img
                src="/images/logo.png"
                alt="PCC Logo"
                className="w-full max-w-lg mx-auto drop-shadow-2xl relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500?text=PCC+HEALTH+SERVICES';
                }}
              />
            </div>
            {/* Background element for logo */}
            <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl transform scale-110"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievements.map((stat, idx) => (
              <StatCard key={stat.id} stat={stat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="/images/trust.png"
              alt="Hôpital Image"
              className="rounded-3xl shadow-2xl border-8 border-slate-50"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4">About PCC Health</h4>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Leading Healthcare Excellence <br /> in Cameroon Since 1978
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              The Presbyterian Church in Cameroon (PCC) Health Services has been a pillar of medical care for over 45 years. Our mission is to provide holistic healthcare that addresses the physical, mental, and spiritual needs of our communities.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="text-primary mt-1" />
                <div>
                  <h5 className="font-bold text-gray-900">Accredited</h5>
                  <p className="text-sm text-gray-500">Government Certified</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="text-primary mt-1" />
                <div>
                  <h5 className="font-bold text-gray-900">24/7 Care</h5>
                  <p className="text-sm text-gray-500">Emergency Response</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="text-primary mt-1" />
                <div>
                  <h5 className="font-bold text-gray-900">Qualified</h5>
                  <p className="text-sm text-gray-500">500+ Experts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="text-primary mt-1" />
                <div>
                  <h5 className="font-bold text-gray-900">Modern</h5>
                  <p className="text-sm text-gray-500">Latest Equipment</p>
                </div>
              </div>
            </div>
            <button className="bg-primary text-white p-4 px-10 rounded-2xl font-bold hover:shadow-xl hover:bg-primary-dark transition-all">
              Learn More Our Mission
            </button>
          </motion.div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-16">
          <h4 className="text-primary font-bold tracking-widest uppercase mb-4">Our Specialties</h4>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">18 Specialized Departments</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We offer a wide range of specialized medical services handled by experts to ensure you get the best treatment.
          </p>
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {departments.map((dept, idx) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group transition-all"
            >
              <div className={`${dept.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {dept.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{dept.name}</h3>
              <p className="text-primary font-semibold text-sm">
                {dept.patients.toLocaleString()}+ Patients Served
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4">Our Network</h4>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">21 Branches Nationwide</h2>
            <p className="text-gray-600 mb-8">
              From Buea to Bamenda, we are strategically located across the country to bring quality healthcare closer to your doorstep.
            </p>
            <div className="space-y-4">
              {branches.map((branch) => (
                <div key={branch.id} className="p-6 bg-slate-50 rounded-2xl border border-gray-100 hover:border-primary transition-all group flex justify-between items-center cursor-pointer">
                  <div className="flex space-x-4 items-center">
                    <div className="bg-white p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white shadow-sm transition-colors">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{branch.name}</h4>
                      <p className="text-sm text-gray-500">{branch.location}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-bold mb-1">
                      {branch.beds} Beds
                    </span>
                    <span className="text-xs text-gray-400">{branch.doctors} Doctors</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-2xl hover:border-primary hover:text-primary transition-all">
                View All 21 Branches
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden bg-primary/5 p-10 h-full flex flex-col justify-center items-center relative"
          >
            {/* Map Placeholder */}
            <div className="relative w-full aspect-square bg-[#e2e8f0] rounded-full flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <MapPin className="text-primary w-32 h-32 animate-bounce" />
              <div className="absolute inset-x-0 bottom-10 text-center">
                <p className="text-primary font-bold text-xl">Interactive Map Coming Soon</p>
                <p className="text-gray-500">Locating all 21 PCC Medical Centers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 border-y border-white/10 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/10 rounded-full blur-[120px]"></div>

        <div className="container mx-auto px-6 text-center mb-16">
          <h4 className="text-primary-light font-bold tracking-widest uppercase mb-4">Testimonials</h4>
          <h2 className="text-4xl font-bold mb-4">Voices of Our Patients</h2>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl relative"
            >
              <div className="flex items-center space-x-4 mb-6">
                <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full border-2 border-primary" />
                <div className="text-left">
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm text-gray-400">{t.role}</p>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic text-lg leading-relaxed relative z-10">
                "{t.content}"
              </p>
              <div className="absolute bottom-6 right-8 text-primary/20 pointer-events-none">
                <Heart size={80} fill="currentColor" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            {/* Background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10"></div>

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Quality Healthcare is Just a Click Away</h2>
              <p className="text-xl text-white/80 mb-8">
                Get in touch with us for appointments, inquiries, or emergencies. Our dedicated team is available 24/7 to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Phone Number</p>
                    <p className="font-bold">+237 672500625</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Email Address</p>
                    <p className="font-bold">pcc.health@yahoo.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-auto">
              <button className="bg-white text-primary text-xl font-bold px-12 py-5 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all w-full md:w-auto group">
                Contact Us Now
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 text-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Hospital className="text-white w-8 h-8" />
              </div>
              <h2 className="font-bold text-xl">PCC HEALTH SERVICES</h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Providing holistic and compassionate healthcare services in Cameroon since 1978. Built on faith, committed to service.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Youtube, label: 'YouTube' },
                { Icon: Linkedin, label: 'LinkedIn' }
              ].map(({ Icon, label }, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 pt-2">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Our Services</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Find a Branch</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Staff Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 pt-2">Our Services</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Emergency Care</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Maternity Services</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Specialized Surgery</a></li>
              <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Laboratory Testing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 pt-2">Emergency Hotline</h4>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-4">
              <h3 className="text-3xl font-bold text-primary mb-2">911</h3>
              <p className="text-sm text-gray-400">24/7 Availability for all medical emergencies across the country.</p>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Clock size={16} />
              <span className="text-sm italic">Standard response time {`<`} 15 mins</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 border-t border-white/10 pt-10 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Presbyterian Church in Cameroon Health Services. All Rights Reserved.</p>
          <p className="mt-2">Developed with Excellence for General Hospital HMS v1.0</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-dark transition-all animate-bounce"
          >
            <ChevronUp size={28} />
          </button>
        )}
        <a
          href="https://wa.me/237672500625"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="bg-green-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110"
        >
          <MessageCircle size={32} />
        </a>
      </div>
    </div>
  );
};

export default Home;
