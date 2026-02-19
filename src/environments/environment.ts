export const environment = {
    production: false,
    supabaseUrl: 'https://aetjcayfcvivslvlpsyd.supabase.co',
    supabaseKey: 'sb_publishable_jhHupLQkfnME8dycXTg7xA_BCLj2JaC'
};

export const getRedirectUrl = () => {
    const origin = window.location.origin;
    
    // Localhost
    if (origin.includes('localhost')) {
        return 'http://localhost:3000';
    }

    // LAN (192.168.x.x, 10.x.x.x, 172.x.x.x)
    if (origin.match(/^http:\/\/(192\.168\.|10\.|172\.)/)) {
        // Keep the current IP but ensure port 3000
        const ip = window.location.hostname;
        return `http://${ip}:3000`;
    }

    // Production (Vercel or other)
    return origin;
};
