const axios = require('axios');

async function testAPI() {
    try {
        const url = 'https://tt.8share.pro/socolive';
        const proxyUrl = `http://localhost:3000/api/iptv?url=${encodeURIComponent(url)}`;
        
        console.log('Testing API:', proxyUrl);
        const response = await axios.get(proxyUrl);
        console.log('Response status:', response.status);
        console.log('Data:', response.data);
        
        console.log('\nChannels in data:', countChannels(response.data));
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

function countChannels(data) {
    let count = 0;
    
    if (data.groups && Array.isArray(data.groups)) {
        data.groups.forEach(group => {
            if (group.channels && Array.isArray(group.channels)) {
                count += group.channels.length;
                console.log(`Group "${group.name}" has ${group.channels.length} channels`);
            }
            
            if (group.groups && Array.isArray(group.groups)) {
                group.groups.forEach(subGroup => {
                    if (subGroup.channels && Array.isArray(subGroup.channels)) {
                        count += subGroup.channels.length;
                        console.log(`Subgroup "${subGroup.name}" has ${subGroup.channels.length} channels`);
                    }
                });
            }
        });
    }
    
    return count;
}

testAPI();