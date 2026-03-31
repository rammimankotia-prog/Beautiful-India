const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const REMOTE_BASE_URL = 'https://bhaktikishakti.com/data';
const LOCAL_DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const FILES_TO_SYNC = [
  { name: 'guides.json', key: 'id' },
  { name: 'tours.json', key: 'id' },
  { name: 'bookings.json', key: 'id' },
  { name: 'reviews.json', key: 'id' },
  { name: 'leads.json', key: 'email' },
  { name: 'bike-tours.json', key: 'slug' }
];

async function fetchRemoteData(fileName) {
  return new Promise((resolve, reject) => {
    https.get(`${REMOTE_BASE_URL}/${fileName}?t=${Date.now()}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(`Failed to parse remote ${fileName}: ${e.message}`);
        }
      });
    }).on('error', (err) => {
      reject(`Network error for ${fileName}: ${err.message}`);
    });
  });
}

function mergeData(local, remote, keyName) {
  if (!Array.isArray(remote)) {
    console.warn(`[Warning] Remote data is not an array. Performing shallow merge.`);
    return { ...local, ...remote };
  }

  if (!Array.isArray(local)) {
    return remote;
  }

  // Use a map for efficient lookups
  const localMap = new Map(local.map(item => [item[keyName] || item.slug, item]));
  let addedCount = 0;
  let updatedCount = 0;

  remote.forEach(remoteItem => {
    const id = remoteItem[keyName] || remoteItem.slug;
    if (!id) return;

    if (localMap.has(id)) {
      // Check if remote is different/newer (simplified)
      const localItem = localMap.get(id);
      if (JSON.stringify(localItem) !== JSON.stringify(remoteItem)) {
        localMap.set(id, remoteItem);
        updatedCount++;
      }
    } else {
      localMap.set(id, remoteItem);
      addedCount++;
    }
  });

  return {
    merged: Array.from(localMap.values()),
    addedCount,
    updatedCount
  };
}

async function syncAll() {
  console.log('--- Production Data Sync Started ---');
  console.log(`Live Source: ${REMOTE_BASE_URL}`);
  
  for (const fileInfo of FILES_TO_SYNC) {
    try {
      const { name, key } = fileInfo;
      const localPath = path.join(LOCAL_DATA_DIR, name);
      
      console.log(`\nSyncing ${name}...`);
      
      // 1. Fetch Remote
      const remoteData = await fetchRemoteData(name);
      
      // 2. Read Local
      let localData = [];
      if (fs.existsSync(localPath)) {
        localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      }

      // 3. Merge
      const { merged, addedCount, updatedCount } = mergeData(localData, remoteData, key);

      // 4. Save
      fs.writeFileSync(localPath, JSON.stringify(merged, null, 2));
      
      console.log(`[Success] ${name}: +${addedCount} new, ~${updatedCount} updated.`);
      
    } catch (err) {
      console.error(`[Error] Failed to sync ${fileInfo.name}:`, err.message || err);
    }
  }
  
  console.log('\n--- Sync Complete ---');
  console.log('Run "git status" to see the updates, then commit your changes.');
}

syncAll();
