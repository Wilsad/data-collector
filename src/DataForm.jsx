import { useState } from 'react';
import { saveEntryLocally } from './db';
import { syncToFirebase } from './syncService';

const DataForm = ({ currentUser, onEntryAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    invitedBy: '',
    invitedPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await saveEntryLocally({
        ...formData,
        EntryBy: currentUser || 'Anonymous'
      });
      
      setSyncStatus('Saved locally! Syncing when online...');
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        location: '',
        invitedBy: '',
        invitedPhone: ''
      });
      
      // Try to sync immediately
      const syncResult = await syncToFirebase();
      if (syncResult.success) {
        setSyncStatus(`Saved and synced ${syncResult.synced} entries!`);
      }
      
      onEntryAdded && onEntryAdded();
      
      setTimeout(() => setSyncStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save entry:', error);
      setSyncStatus('Error saving entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container enhanced-form">
      <div className="form-card">
        <div className="form-header">
          <h1>Data Collector</h1>
          <p>Add New Data Entry</p>
        </div>

        {syncStatus && <div className="sync-status">{syncStatus}</div>}

        <form onSubmit={handleSubmit} className="enhanced-data-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              autoComplete="on"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invitedBy">Invited By</label>
              <input
                type="text"
                id="invitedBy"
                name="invitedBy"
                value={formData.invitedBy}
                onChange={handleChange}
                placeholder="Who invited them?"
                autoComplete="on"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="invitedPhone">Inviter Contact</label>
              <input
                type="tel"
                id="invitedPhone"
                name="invitedPhone"
                value={formData.invitedPhone}
                onChange={handleChange}
                placeholder="Inviter's contact number"
                autoComplete="on"
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="enhanced-submit-btn">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataForm;
