import React, { useEffect, useState } from "react"

const FACEBOOK_APP_ID = "948060156447892"

if (process.browser) {
  const script = document.createElement("script");
  script.src = `data:text/javascript;base64,${btoa(`(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));`)}`

  document.body.appendChild(script)
  window.fbAsyncInit = function () {
    FB.init({
      appId: FACEBOOK_APP_ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: "v12.0" // <-- Specify the version of the Facebook SDK here
    })

    FB.AppEvents.logPageView();   
  }
}

const FacebookLogin = ({ setFacebookLoginEmail, setFacebookSignUpData, type }) => {
  const loginWithFacebook = () => { 

    FB.login(function(response) {
        
      if (response.authResponse) {
        const { accessToken } = response.authResponse
        console.log('accessToken', accessToken)
        FB.api("/me", { fields: "email,name" }, function (response) {
          console.log("response :>> ", response)
          const { email } = response
          // Send email and social ID to backend for verification
          if (type === 'login') {
            setFacebookLoginEmail(email)
          } else {
            setFacebookSignUpData(response)
          }
        })
      } else {
        console.log("User cancelled login or did not fully authorize.")
      }

    }, {
        scope: 'email', 
        return_scopes: true
    });
    
  }

  return (
    <>
      <a href="#">
        <img
          src="/images/facebook-btn.svg"
          alt="login"
          onClick={loginWithFacebook}
        />
      </a>
      {/* <div id="buttonDiv"></div> */}
    </>
  )
}

export default FacebookLogin
