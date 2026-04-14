import fs from 'fs';
const path = 'src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('import { api }')) {
  content = content.replace("import { useAuth } from '@/lib/AuthContext';", "import { useAuth } from '@/lib/AuthContext';\nimport { api } from '@/api/apiClient';");
}

// 2. Replace cityStatuses init & useEffect
const newInit = `  const [cityStatuses, setCityStatuses] = useState(() => {
    const saved = localStorage.getItem('cityStatuses');
    return saved ? JSON.parse(saved) : {};
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      const fetchStatuses = async () => {
        try {
          const data = await api.get('/city-statuses');
          if (data && data.length > 0) {
            const newObj = {};
            data.forEach(item => {
              newObj[\`\${item.state_id}_\${item.city_name}\`] = item.status;
              if (item.status_timestamp) {
                newObj[\`\${item.state_id}_\${item.city_name}_timestamp\`] = item.status_timestamp;
              }
            });
            setCityStatuses(newObj);
            localStorage.setItem('cityStatuses', JSON.stringify(newObj));
          } else {
            // Local storage migration
            const saved = localStorage.getItem('cityStatuses');
            if (saved) {
              const parsed = JSON.parse(saved);
              const arrayToSync = Object.keys(parsed)
                .filter(k => !k.includes('_timestamp') && !k.includes('_resubmit'))
                .map(k => {
                   const [stateId, cityName] = k.split('_');
                   return {
                     state_id: parseInt(stateId),
                     city_name: cityName,
                     status: parsed[k],
                     status_timestamp: parsed[\`\${k}_timestamp\`] || null
                   };
                });
              if (arrayToSync.length > 0) {
                await api.post('/city-statuses', arrayToSync);
              }
            }
          }
        } catch(e) {
          console.error("Failed to fetch statuses", e);
        }
      };
      fetchStatuses();
    }
  }, [isAuthenticated]);`;

// Need a flexible search since CR LF characters might differ
const initRegex = /  const \[cityStatuses, setCityStatuses\] = useState\(\(\) => \{\s*const saved = localStorage\.getItem\('cityStatuses'\);\s*return saved \? JSON\.parse\(saved\) : \{\};\s*\}\);/;
console.log('Match init:', initRegex.test(content));
if (content.match(initRegex) && !content.includes('await api.get(\'/city-statuses\')')) {
  content = content.replace(initRegex, newInit);
}

// 3. Replace handleStatusChange
const oldHandle = /  \/\/ Handle status change\s+const handleStatusChange = useCallback\(\(cityName, status\) => \{[\s\S]*?localStorage\.setItem\('cityStatuses', JSON\.stringify\(newStatuses\)\);\s*\}, \[selectedState, cityStatuses\]\);/;

const newHandle = `  // Handle status change
  const handleStatusChange = useCallback((cityName, status) => {
    if (!selectedState) return;

    const key = \`\${selectedState.id}_\${cityName}\`;
    const newStatuses = { ...cityStatuses, [key]: status };

    // Set timestamp when status changes to any non-neutral status (CST timezone)
    let timestampToUse = null;
    if (status !== 'neutral') {
      const cstDate = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
      timestampToUse = new Date(cstDate).toISOString();
      newStatuses[\`\${key}_timestamp\`] = timestampToUse;
    } else {
      // Clear timestamp when reset to neutral
      delete newStatuses[\`\${key}_timestamp\`];
    }

    setCityStatuses(newStatuses);
    localStorage.setItem('cityStatuses', JSON.stringify(newStatuses));

    if (isAuthenticated) {
      api.post('/city-statuses', {
        state_id: selectedState.id,
        city_name: cityName,
        status: status,
        status_timestamp: timestampToUse
      }).catch(e => console.error("Failed to sync", e));
    }
  }, [selectedState, cityStatuses, isAuthenticated]);`;

console.log('Match handle:', oldHandle.test(content));
if (content.match(oldHandle)) {
  content = content.replace(oldHandle, newHandle);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Home.jsx updated successfully.');
