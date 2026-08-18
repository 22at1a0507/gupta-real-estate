import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin credentials - CHANGE THESE!
  const ADMIN_PASSWORD = '197324';

  // Check if already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('❌ Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminLoggedIn');
    setPassword('');
  };

  // ============================================
  // LOGIN SCREEN (Shown when not authenticated)
  // ============================================
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <div style={styles.loginHeader}>
            <span style={styles.loginIcon}>🔒</span>
            <h2 style={styles.loginTitle}>Admin Login</h2>
            <p style={styles.loginSubtitle}>Enter your password to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} style={styles.loginForm}>
            <div style={styles.loginInputGroup}>
              <label style={styles.loginLabel}>Password</label>
              <input
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.loginInput}
                autoFocus
              />
            </div>

            {loginError && <p style={styles.loginError}>{loginError}</p>}

            <button type="submit" style={styles.loginBtn}>
              🔓 Login to Admin
            </button>

            <p style={styles.loginHint}>
              💡 Default password: <strong>gupta2026</strong>
              <br />
              <span style={styles.loginHintSmall}>(Contact admin for password)</span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // ADMIN PANEL (Only visible after login)
  // ============================================
  
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
    if (window.confirm('⚠️ Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(properties, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties-backup-${new Date().toISOString().split('T')[0]}.json`;
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
          if (Array.isArray(data)) {
            setProperties(data);
            localStorage.setItem('guptaProperties', JSON.stringify(data));
            alert('✅ Properties imported successfully!');
          } else {
            alert('❌ Invalid format. Please upload a valid properties array.');
          }
        } catch (err) {
          alert('❌ Invalid file format. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
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
      {/* Admin Header with Logout */}
      <div style={styles.adminHeader}>
        <div style={styles.adminTitleSection}>
          <h1 style={styles.adminTitle}>🏠 Property Admin Panel</h1>
          <span style={styles.adminBadge}>✅ Logged In</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>

      {/* Stats Bar */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{properties.length}</h3>
          <p style={styles.statLabel}>Total Properties</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{properties.filter(p => p.available).length}</h3>
          <p style={styles.statLabel}>Available</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{properties.filter(p => p.featured).length}</h3>
          <p style={styles.statLabel}>Featured</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionBar}>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>
          ➕ Add Property
        </button>
        <button onClick={handleExport} style={styles.exportBtn}>
          📥 Export Data
        </button>
        <label style={styles.importBtn}>
          📤 Import Data
          <input type="file" accept=".json" onChange={handleImport} style={styles.fileInput} />
        </label>
        <button onClick={() => {
          if (window.confirm('⚠️ Are you sure you want to delete ALL properties? This cannot be undone!')) {
            setProperties([]);
            localStorage.setItem('guptaProperties', JSON.stringify([]));
          }
        }} style={styles.clearBtn}>
          🗑️ Clear All
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={styles.formOverlay} onClick={() => {
          if (window.confirm('⚠️ Are you sure you want to close? Unsaved changes will be lost.')) {
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
          }
        }}>
          <div style={styles.formContainer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>{editingId ? '✏️ Edit Property' : '➕ Add New Property'}</h2>
              <button onClick={() => {
                if (window.confirm('⚠️ Are you sure you want to close? Unsaved changes will be lost.')) {
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
                }
              }} style={styles.closeBtn}>✕</button>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Prime Residential Plot"
                style={styles.formInput}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={styles.formInput}
                >
                  <option value="plot">📐 Plot</option>
                  <option value="land">🌾 Land</option>
                  <option value="house">🏠 House</option>
                  <option value="villa">🏰 Villa</option>
                  <option value="commercial">🏪 Commercial</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Size *</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="e.g., 1200 sq.ft"
                  style={styles.formInput}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Kurnool City Center"
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Price *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., ₹45 Lakhs"
                  style={styles.formInput}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
                style={styles.formInput}
              />
              <small style={styles.helpText}>💡 Upload images to imgbb.com or postimages.org and paste the URL</small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the property..."
                style={styles.formTextarea}
                rows="3"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Date Added</label>
                <input
                  type="date"
                  value={formData.dateAdded}
                  onChange={(e) => setFormData({...formData, dateAdded: e.target.value})}
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Status</label>
                <select
                  value={formData.available ? 'available' : 'sold'}
                  onChange={(e) => setFormData({...formData, available: e.target.value === 'available'})}
                  style={styles.formInput}
                >
                  <option value="available">✅ Available</option>
                  <option value="sold">❌ Sold</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                ⭐ Featured Property (shows with a star badge)
              </label>
            </div>

            <button onClick={editingId ? handleUpdate : handleAdd} style={styles.saveBtn}>
              {editingId ? '💾 Update Property' : '➕ Add Property'}
            </button>
          </div>
        </div>
      )}

      {/* Properties Table */}
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
                <td colSpan="8" style={styles.emptyState}>
                  📭 No properties added yet. Click "Add Property" to get started!
                </td>
              </tr>
            ) : (
              properties.map(property => (
                <tr key={property.id}>
                  <td>
                    <img 
                      src={property.image || 'https://via.placeholder.com/50x50?text=No+Image'} 
                      alt={property.title} 
                      style={styles.tableImage}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                      }}
                    />
                  </td>
                  <td style={styles.tableTitle}>
                    {property.featured && <span style={styles.featuredStar}>⭐</span>}
                    {property.title}
                  </td>
                  <td>
                    <span style={{...styles.typeBadge, background: getTypeColor(property.type)}}>
                      {getTypeIcon(property.type)} {property.type}
                    </span>
                  </td>
                  <td>{property.location}</td>
                  <td>{property.size}</td>
                  <td style={styles.tablePrice}>{property.price}</td>
                  <td>
                    <span style={property.available ? styles.availableBadge : styles.soldBadge}>
                      {property.available ? '✅ Available' : '❌ Sold'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(property.id)} style={styles.editBtn} title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(property.id)} style={styles.deleteBtn} title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>
        <p>💾 Changes are saved automatically in your browser's local storage.</p>
        <p>📌 <strong>Pro Tip:</strong> Use the Export button regularly to backup your data.</p>
      </div>
    </div>
  );
}

