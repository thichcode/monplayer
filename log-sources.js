const axios = require('axios');

async function logSources() {
    try {
        const url = 'https://tt.8share.pro/socolive';
        const proxyUrl = `http://localhost:3000/api/iptv?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(proxyUrl);
        
        if (response.data.groups) {
            response.data.groups.forEach(group => {
                if (group.channels) {
                    group.channels.forEach((channel, index) => {
                        console.log(`\nChannel ${index + 1}: ${channel.name}`);
                        if (channel.sources) {
                            channel.sources.forEach(source => {
                                console.log(`Source: ${source.name}`);
                                if (source.contents) {
                                    source.contents.forEach((content, cIndex) => {
                                        console.log(`Content ${cIndex + 1}:`, content);
                                    });
                                }
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

logSources();