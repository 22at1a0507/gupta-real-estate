import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
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

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '197324';
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

  // ✅ Load properties from Supabase
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

  // Check if already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
    loadProperties();
  }, []);

  // Image Upload Function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('');

    if (!IMGBB_API_KEY) {
      alert('❌ ImgBB API key is not configured. Please add VITE_IMGBB_API_KEY.');
      e.target.value = '';
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      alert('❌ Image size should be less than 32MB');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('❌ Please upload an image file');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadStatus('📤 Uploading image...');

    try {
      const formDataImg = new FormData();
      formDataImg.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formDataImg
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url || data.data.display_url;
        setFormData({ ...formData, image: imageUrl });
        setUploadStatus('✅ Image uploaded successfully!');
        alert('✅ Image uploaded successfully!');
      } else {
        const errorMsg = data.error?.message || 'Unknown error';
        setUploadStatus('❌ Upload failed: ' + errorMsg);
        alert('❌ Upload failed: ' + errorMsg);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Upload failed. Check console for details.');
      alert('❌ Upload failed. Please check your internet connection.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

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

  // ✅ Add property to Supabase
  const handleAdd = async () => {
    if (!formData.title || !formData.location || !formData.size || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([formData])
        .select();

      if (error) throw error;

      setProperties([data[0], ...properties]);
      setShowForm(false);
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
      
      // ✅ Notify Properties page to refresh
      window.dispatchEvent(new Event('propertyUpdated'));
      alert('✅ Property added successfully!');
    } catch (error) {
      console.error('Error adding property:', error);
      alert('❌ Error adding property. Please try again.');
    }
  };

  // ✅ Update property in Supabase
  const handleUpdate = async () => {
    if (!formData.title || !formData.location || !formData.size || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', editingId);

      if (error) throw error;

      setProperties(properties.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      ));
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
      
      // ✅ Notify Properties page to refresh
      window.dispatchEvent(new Event('propertyUpdated'));
      alert('✅ Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('❌ Error updating property. Please try again.');
    }
  };

  // ✅ Delete property from Supabase
  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProperties(properties.filter(p => p.id !== id));
      
      // ✅ Notify Properties page to refresh
      window.dispatchEvent(new Event('propertyUpdated'));
      alert('✅ Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('❌ Error deleting property. Please try again.');
    }
  };

  const handleEdit = (id) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setFormData(property);
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleExport = () => {
    if (properties.length === 0) {
      alert('No properties to export.');
      return;
    }
    const dataStr = JSON.stringify(properties, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (Array.isArray(data)) {
            const { error } = await supabase
              .from('properties')
              .insert(data);
            
            if (error) throw error;
            
            await loadProperties();
            window.dispatchEvent(new Event('propertyUpdated'));
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

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  // Login Screen
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
          </form>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div style={styles.adminPanel}>
      {/* Admin Header */}
      <div style={styles.adminHeader}>
        <div style={styles.adminTitleSection}>
          <h1 style={styles.adminTitle}>🏠 Property Admin Panel</h1>
          <span style={styles.adminBadge}>✅ Logged In</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>

      {/* Stats */}
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
        <button onClick={async () => {
          if (window.confirm('⚠️ Are you sure you want to delete ALL properties? This cannot be undone!')) {
            try {
              const { error } = await supabase
                .from('properties')
                .delete()
                .neq('id', 0);
              
              if (error) throw error;
              await loadProperties();
              window.dispatchEvent(new Event('propertyUpdated'));
              alert('✅ All properties cleared!');
            } catch (error) {
              alert('❌ Error clearing properties. Please try again.');
            }
          }
        }} style={styles.clearBtn}>
          🗑️ Clear All
        </button>
      </div>

      {/* Form Modal */}
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

            {/* Image Upload Section */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Property Image</label>
              <div style={styles.imageUploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                  id="imageUpload"
                  disabled={uploading}
                />
                <label htmlFor="imageUpload" style={styles.uploadLabel}>
                  {uploading ? '⏳ Uploading...' : '📸 Click to Upload Image'}
                </label>
                {uploadStatus && (
                  <p style={{ 
                    marginTop: '8px', 
                    fontSize: '14px',
                    color: uploadStatus.includes('✅') ? '#2ecc71' : '#e74c3c'
                  }}>
                    {uploadStatus}
                  </p>
                )}
                {formData.image && (
                  <div style={styles.imagePreview}>
                    <img src={formData.image} alt="Property" style={styles.previewImage} />
                    <button 
                      onClick={() => setFormData({...formData, image: ''})}
                      style={styles.removeImageBtn}
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>
              <small style={styles.helpText}>📱 Works on mobile, laptop, and tablet! Supported formats: JPG, PNG, GIF</small>
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
                ⭐ Featured Property
              </label>
            </div>

            <button onClick={editingId ? handleUpdate : handleAdd} style={styles.saveBtn} disabled={uploading}>
              {uploading ? '⏳ Uploading Image...' : (editingId ? '💾 Update Property' : '➕ Add Property')}
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
        <p>💾 Data is stored securely in Supabase database.</p>
        <p>📌 <strong>Pro Tip:</strong> Use the Export button regularly to backup your data.</p>
      </div>
    </div>
  );
}

// ============ STYLES ============

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    color: '#666',
    fontSize: '18px',
  },
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
    padding: '5px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '14px',
  },
  deleteBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px',
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
  imageUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  uploadLabel: {
    display: 'inline-block',
    background: '#f0f4f8',
    color: '#1e3a5f',
    padding: '12px 20px',
    borderRadius: '8px',
    border: '2px dashed #c9a84c',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  imagePreview: {
    position: 'relative',
    display: 'inline-block',
    marginTop: '10px',
  },
  previewImage: {
    width: '100%',
    maxWidth: '300px',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #eee',
  },
  removeImageBtn: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Add media queries for mobile responsiveness
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 768px) {
    .formRow {
      grid-template-columns: 1fr !important;
    }
    .stats {
      grid-template-columns: 1fr 1fr !important;
    }
    .adminHeader {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
document.head.appendChild(styleSheet);
