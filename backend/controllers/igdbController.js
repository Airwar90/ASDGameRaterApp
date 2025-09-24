const TWITCH_ID_CLIENT = process.env.TWITCH_ID_CLIENT;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const TWITCH_ADDRESS = process.env.TWITCH_ADDRESS;

let cachedToken = null;

async function fetchTwitchToken() {
    const twitchUrl = `${TWITCH_ADDRESS}?client_id=${TWITCH_ID_CLIENT}&client_secret=${TWITCH_SECRET}&grant_type=client_credentials`;
    const res = await fetch(twitchUrl, {method: 'POST'});

    if(!res.ok){
        throw new Error('Twitch auth failed.');
    }
    const data = res.json();

    const expiresAt = Date.now() + data.expires_in *1000 - 60_000;
    cachedToken = {token: data.access_token, expiresAt};
}

async function getAccessToken() {
    if(!cachedToken || Date.now() >= cachedToken.expiresAt) {
        await fetchTwitchToken();
    }
    return cachedToken;
}

async function igbdQuery(query) {
    const token = await getAccessToken();

    const res = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Client-ID': TWITCH_ID_CLIENT,
            Accept: 'application/json',
            'Content-Type': 'text/plain' 
        },
        body: query,
    });

    if (!res.ok) {
        throw new Error('failed to getch game from IGDB');
    }
}

async function getGameByName(name) {
    //input validation
    if(!name) {
        throw new Error('missing game name, search failed');
    }
    const query = `fields id,name,cover; search "${name}"; limit 10`;
    return igbdQuery(query);
}