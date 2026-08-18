// src/Properties.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Properties() {
  const [filterType, setFilterType] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load properties from Supabase
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add sample properties if table is empty
  const addSampleProperties = async () => {
    const sampleProperties = [
      {
        title: 'Luxury Villa in Hyderabad',
        type: 'villa',
        location: 'Hyderabad',
        size: '3500 sq ft',
        price: '₹2.5 Crores',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
        description: 'Beautiful 4 BHK villa with private pool and garden',
        featured: true,
        available: true,
        dateAdded: new Date().toISOString().split('T')[0]
      },
      {
        title: 'Modern Apartment in Mumbai',
        type: 'apartment',
        location: 'Mumbai',
        size: '1800 sq ft',
        price: '₹4.5 Crores',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        description: 'Spacious 3 BHK with sea view and premium amenities',
        featured: true,
        available: true,
        dateAdded: new Date().toISOString().split('T')[0]
      },
      {
        title: 'Large Agricultural Land',
        type: 'land',
        location: 'Bangalore Highway, Kurnool',
        size: '5 Acres',
        price: '₹2.8 Crores',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
        description: 'Large agricultural land with excellent soil quality',
        featured: false,
        available: true,
        dateAdded: '2026-08-18'
      },
      {
        title: 'Penthouse in Delhi',
        type: 'penthouse',
        location: 'Delhi',
        size: '2500 sq ft',
        price: '₹3.5 Crores',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
        description: 'Luxurious penthouse with terrace garden and city view',
        featured: true,
        available: true,
        dateAdded: new Date().toISOString().split('T')[0]
      },
      {
        title: 'Commercial Shop in Kurnool',
        type: 'commercial',
        location: 'Kurnool',
        size: '800 sq ft',
        price: '₹1.2 Crores',
        image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400',
        description: 'Prime location commercial shop in busy market area',
        featured: false,
        available: true,
        dateAdded: new Date().toISOString().split('T')[0]
      }
    ];

    const { data, error } = await supabase
      .from('properties')
      .insert(sampleProperties)
      .select();

    if (error) {
      alert('Error adding samples: ' + error.message);
    } else {
      alert('✅ Sample properties added!');
      loadProperties();
    }
  };

  useEffect(() => {
    loadProperties();

    // ✅ Listen for custom event from Admin
    const handlePropertyUpdate = () => {
      loadProperties();
    };

    // ✅ Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'guptaProperties') {
        loadProperties();
      }
    };

    window.addEventListener('propertyUpdated', handlePropertyUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('propertyUpdated', handlePropertyUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Get unique property types for filter buttons
  const types = ['all', ...new Set(properties.map(p => p.type).filter(Boolean))];
  
  // Filter properties
  const filteredProperties = filterType === 'all' 
    ? properties 
    : properties.filter(p => p.type === filterType);

  // Get icon for property type
  const getTypeIcon = (type) => {
    const icons = {
      plot: '📐',
      land: '🌾',
      house: '🏠',
      villa: '🏰',
      apartment: '🏢',
      commercial: '🏪',
      penthouse: '🏬',
      farmhouse: '🌳'
    };
    return icons[type?.toLowerCase()] || '🏠';
  };

  // Get badge color
  const getTypeColor = (type) => {
    const colors = {
      plot: '#c9a84c',
      land: '#2ecc71',
      house: '#3498db',
      villa: '#9b59b6',
      apartment: '#e67e22',
      commercial: '#e74c3c',
      penthouse: '#8e44ad',
      farmhouse: '#27ae60'
    };
    return colors[type?.toLowerCase()] || '#1e3a5f';
  };

  // Format price display
  const formatPrice = (price) => {
    if (!price) return 'Contact for price';
    // If price already has ₹ symbol, return as is
    if (price.includes('₹')) return price;
    // Add ₹ symbol if missing
    return `₹${price}`;
  };

  // Loading state
  if (loading) {
    return (
      <section style={styles.propertiesSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Available <span style={styles.goldText}>Properties</span></h2>
          <div style={styles.divider}></div>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #c9a84c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ color: '#666' }}>Loading properties...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section style={styles.propertiesSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Available <span style={styles.goldText}>Properties</span></h2>
          <div style={styles.divider}></div>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            background: '#fff5f5',
            borderRadius: '10px',
            border: '1px solid #fcc'
          }}>
            <p style={{ color: '#e74c3c', fontSize: '18px' }}>❌ Error loading properties</p>
            <p style={{ color: '#666', margin: '10px 0' }}>{error}</p>
            <button 
              onClick={loadProperties}
              style={{
                padding: '10px 30px',
                background: '#c9a84c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" style={styles.propertiesSection}>
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Available <span style={styles.goldText}>Properties</span></h2>
        <div style={styles.divider}></div>
        <p style={styles.sectionSubtitle}>Browse our latest homes, plots, and lands</p>

        {/* Filter Buttons */}
        <div style={styles.filterContainer}>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                ...styles.filterBtn,
                background: filterType === type ? '#c9a84c' : '#f0f4f8',
                color: filterType === type ? 'white' : '#1e3a5f'
              }}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
            </button>
          ))}
        </div>

        {/* Property Cards Grid */}
        <div style={styles.propertiesGrid}>
          {filteredProperties.length === 0 ? (
            <div style={styles.noProperties}>
              <p style={{ fontSize: '20px', marginBottom: '10px' }}>🏠</p>
              <p style={{ fontSize: '18px', color: '#666' }}>No properties available in this category</p>
              {properties.length === 0 && (
                <button 
                  onClick={addSampleProperties}
                  style={{
                    marginTop: '20px',
                    padding: '12px 30px',
                    background: '#c9a84c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Add Sample Properties
                </button>
              )}
            </div>
          ) : (
            filteredProperties.map(property => (
              <div key={property.id} style={styles.propertyCard}>
                {property.featured && (
                  <div style={styles.featuredBadge}>⭐ Featured</div>
                )}
                <div style={styles.propertyImageContainer}>
                  <img 
                    src={property.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={property.title}
                    style={styles.propertyImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div style={{
                    ...styles.typeBadge,
                    background: getTypeColor(property.type)
                  }}>
                    {getTypeIcon(property.type)} {property.type}
                  </div>
                </div>
                <div style={styles.propertyContent}>
                  <h3 style={styles.propertyTitle}>{property.title}</h3>
                  <p style={styles.propertyLocation}>📍 {property.location}</p>
                  <div style={styles.propertyDetails}>
                    <span>📏 {property.size || 'N/A'}</span>
                    <span style={styles.priceTag}>💰 {formatPrice(property.price)}</span>
                  </div>
                  <p style={styles.propertyDescription}>
                    {property.description || 'Beautiful property in prime location'}
                  </p>
                  <div style={styles.propertyFooter}>
                    <span style={styles.propertyDate}>
                      📅 {property.dateAdded || new Date().toISOString().split('T')[0]}
                    </span>
                    <span style={{
                      ...styles.availableBadge,
                      color: property.available ? '#2ecc71' : '#e74c3c'
                    }}>
                      {property.available ? '✅ Available' : '❌ Sold'}
                    </span>
                  </div>
                  {/* Contact Buttons */}
                  <div style={styles.contactButtons}>
                    <a 
                      href="tel:+919393810954"
                      style={styles.callBtn}
                    >
                      📞 Call Now
                    </a>
                    <a 
                      href={`https://wa.me/919393810954?text=Hi, I'm interested in ${property.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.whatsappBtn}
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

// ============ STYLES ============
const styles = {
  propertiesSection: {
    padding: '80px 0',
    background: 'white',
  },
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
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  filterBtn: {
    padding: '10px 25px',
    borderRadius: '30px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  propertiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  propertyCard: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s',
    position: 'relative',
    border: '1px solid #eee',
  },
  featuredBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: '#c9a84c',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 10,
  },
  propertyImageContainer: {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
    background: '#f5f5f5',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  typeBadge: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  propertyContent: {
    padding: '20px',
  },
  propertyTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '5px',
  },
  propertyLocation: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  propertyDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  priceTag: {
    color: '#c9a84c',
    fontSize: '16px',
  },
  propertyDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '15px',
  },
  propertyFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#999',
    marginBottom: '15px',
  },
  propertyDate: {
    fontSize: '12px',
  },
  availableBadge: {
    fontSize: '12px',
    fontWeight: 'bold',
  },
  contactButtons: {
    display: 'flex',
    gap: '10px',
  },
  callBtn: {
    flex: 1,
    padding: '10px',
    background: '#2ecc71',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background 0.3s',
  },
  whatsappBtn: {
    flex: 1,
    padding: '10px',
    background: '#25D366',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background 0.3s',
  },
  noProperties: {
    textAlign: 'center',
    padding: '60px 0',
    gridColumn: '1 / -1',
  },
};

// Add media queries
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 1024px) {
    .properties-grid { 
      grid-template-columns: repeat(2, 1fr) !important; 
    }
  }
  @media (max-width: 600px) {
    .properties-grid { 
      grid-template-columns: 1fr !important; 
    }
    .section-title {
      font-size: 28px !important;
    }
  }
`;
document.head.appendChild(styleSheet);