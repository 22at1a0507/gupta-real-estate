import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Properties from './Properties';
import Admin from './Admin';

// Wrapper component that handles the layout and routing
function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div style={styles.app}>
      {/* Floating WhatsApp & Call Buttons */}
      <div style={styles.floatingButtons}>
        <a href="https://wa.me/919393810954" target="_blank" rel="noopener noreferrer" style={styles.whatsappFloat}>
          💬 WhatsApp
        </a>
        <a href="tel:+919393810954" style={styles.callFloat}>
          📞 Call Now
        </a>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer}>
            <Link to="/" style={styles.logo}>
              Gupta <span style={styles.logoGold}>Real Estate Consultancy</span>
            </Link>
            <span style={styles.badge}>25+ Years</span>
          </div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/admin" style={styles.adminNav}>🔒 Admin</Link>
            <a href="#contact" style={styles.contactNav} onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>Contact</a>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={styles.menuBtn}>
            ☰
          </button>
        </div>
        {mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link to="/" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/admin" style={styles.mobileAdmin} onClick={() => setMobileMenuOpen(false)}>🔒 Admin</Link>
            <a href="#contact" style={styles.mobileContact} onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>Contact</a>
          </div>
        )}
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <>
            {/* HERO SECTION WITH VIDEO */}
            <section id="home" style={styles.hero}>
              <div style={styles.heroContainer}>
                <div style={styles.heroContent}>
                  <span style={styles.trustBadge}>🏆 25+ Years of Trust</span>
                  <h1 style={styles.heroTitle}>
                    Gupta<br />
                    <span style={styles.heroGold}>Real Estate Consultant</span>
                  </h1>
                  <p style={styles.heroDesc}>
                    Helping families and investors buy and sell lands, plots, houses, and commercial properties for over 25 years. Honest advice, verified properties, and smooth transactions.
                  </p>
                  <div style={styles.heroButtons}>
                    <a href="tel:+919393810954" style={styles.callBtn}>
                      📞 Call Now
                    </a>
                    <a href="https://wa.me/919393810954" target="_blank" rel="noopener noreferrer" style={styles.whatsappBtn}>
                      💬 WhatsApp
                    </a>
                  </div>
                  <div style={styles.stats}>
                    <span>✅ 2000+ Happy Clients</span>
                    <span>✅ Verified Properties</span>
                  </div>
                </div>

                {/* VIDEO CONTAINER */}
                <div style={styles.heroVideoContainer}>
                  <div style={styles.videoBox}>
                    <video 
                      controls 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      style={styles.heroVideo}
                    >
                      <source src="/Gupta Consultancy.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div style={styles.videoBadge}>🎬 Watch Our Video</div>
                  </div>
                </div>
              </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" style={styles.aboutSection}>
              <div style={styles.sectionContainer}>
                <h2 style={styles.sectionTitle}>About <span style={styles.goldText}>the Consultant</span></h2>
                <div style={styles.divider}></div>
                <div style={styles.aboutGrid}>
                  <div style={styles.aboutLeft}>
                    <div style={styles.avatar}>
                      <img 
                        src="/A.V.Gupta.jpeg" 
                        alt="Mr. A Venkateswarlu Gupta" 
                        style={styles.avatarImage}
                      />
                    </div>
                    <h3 style={styles.agentName}>Mr. A Venkateswarlu Gupta</h3>
                    <p style={styles.agentTitle}>Founder & Senior Consultant</p>
                    <div style={styles.aboutList}>
                      <p>✅ <strong>25+ years</strong> of real estate experience</p>
                      <p>✅ <strong>2000+</strong> happy customers</p>
                      <p>✅ Trusted local consultant, Kurnool</p>
                      <p>✅ Expert property guidance & documentation</p>
                    </div>
                    <div style={styles.tags}>
                      <span style={styles.tag}>Honesty</span>
                      <span style={styles.tag}>Transparency</span>
                      <span style={styles.tag}>Local Expertise</span>
                    </div>
                  </div>
                  
                  <div style={styles.aboutRight}>
                    <h4 style={styles.aboutHeading}>💡 Why clients trust us</h4>
                    <ul style={styles.trustList}>
                      <li><span style={styles.starIcon}>⭐</span> <strong>25+ years</strong> of market insight – we know every locality, every trend.</li>
                      <li><span style={styles.starIcon}>⭐</span> <strong>Verified properties</strong> – we personally inspect and verify documents.</li>
                      <li><span style={styles.starIcon}>⭐</span> <strong>End-to-end support</strong> – from site visit to legal paperwork.</li>
                      <li><span style={styles.starIcon}>⭐</span> <strong>Personalized service</strong> – we listen to your needs and find the best match.</li>
                    </ul>
                    <div style={styles.quoteBox}>
                      <p style={styles.quoteText}>"We don't just sell properties, we build lifelong relationships."</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" style={styles.servicesSection}>
              <div style={styles.sectionContainer}>
                <h2 style={styles.sectionTitle}>Our <span style={styles.goldText}>Services</span></h2>
                <div style={styles.divider}></div>
                <p style={styles.sectionSubtitle}>Expert guidance for every step of your property journey</p>
                <div style={styles.servicesGrid}>
                  {[
                    { icon: '🏢', title: 'Land Buying & Selling', desc: 'Agricultural, residential, and commercial land deals.' },
                    { icon: '🏠', title: 'House Buying & Selling', desc: 'Villas, independent houses, and gated community homes.' },
                    { icon: '📐', title: 'Plot Sales', desc: 'Residential plots, corner plots, and layout sales.' },
                    { icon: '🏪', title: 'Commercial Properties', desc: 'Shops, offices, and investment commercial spaces.' },
                    { icon: '📈', title: 'Investment Consultation', desc: 'Smart property investment advice & portfolio guidance.' },
                    { icon: '📋', title: 'Documentation & Legal', desc: 'Property docs, site visits, legal coordination support.' },
                  ].map((service, idx) => (
                    <div key={idx} style={styles.serviceCard}>
                      <div style={styles.serviceIcon}>{service.icon}</div>
                      <h4 style={styles.serviceTitle}>{service.title}</h4>
                      <p style={styles.serviceDesc}>{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* WHY CHOOSE US */}
            <section id="whyus" style={styles.whySection}>
              <div style={styles.sectionContainer}>
                <h2 style={styles.sectionTitle}>Why <span style={styles.goldText}>Choose Us</span></h2>
                <div style={styles.divider}></div>
                <div style={styles.whyGrid}>
                  {[
                    { icon: '🏆', title: '25+ Years Experience', desc: 'Deep local knowledge and proven track record.' },
                    { icon: '🤝', title: 'Honest Guidance', desc: 'No pressure, only genuine advice for your benefit.' },
                    { icon: '📋', title: 'Transparent Deals', desc: 'Clear terms, verified documents, and fair pricing.' },
                    { icon: '📍', title: 'Local Market Knowledge', desc: 'Insider expertise in Kurnool, Nandyal, Hyderabad.' },
                    { icon: '⭐', title: 'Personalized Service', desc: 'Tailored solutions for families, NRI, and investors.' },
                    { icon: '🔄', title: 'End-to-End Support', desc: 'From site visits to legal assistance – we\'re with you.' },
                  ].map((item, idx) => (
                    <div key={idx} style={styles.whyCard}>
                      <div style={styles.whyIcon}>{item.icon}</div>
                      <h4 style={styles.whyTitle}>{item.title}</h4>
                      <p style={styles.whyDesc}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SERVICE AREAS */}
            <section id="areas" style={styles.areasSection}>
              <div style={styles.sectionContainer}>
                <h2 style={styles.sectionTitle}>Service <span style={styles.goldText}>Areas</span></h2>
                <div style={styles.divider}></div>
                <div style={styles.areasContainer}>
                  {['Kurnool', 'Nandyal', 'Hyderabad', 'Adoni', 'Bangalore', 'Atmakur', 'Nearby areas'].map((area) => (
                    <span key={area} style={styles.areaTag}>{area}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* ⭐ PROPERTIES SECTION - NOW ON HOME PAGE */}
            <Properties />

            {/* TESTIMONIALS */}
            <section id="testimonials" style={styles.testimonialsSection}>
              <div style={styles.sectionContainer}>
                <h2 style={styles.sectionTitle}>What <span style={styles.goldText}>Clients Say</span></h2>
                <div style={styles.divider}></div>
                <div style={styles.testimonialsGrid}>
                  {[
                    { text: 'We found our dream plot through his guidance. The entire process was smooth and transparent.', name: 'Dr. Lakshmana Swamy', place: 'Kurnool' },
                    { text: 'Professional, honest, and deeply knowledgeable. He helped us buy commercial property with full legal clarity.', name: 'Anita Reddy', place: 'Investor, Kurnool' },
                    { text: 'He sold our land within weeks and got us a better price than expected. Highly recommend.', name: 'Ramesh', place: 'Hyderabad' },
                    { text: 'As an NRI, I needed someone trustworthy. He handled everything – site visit, documents, and registration.', name: 'Chakradhar', place: 'USA' },
                  ].map((t, idx) => (
                    <div key={idx} style={styles.testimonialCard}>
                      <p style={styles.testimonialText}>"{t.text}"</p>
                      <div style={styles.testimonialAuthor}>
                        <div style={styles.testimonialAvatar}>👤</div>
                        <div>
                          <p style={styles.testimonialName}>{t.name}</p>
                          <p style={styles.testimonialPlace}>{t.place}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        } />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* CONTACT SECTION - Visible on all pages */}
      <section id="contact" style={styles.contactSection}>
        <div style={styles.contactContainer}>
          <h2 style={styles.contactTitle}>Let's <span style={styles.contactGold}>Connect</span></h2>
          <div style={styles.contactDivider}></div>
          <div style={styles.contactGrid}>
            <div style={styles.contactInfo}>
              <p style={styles.contactItem}>📞 <strong>Phone:</strong> <a href="tel:+919393810954" style={styles.contactLink}>+91 9393810954</a></p>
              <p style={styles.contactItem}>💬 <strong>WhatsApp:</strong> <a href="https://wa.me/919393810954" style={styles.contactLink}>+91 9393810954</a></p>
              <p style={styles.contactItem}>📍 <strong>Office:</strong> H:no 1/216, Madam Ghadikhana, beside post office, one town, Kurnool</p>
              <p style={styles.contactItem}>🕐 <strong>Business Hours:</strong> Mon–Sat 9:00 AM – 10:00 PM</p>
            </div>
            <div style={styles.contactButtons}>
              <a href="tel:+919393810954" style={styles.contactCallBtn}>
                📞 Call Now
              </a>
              <a href="https://wa.me/919393810954" target="_blank" rel="noopener noreferrer" style={styles.contactWhatsappBtn}>
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
          <div style={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3838.6179453604414!2d78.04918157513075!3d15.824086784820484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDQ5JzI2LjciTiA3OMKwMDMnMDYuMyJF!5e0!3m2!1sen!2sin!4v1783492628304!5m2!1sen!2sin"
              style={styles.map}
              allowFullScreen
              loading="lazy"
              title="Office location map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerCol}>
            <h3 style={styles.footerLogo}>Gupta <span style={styles.footerGold}>Real Estate Consultancy</span></h3>
            <p style={styles.footerText}>25+ years of trusted real estate consultancy.</p>
          </div>
          <div style={styles.footerCol}>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/admin" style={styles.footerLink}>Admin</Link>
            <a href="#contact" style={styles.footerLink} onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>Contact</a>
          </div>
          <div style={styles.footerCol}>
            <h4 style={styles.footerHeading}>Contact</h4>
            <p style={styles.footerText}>📞 +91 9393810954</p>
            <p style={styles.footerText}>💬 WhatsApp</p>
            <p style={styles.footerText}>📍 Kurnool, AP</p>
          </div>
          <div style={styles.footerCol}>
            <h4 style={styles.footerHeading}>Follow Us</h4>
            <div style={styles.socialIcons}>
              <span style={styles.socialIcon}>📘</span>
              <span style={styles.socialIcon}>📸</span>
              <span style={styles.socialIcon}>▶️</span>
            </div>
            <p style={styles.copyright}>© 2026 Gupta Real Estate Consultancy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// ============ STYLES ============
const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    backgroundColor: '#ffffff',
  },

  // Floating Buttons
  floatingButtons: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  whatsappFloat: {
    background: '#25D366',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
    transition: 'all 0.3s',
  },
  callFloat: {
    background: '#1e3a5f',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(30, 58, 95, 0.4)',
    transition: 'all 0.3s',
  },

  // Navigation
  nav: {
    background: 'white',
    padding: '15px 20px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    textDecoration: 'none',
  },
  logoGold: {
    color: '#c9a84c',
  },
  badge: {
    background: '#c9a84c',
    color: 'white',
    padding: '2px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: '#555',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
  adminNav: {
    color: '#c9a84c',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s',
  },
  contactNav: {
    background: '#1e3a5f',
    color: 'white',
    padding: '8px 25px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    gap: '10px',
    padding: '15px',
    background: 'white',
    borderTop: '1px solid #eee',
  },
  mobileLink: {
    color: '#555',
    textDecoration: 'none',
    padding: '8px 0',
  },
  mobileAdmin: {
    color: '#c9a84c',
    textDecoration: 'none',
    padding: '8px 0',
    fontWeight: 'bold',
  },
  mobileContact: {
    background: '#1e3a5f',
    color: 'white',
    padding: '10px',
    borderRadius: '30px',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // Hero Section
  hero: {
    background: 'linear-gradient(135deg, #f6f8fa 0%, #e8edf5 100%)',
    padding: '80px 20px',
  },
  heroContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '50px',
  },
  heroContent: {
    flex: 1,
    minWidth: '300px',
  },
  trustBadge: {
    display: 'inline-block',
    background: '#c9a84c',
    color: 'white',
    padding: '5px 20px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    lineHeight: 1.2,
    marginBottom: '20px',
  },
  heroGold: {
    color: '#c9a84c',
  },
  heroDesc: {
    fontSize: '18px',
    color: '#666',
    lineHeight: 1.8,
    marginBottom: '30px',
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '25px',
  },
  callBtn: {
    background: '#1e3a5f',
    color: 'white',
    padding: '15px 35px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)',
    transition: 'all 0.3s',
  },
  whatsappBtn: {
    background: '#25D366',
    color: 'white',
    padding: '15px 35px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
    transition: 'all 0.3s',
  },
  stats: {
    display: 'flex',
    gap: '25px',
    fontSize: '14px',
    color: '#555',
  },

  // VIDEO CONTAINER
  heroVideoContainer: {
    flex: 1,
    minWidth: '300px',
    maxWidth: '560px',
    position: 'relative',
    alignSelf: 'center',
  },
  videoBox: {
    position: 'relative',
    width: '100%',
    paddingBottom: '45%',
    height: 0,
    overflow: 'hidden',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    background: '#000',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  heroVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '16px',
    display: 'block',
  },
  videoBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    zIndex: 10,
  },

  // Sections
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '38px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '10px',
  },
  goldText: {
    color: '#c9a84c',
  },
  divider: {
    width: '60px',
    height: '4px',
    background: '#c9a84c',
    margin: '0 auto 40px',
  },
  sectionSubtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: '18px',
    marginBottom: '40px',
  },

  // About Section
  aboutSection: {
    padding: '80px 0',
    background: 'white',
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '50px',
    alignItems: 'start',
  },
  aboutLeft: {
    textAlign: 'center',
  },
  avatar: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto 20px',
    border: '4px solid #c9a84c',
    boxShadow: '0 10px 30px rgba(30, 58, 95, 0.3)',
    background: '#f0f4f8',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: '60% 40%',
  },
  agentName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '5px',
  },
  agentTitle: {
    color: '#c9a84c',
    fontWeight: '500',
    marginBottom: '20px',
  },
  aboutList: {
    textAlign: 'left',
    color: '#555',
    lineHeight: 2,
  },
  tags: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  tag: {
    background: '#f0f4f8',
    color: '#1e3a5f',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  aboutRight: {
    background: '#f8f9fb',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  aboutHeading: {
    fontSize: '20px',
    color: '#1e3a5f',
    marginBottom: '20px',
  },
  trustList: {
    listStyle: 'none',
    padding: 0,
    lineHeight: 2.2,
    color: '#555',
  },
  starIcon: {
    marginRight: '10px',
  },
  quoteBox: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    border: '2px solid #c9a84c',
    marginTop: '20px',
  },
  quoteText: {
    fontStyle: 'italic',
    color: '#555',
    fontSize: '16px',
  },

  // Services
  servicesSection: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, #f6f8fa 0%, #e8edf5 100%)',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  serviceCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  serviceIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  serviceTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '10px',
  },
  serviceDesc: {
    color: '#666',
    fontSize: '14px',
    lineHeight: 1.6,
  },

  // Why Choose Us
  whySection: {
    padding: '80px 0',
    background: 'white',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  whyCard: {
    textAlign: 'center',
    padding: '30px',
    borderRadius: '20px',
    background: '#f8f9fb',
    transition: 'all 0.3s',
  },
  whyIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  whyTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '10px',
  },
  whyDesc: {
    color: '#666',
    fontSize: '14px',
  },

  // Areas
  areasSection: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, #f6f8fa 0%, #e8edf5 100%)',
  },
  areasContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'center',
  },
  areaTag: {
    background: 'white',
    padding: '12px 30px',
    borderRadius: '50px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    fontSize: '16px',
  },

  // Testimonials
  testimonialsSection: {
    padding: '80px 0',
    background: 'white',
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '30px',
  },
  testimonialCard: {
    background: '#f8f9fb',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  testimonialText: {
    fontSize: '16px',
    lineHeight: 1.8,
    color: '#555',
    marginBottom: '20px',
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  testimonialAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#1e3a5f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: 'white',
  },
  testimonialName: {
    fontWeight: 'bold',
    color: '#1e3a5f',
    margin: 0,
  },
  testimonialPlace: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },

  // Contact
  contactSection: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)',
  },
  contactContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px',
  },
  contactTitle: {
    textAlign: 'center',
    fontSize: '38px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px',
  },
  contactGold: {
    color: '#c9a84c',
  },
  contactDivider: {
    width: '60px',
    height: '4px',
    background: '#c9a84c',
    margin: '0 auto 40px',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '40px',
  },
  contactInfo: {
    color: 'white',
    lineHeight: 2.5,
  },
  contactItem: {
    fontSize: '16px',
  },
  contactLink: {
    color: '#c9a84c',
    textDecoration: 'none',
  },
  contactButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    justifyContent: 'center',
  },
  contactCallBtn: {
    background: 'white',
    color: '#1e3a5f',
    padding: '18px 40px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    transition: 'all 0.3s',
  },
  contactWhatsappBtn: {
    background: '#25D366',
    color: 'white',
    padding: '18px 40px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
    transition: 'all 0.3s',
  },
  mapContainer: {
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  map: {
    width: '100%',
    height: '250px',
    border: 0,
  },

  // Footer
  footer: {
    background: '#0a1a2e',
    color: '#aaa',
    padding: '50px 20px',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  footerLogo: {
    fontSize: '24px',
    color: 'white',
    margin: 0,
  },
  footerGold: {
    color: '#c9a84c',
  },
  footerText: {
    fontSize: '14px',
    lineHeight: 1.8,
    margin: 0,
  },
  footerHeading: {
    color: 'white',
    fontSize: '16px',
    marginBottom: '10px',
  },
  footerLink: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '14px',
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
    fontSize: '28px',
  },
  socialIcon: {
    cursor: 'pointer',
  },
  copyright: {
    fontSize: '12px',
    marginTop: '10px',
  },
};

// Add hover effects with CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }
  a:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }
  .service-card:hover, .why-card:hover, .testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  }
  .property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  }
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .menu-btn { display: block; }
    .mobile-menu { display: flex; }
    .about-grid, .contact-grid { grid-template-columns: 1fr; }
    .services-grid, .why-grid, .testimonials-grid { grid-template-columns: 1fr 1fr; }
    .footer-container { grid-template-columns: 1fr 1fr; }
    .hero-title { font-size: 32px; }
    .heroVideoContainer { max-width: 100%; }
  }
  @media (max-width: 480px) {
    .services-grid, .why-grid, .testimonials-grid { grid-template-columns: 1fr; }
    .footer-container { grid-template-columns: 1fr; }
    .contact-buttons { align-items: stretch; }
  }
`;
document.head.appendChild(styleSheet);
