import Script from 'next/script';
import React, { useEffect, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { apiGet } from '@/utils/apiFetch';

const GoogleLogin = ({ setGoogleLoginEmail, setGoogleSignUpData, type }) => {

  const login = useGoogleLogin({
    onSuccess: tokenResponse => getUserInfo(tokenResponse.access_token),
  })

  async function getUserInfoClient(token) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
  
      xhr.open('GET', `https://www.googleapis.com/oauth2/v3/userinfo`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300)
          resolve(JSON.parse(this.responseText));
        else resolve({ err: '404' });
      };
      xhr.send();
    });
  }
  

  async function getUserInfo(access_token) {
    try {
      // Send a GET request to a URL and await the response
      const response = await getUserInfoClient(access_token) 
      // Handle the response data
      if (type === 'login') {
        setGoogleLoginEmail(response)
      } else {
        setGoogleSignUpData(response)
      }
    } catch (error) {
      // Handle the error
      console.log(error)
    }
  }


  return (
    <>
      {/* <Head>
        <meta name="google-signin-client_id" content="951462741995-1npkf5pk8040520au7423vtrjkrug1k2.apps.googleusercontent.com"></meta>
    </Head> */}
      <Script src="https://accounts.google.com/gsi/client" async></Script>
      <a href="#"><img src="/images/google-logo.svg" alt="login" onClick={() => login()} /></a>
      {/* <div id='buttonDiv'></div> */}
    </>
  )
}

export default GoogleLogin