// ============ STYLES ============

const styles = {
  // Login Styles
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    padding: '20px',
  },
  loginBox: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    maxWidth: '420px',
    width: '100%',
    border: '1px solid #eee',
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  loginIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '10px',
  },
  loginTitle: {
    fontSize: '28px',
    color: '#1e3a5f',
    marginBottom: '5px',
  },
  loginSubtitle: {
    color: '#666',
    fontSize: '14px',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  loginInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  loginLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  },
  loginInput: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: '2px solid #ddd',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  loginError: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
    margin: '5px 0',
  },
  loginBtn: {
    background: '#c9a84c',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  loginHint: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#999',
    marginTop: '10px',
  },
  loginHintSmall: {
    fontSize: '11px',
    color: '#bbb',
  },

  // Admin Panel Styles
  adminPanel: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #eee',
  },
  adminTitleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  adminTitle: {
    color: '#1e3a5f',
    fontSize: '26px',
    margin: 0,
  },
  adminBadge: {
    background: '#2ecc71',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  logoutBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  statCard: {
    background: '#f8f9fb',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '32px',
    color: '#1e3a5f',
    margin: 0,
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
  actionBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  addBtn: {
    background: '#c9a84c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  exportBtn: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  importBtn: {
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block',
  },
  clearBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
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
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  formTitle: {
    color: '#1e3a5f',
    margin: 0,
  },
  closeBtn: {
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
  formLabel: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
    fontSize: '14px',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  formTextarea: {
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
    fontSize: '14px',
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
  tablePrice: {
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  featuredStar: {
    marginRight: '5px',
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
    fontSize: '13px',
  },
  soldBadge: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: '13px',
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
    fontSize: '13px',
  },
};
