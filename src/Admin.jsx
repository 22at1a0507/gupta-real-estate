import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'plot',
    location: '',
    size: '',
    price: '',
    image: '',
    description: '',
    featured: false,
    available: true,
    dateAdded: new Date().toISOString().split('T')[0]
  });

  // Load properties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('guptaProperties');
    if (saved) {
      setProperties(JSON.parse(saved));
    } else {
      // Default properties if none exist
      const defaults = [
        {
          id: 1,
          type: 'plot',
          title: 'Prime Residential Plot',
          location: 'Kurnool City Center',
          size: '1200 sq.ft',
          price: '₹45 Lakhs',
          image: 'https://via.placeholder.com/400x300?text=Plot+1',
          description: 'Excellent residential plot in prime location.',
          featured: true,
          available: true,
          dateAdded: '2026-07-20'
        },
        {
          id: 2,
          type: 'land',
          title: 'Agricultural Land',
          location: 'Nandyal Highway Road',
          size: '2 Acres',
          price: '₹1.2 Crores',
          image: 'https://via.placeholder.com/400x300?text=Land+1',
          description: 'Fertile agricultural land with water supply.',
          featured: false,
          available: true,
          dateAdded: '2026-07-18'
        }
      ];
      setProperties(defaults);
      localStorage.setItem('guptaProperties', JSON.stringify(defaults));
    }
  }, []);

  // Save to localStorage whenever properties change
  useEffect(() => {
    if (properties.length > 0) {
      localStorage.setItem('guptaProperties', JSON.stringify(properties));
    }
  }, [properties]);

  const handleAdd = () => {
    const newProperty = {
      id: Date.now(),
      ...formData
    };
    setProperties([...properties, newProperty]);
    setFormData({
      title: '',
      type: 'plot',
      location: '',
      size: '',
      price: '',
      image: '',
      description: '',
      featured: false,
      available: true,
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const property = properties.find(p => p.id === id);
    setFormData(property);
    setEditingId(id);
    setShowForm(true);
  };

  const handleUpdate = () => {
    setProperties(properties.map(p => 
      p.id === editingId ? { ...formData, id: editingId } : p
    ));
    setFormData({
      title: '',
      type: 'plot',
      location: '',
      size: '',
      price: '',
      image: '',
      description: '',
      featured: false,
      available: true,
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(properties, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setProperties(data);
          localStorage.setItem('guptaProperties', JSON.stringify(data));
          alert('Properties imported successfully!');
        } catch (err) {
          alert('Invalid file format. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getTypeIcon = (type) => {
    const icons = { plot: '📐', land: '🌾', house: '🏠', villa: '🏰', commercial: '🏪' };
    return icons[type] || '🏠';
  };

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

  return (
    <div style={styles.adminPanel}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏠 Property Admin Panel</h1>
        <div style={styles.headerActions}>
          <button onClick={() => setShowForm(true)} style={styles.addBtn}>
            ➕ Add Property
          </button>
          <button onClick={handleExport} style={styles.exportBtn}>
            📥 Export
          </button>
          <label style={styles.importBtn}>
            📤 Import
            <input type="file" accept=".json" onChange={handleImport} style={styles.fileInput} />
          </label>
        </div>
      </div>

      {showForm && (
        <div style={styles.formOverlay}>
          <div style={styles.formContainer}>
            <h2>{editingId ? '✏️ Edit Property' : '➕ Add New Property'}</h2>
            <button onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({
                title: '',
                type: 'plot',
                location: '',
                size: '',
                price: '',
                image: '',
                description: '',
                featured: false,
                available: true,
                dateAdded: new Date().toISOString().split('T')[0]
              });
            }} style={styles.closeBtn}>✕</button>
            
            <div style={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Prime Residential Plot"
                style={styles.input}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={styles.input}
                >
                  <option value="plot">Plot</option>
                  <option value="land">Land</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label>Size *</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="e.g., 1200 sq.ft"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Kurnool City Center"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Price *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., ₹45 Lakhs"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label>Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
                style={styles.input}
              />
              <small style={styles.helpText}>Upload images to imgbb.com or postimages.org and paste the URL</small>
            </div>

            <div style={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the property..."
                style={styles.textarea}
                rows="3"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Date Added</label>
                <input
                  type="date"
                  value={formData.dateAdded}
                  onChange={(e) => setFormData({...formData, dateAdded: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Status</label>
                <select
                  value={formData.available ? 'available' : 'sold'}
                  onChange={(e) => setFormData({...formData, available: e.target.value === 'available'})}
                  style={styles.input}
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  Featured Property
                </label>
              </div>
            </div>

            <button onClick={editingId ? handleUpdate : handleAdd} style={styles.saveBtn}>
              {editingId ? '💾 Update Property' : '➕ Add Property'}
            </button>
          </div>
        </div>
      )}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>{properties.length}</h3>
          <p>Total Properties</p>
        </div>
        <div style={styles.statCard}>
          <h3>{properties.filter(p => p.available).length}</h3>
          <p>Available</p>
        </div>
        <div style={styles.statCard}>
          <h3>{properties.filter(p => p.featured).length}</h3>
          <p>Featured</p>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Type</th>
              <th>Location</th>
              <th>Size</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan="8" style={styles.emptyState}>No properties added yet. Click "Add Property" to get started!</td>
              </tr>
            ) : (
              properties.map(property => (
                <tr key={property.id}>
                  <td>
                    <img src={property.image || 'https://via.placeholder.com/50x50?text=No+Image'} alt={property.title} style={styles.tableImage} />
                  </td>
                  <td style={styles.tableTitle}>{property.title}</td>
                  <td>
                    <span style={{...styles.typeBadge, background: getTypeColor(property.type)}}>
                      {getTypeIcon(property.type)} {property.type}
                    </span>
                  </td>
                  <td>{property.location}</td>
                  <td>{property.size}</td>
                  <td>{property.price}</td>
                  <td>
                    <span style={property.available ? styles.availableBadge : styles.soldBadge}>
                      {property.available ? '✅ Available' : '❌ Sold'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(property.id)} style={styles.editBtn}>✏️</button>
                    <button onClick={() => handleDelete(property.id)} style={styles.deleteBtn}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>
        <p>💡 Changes are saved automatically in your browser.</p>
        <p>📌 To make changes permanent, use the Export button to download a backup.</p>
      </div>
    </div>
  );
}

const styles = {
  adminPanel: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee',
  },
  title: {
    color: '#1e3a5f',
    fontSize: '28px',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  addBtn: {
    background: '#c9a84c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  exportBtn: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  importBtn: {
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block',
  },
  fileInput: {
    display: 'none',
  },
  formOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  formContainer: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'normal',
    cursor: 'pointer',
  },
  helpText: {
    display: 'block',
    color: '#999',
    fontSize: '12px',
    marginTop: '4px',
  },
  saveBtn: {
    background: '#c9a84c',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: '#f8f9fb',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  tableContainer: {
    overflow: 'auto',
    borderRadius: '12px',
    border: '1px solid #eee',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  tableTitle: {
    fontWeight: 'bold',
  },
  typeBadge: {
    color: 'white',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    display: 'inline-block',
  },
  availableBadge: {
    color: '#2ecc71',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  soldBadge: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  editBtn: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
  footer: {
    marginTop: '20px',
    padding: '15px',
    background: '#f8f9fb',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
  },
};
