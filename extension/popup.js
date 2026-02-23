const SUPABASE_URL = 'https://erhalnpgzttnhiilopcp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-Gi3ASdyuqDCisD_jCweqQ_oFP4qIQG';

// Initialize Supabase
let supabase;

async function checkAuth() {
  const authSection = document.getElementById('auth-section');
  const mainSection = document.getElementById('main-section');
  const userDisplay = document.getElementById('user-display');
  
  // Try to find session in background script or common storage
  const { session } = await chrome.storage.local.get('session');
  
  if (session && session.user) {
    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    userDisplay.textContent = `Connecté: ${session.user.email}`;
    return session;
  } else {
    authSection.classList.remove('hidden');
    mainSection.classList.add('hidden');
    return null;
  }
}

document.getElementById('login-btn').addEventListener('click', () => {
  // Opening the web app to allow the user to log in and then sync the session back
  chrome.tabs.create({ url: 'https://job-tracker-opal-ten.vercel.app/login' });
});

document.getElementById('scrape-btn').addEventListener('click', async () => {
  const btn = document.getElementById('scrape-btn');
  const text = document.getElementById('btn-text');
  const loader = document.getElementById('btn-loader');
  const message = document.getElementById('message');
  
  btn.disabled = true;
  text.textContent = 'Capture en cours...';
  loader.classList.remove('hidden');
  message.textContent = '';
  
  try {
    // 1. Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 2. Execute content script to scrape
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return {
          title: document.title,
          url: window.location.href,
          content: document.body.innerText.substring(0, 5000) // Limit size
        };
      }
    });
    
    const scrapeData = result[0].result;
    
    // 3. Save to Supabase (using the stored session)
    const { session } = await chrome.storage.local.get('session');
    if (!session || !session.access_token) throw new Error('Session manquante. Reconnectez-vous.');

    // Initialize client manually with session token
    const client = self.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    });

    // Determine some basic info from page
    const company = scrapeData.title.split('|')[1]?.trim() || scrapeData.title.split('-')[1]?.trim() || 'Entreprise Inconnue';
    const profile = scrapeData.title.split('|')[0]?.trim() || scrapeData.title.split('-')[0]?.trim() || 'Poste Inconnu';

    const { error } = await client
      .from('applications')
      .insert([
        { 
          user_id: session.user.id,
          company_name: company,
          job_profile: profile,
          job_url: scrapeData.url,
          status: 'applied',
          notes: `Capturé le ${new Date().toLocaleDateString()}\n\nContenu:\n${scrapeData.content}`
        }
      ]);

    if (error) throw error;

    message.textContent = 'Offre ajoutée avec succès !';
    message.className = 'success';
    text.textContent = 'Enregistré !';
  } catch (err) {
    console.error(err);
    message.textContent = `Erreur: ${err.message}`;
    message.className = 'error';
    text.textContent = 'Réessayer';
  } finally {
    loader.classList.add('hidden');
    btn.disabled = false;
  }
});

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Check if we can grab a session from the main app domain if a tab is open
  const tabs = await chrome.tabs.query({ url: '*://job-tracker-opal-ten.vercel.app/*' });
  if (tabs.length > 0) {
    const sessionRes = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        return localStorage.getItem('sb-erhalnpgzttnhiilopcp-auth-token');
      }
    });
    
    const rawSession = sessionRes[0].result;
    if (rawSession) {
      const session = JSON.parse(rawSession);
      await chrome.storage.local.set({ session });
    }
  }
  
  checkAuth();
});
