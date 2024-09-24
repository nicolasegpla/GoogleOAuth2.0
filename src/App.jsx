import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

function App() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: '691808607004-36psrendls4hseredij23on7bsce48pu.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive',
        });

        window.google.accounts.id.renderButton(
          document.getElementById('signInDiv'),
          { theme: 'outline', size: 'large' }
        );

        window.google.accounts.id.prompt(); 
      } else {
        console.error('Google Identity Services no está disponible.');
      }
    };

    const handleCredentialResponse = (response) => {
      console.log(response.credential);
      const decodedToken = jwtDecode(response.credential);
      setUser(decodedToken);
      console.log('User:', decodedToken);

      getAccessToken();
    };

    const getAccessToken = () => {
      if (window.google && window.google.accounts.oauth2) {
        window.google.accounts.oauth2.initTokenClient({
          client_id: '691808607004-36psrendls4hseredij23on7bsce48pu.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive',
          callback: (tokenResponse) => {
            console.log('Access Token:', tokenResponse.access_token);
            setAccessToken(tokenResponse.access_token);
          },
        }).requestAccessToken();
      } else {
        console.error('Google OAuth2 client no está disponible.');
      }
    };

  
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
    setAccessToken(null);
    window.google.accounts.id.disableAutoSelect();
    console.log('Sesión cerrada.');
  };

  return (
    <div className="App">
      {!user ? (
        <div id="signInDiv"></div>
      ) : (
        <div>
          <h2>Bienvenido, {user && user.name}</h2>
          <p>Email: {user && user.email}</p>
          <p>Access Token: {accessToken}</p> 
          <button onClick={handleSignOut}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export default App;
