const axios = require('axios');

async function logData() {
    try {
        const url = 'https://tt.8share.pro/socolive';
        const proxyUrl = `http://localhost:3000/api/iptv?url=${encodeURIComponent(url)}`;
        
        console.log('Testing API:', proxyUrl);
        const response = await axios.get(proxyUrl);
        console.log('Response status:', response.status);
        
        // Log the entire data
        console.log('Full data:', response.data);
        
        // Log each channel's data
        if (response.data.groups) {
            response.data.groups.forEach(group => {
                console.log(`\nGroup: ${group.name}`);
                if (group.channels) {
                    console.log(`Number of channels: ${group.channels.length}`);
                    group.channels.forEach((channel, index) => {
                        console.log(`Channel ${index + 1}:`, channel);
                    });
                }
                
                if (group.groups) {
                    group.groups.forEach(subGroup => {
                        console.log(`\nSubgroup: ${subGroup.name}`);
                        if (subGroup.channels) {
                            console.log(`Number of channels: ${subGroup.channels.length}`);
                            subGroup.channels.forEach((channel, index) => {
                                console.log(`Channel ${index + 1}:`, channel);
                            });
                        }
                    });
                }
            });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

logData();