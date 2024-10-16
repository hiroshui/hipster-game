import axios from 'axios';

// Typisiere die JSON-Daten
interface TokenData {
  clientId: string;
  clientSecret: string;
}

export const getSpotifyToken = async (): Promise<string | null> => {
  try {
    // Lies die token.json Datei
    const tokenData: TokenData = await import('../token.json');

    const clientId = tokenData.clientId;
    const clientSecret = tokenData.clientSecret;

    // Encode clientId und clientSecret in Base64
    const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

    // Mache eine POST-Anfrage an die Spotify Authorization API
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'client_credentials',
    }), {
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    
    //console.log("token received", response.data.access_token);

    // Zugriffstoken zurückgeben
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return null;
  }
};
