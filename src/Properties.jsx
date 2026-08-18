import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Properties() {
  const [filterType, setFilterType] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load properties from Supabase (NOT localStorage!)
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Get unique property types for filter buttons
  const types = ['all', ...new Set(properties.map(p => p.type))];
  
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
      commercial: '🏪'
    };
    return icons[type] || '🏠';
  };

  // Get badge color
  const getTypeColor = (type) => {
    const colors = {
      plot: '#c9a84c',
      land: '#2ecc71',
      house: '#3498db',
      villa: '#9b59b6',
      commercial: '#e67e22'
    };
    return colors[type] || '#1e3a5f';
  };

  // Loading state
  if (loading) {
    return (
      <section style={styles.propertiesSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Available <span style={styles.goldText}>Properties</span></h2>
          <div style={styles.divider}></div>
          <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
            Loading properties...
          </p>
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
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Property Cards Grid */}
        <div style={styles.propertiesGrid}>
          {filteredProperties.length === 0 ? (
            <p style={styles.noProperties}>No properties available in this category</p>
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
                    <span>📏 {property.size}</span>
                    <span>💰 {property.price}</span>
                  </div>
                  <p style={styles.propertyDescription}>{property.description}</p>
                  <div style={styles.propertyFooter}>
                    <span style={styles.propertyDate}>📅 {property.dateAdded}</span>
                    <span style={styles.availableBadge}>
                      {property.available ? '✅ Available' : '❌ Sold'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

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
  },
  propertyDate: {
    fontSize: '12px',
  },
  availableBadge: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  noProperties: {
    textAlign: 'center',
    color: '#666',
    fontSize: '18px',
    padding: '40px 0',
  },
};

// Add media queries
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 768px) {
    .properties-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .properties-grid { grid-template-columns: 1fr; }
  }
`;
document.head.appendChild(styleSheet);
