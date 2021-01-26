import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

interface AppProps {}

const CLIENT_ID = '148855217959-fklc4npvuma48tmlrtnrvo2nr3ssumqd.apps.googleusercontent.com'
const CLIENT_SECRET = 'A4w3NwG5dWh-xP6ej9XUFgym'

// https://developers.google.com/identity/sign-in/devices

const CODE_CLIENT_ID = '148855217959-a07q1k9d8im2ue30qkvd3i5lm3g63h57.apps.googleusercontent.com'
const CODE_CLIENT_SECRET = 'HIeZ43_OO9_a6wHWbIQ4Mx2F'

function App({}: AppProps) {
  const [code, setCode] = useState<any>();

  async function codeAuth() {
    const data = new URLSearchParams();
    data.append('client_id', CODE_CLIENT_ID);
    data.append('scope', 'email profile');


    const res = await fetch('https://oauth2.googleapis.com/device/code', {
      method: 'POST',
      body: data,
    })
    const code = await res.json()
    console.log(code)
    setCode(code)

    navigator.clipboard.writeText(code.user_code)

    const newWindow = window.open(code.verification_url, 'name','height=200,width=150');
    newWindow?.focus();


    setInterval(async () => {
      const data = new URLSearchParams();
      data.append('client_id', CODE_CLIENT_ID);
      data.append('client_secret', CODE_CLIENT_SECRET);
      data.append('code', code.device_code);
      data.append('grant_type', 'http://oauth.net/grant_type/device/1.0');

      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: data,
      })
      console.log(await res.json())
    }, 2500)
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <a href={`https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&include_granted_scopes=true&response_type=token&redirect_uri=http://localhost:8080&client_id=${CLIENT_ID}`}>Navigate to login page</a> */}

        <button onClick={codeAuth}>Code auth</button>
        <code>{code?.user_code}</code>
        {code && <iframe src={code.verification_url} />}
        {/* {code && <a href={code.verification_url}>{code.verification_url}</a>} */}
      </header>
    </div>
  );
}

export default App;
