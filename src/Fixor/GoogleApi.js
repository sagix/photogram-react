import React, { useEffect, useState } from 'react';

function loadScript(src, callback) {
  var tag = document.createElement('script');
  tag.src = src;
  tag.onload = callback;
  document.body.appendChild(tag);
}

function GoogleApi(props) {
  const [loaded, setLoaded] = useState(false);
  const [signin, setSignin] = useState(false);
  const [error, setError] = useState(null);

  function handleClientLoad() {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.load('drive', 'v3', initClient)
    });
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    window.gapi.client.init({
      apiKey: props.apiKey,
      clientId: props.clientId,
      discoveryDocs: props.discoveryDocs,
      scope: props.scope
    }).then(() => {
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error) => {
      console.warn(error);
      setError("Api error");
    });
  }

  function updateSigninStatus(isSignedIn) {
    setSignin(isSignedIn);
  }

  useEffect(() => {
    if (window.gapi === undefined) {
      loadScript("https://apis.google.com/js/api.js", () => {
        setLoaded(true);
        setError(window.gapi !== undefined ? null : "Api not loaded");
        handleClientLoad()
      })
    }
  });

  function signIn() {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  function signOut() {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  const children = React.Children.map(props.children, (child, index) => {
    return React.cloneElement(child, {
      index,
      gapi: signin ? window.gapi : undefined
    });
  });

  return (
    <div>
      <p>{loaded ? (
        <span>
          {children}
          {gApiButton(signin, signIn, signOut)}
        </span>
      ) : (
        <strong>Loading...</strong>
      )
      }
        <span>{error}</span>
      </p>
    </div>
  );
}

function gApiButton(signed, signIn, signOut) {
  if (signed) {
    return (<button onClick={signOut} >Sign out</button>)
  } else {
    return (<button onClick={signIn} >Sign in</button>)
  }
}

export default GoogleApi
