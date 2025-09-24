require('dotenv').config();
const {TWITCH_ID_CLIENT, TWITCH_SECRET,TWITCH_ADDRESS}= process.env;

let cachedToken = null;

async function fetchTwitchToken() {
    const twitchUrl = `${TWITCH_ADDRESS}?client_id=${TWITCH_ID_CLIENT}&client_secret=${TWITCH_SECRET}&grant_type=client_credentials`;
    const res = await fetch(twitchUrl, {method: 'POST'});

    if(!res.ok){
        const errBody = await res.text();
        console.error('Twitch auth failed:', res.status, errBody);
        throw new Error(`Twitch auth failed (${res.status})`);
    }
    const data = await res.json();

    const expiresAt = Date.now() + (data.expires_in *1000) - 60_000;
    cachedToken = {access_token: data.access_token, expiresAt: expiresAt};
}

async function getAccessToken() {
    if(!cachedToken || Date.now() >= cachedToken.expiresAt) {
        await fetchTwitchToken();
    }
    return cachedToken;
}

async function igdbQuery(query) {
    const token = await getAccessToken();

    const res = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token.access_token}`,
            'Client-ID': TWITCH_ID_CLIENT,
            Accept: 'application/json',
            'Content-Type': 'text/plain' 
        },
        body: query,
    });

    if (!res.ok) {
        throw new Error('failed to getch game from IGDB');
    }
    const json = await res.json();
    return json; 
}

//sanitise input
function escapeIgdbString(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

async function getGameByName(req, res) {
    const {name} = req.body;
    //input validation
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            message: 'Missing or empty "name" field, search failed',
        });
    }
    const safeName = escapeIgdbString(name.trim());
    const query = `
        search "${safeName}";
        fields id, name, cover.url;
        limit 10;
    `;
    try{
        let data = await igdbQuery(query);
        data = data.map(game => ({
            ...game,
            cover: game.cover?.url ? `https:${game.cover.url}` : null
        }));
        return res.status(200).json(data);
    } catch (error){
        console.error('IGDB search error:', error.message || error);
        
        return res.status(500).json({
            message: 'Failed to search IGDB',
        });
    }    
}

module.exports = { igdbQuery, getGameByName, getAccessToken };