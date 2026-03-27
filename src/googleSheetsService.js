// Google Sheets integration service
// Note: This requires a Google Cloud Project with Sheets API enabled and OAuth setup

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export const syncToGoogleSheets = async (spreadsheetId, entries) => {
  try {
    // This is a simplified version - in production you'd need proper OAuth flow
    const accessToken = localStorage.getItem('google_access_token');
    
    if (!accessToken) {
      throw new Error('Google authentication required');
    }
    
    // Prepare data for Google Sheets
    const values = entries.map(entry => [
      entry.firstName || '',
      entry.lastName || '',
      entry.phone || '',
      entry.location || '',
      entry.invitedBy || '',
      entry.invitedPhone || '',
      new Date(entry.createdAt).toLocaleString(),
      entry.EntryBy || '',
      entry.synced === 1 ? 'Synced' : 'Unsynced'
    ]);
    
    // Add headers if this is the first sync
    const headers = [
      ['First Name', 'Last Name', 'Phone', 'Location', 'Invited By', 'Inviter Phone', 'Created At', 'Entered By', 'Sync Status']
    ];
    
    const allData = [...headers, ...values];
    
    const response = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: allData
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync to Google Sheets');
    }
    
    const result = await response.json();
    return { success: true, updatedRows: result.updates?.updatedRows || 0 };
    
  } catch (error) {
    console.error('Google Sheets sync failed:', error);
    return { success: false, error: error.message };
  }
};

export const initiateGoogleAuth = () => {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with actual client ID
  const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
  const scope = encodeURIComponent('https://www.googleapis.com/auth/spreadsheets');
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=${scope}&` +
    `response_type=code&` +
    `access_type=offline`;
  
  window.location.href = authUrl;
};

export const handleAuthCallback = async (code) => {
  try {
    // Exchange authorization code for access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        client_secret: 'YOUR_GOOGLE_CLIENT_SECRET',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: window.location.origin + '/auth/callback'
      })
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('google_access_token', data.access_token);
      localStorage.setItem('google_refresh_token', data.refresh_token);
      return { success: true };
    } else {
      throw new Error('Failed to obtain access token');
    }
  } catch (error) {
    console.error('Auth callback failed:', error);
    return { success: false, error: error.message };
  }
};

export const checkGoogleAuth = () => {
  return !!localStorage.getItem('google_access_token');
};
