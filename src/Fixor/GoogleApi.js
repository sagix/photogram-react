import React, { Component } from 'react';

function loadScript(src, callback) {
   var tag = document.createElement('script');
   tag.src = src;
   tag.onload = callback;
   document.body.appendChild(tag);
 }

class GoogleApi extends Component{
  constructor(props){
      super(props)
      this.state ={
          loaded:false,
          signin:false,
          error:null,
      }
  }

  handleClientLoad() {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.load('drive', 'v3', this.initClient)
      });
  }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
   initClient= () => {
    window.gapi.client.init({
      apiKey: this.props.apiKey,
      clientId: this.props.clientId,
      discoveryDocs: this.props.discoveryDocs,
      scope: this.props.scope
    }).then( () => {
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error) =>{
      console.warn(error);
      this.setState(Object.assign(this.state, {
        error : "Api error"
      }))
    });
  }

  updateSigninStatus= (isSignedIn)=>{
    this.setState(Object.assign(this.state, {
      signin : isSignedIn
    }))
  }

  componentDidMount(){
    if(window.gapi === undefined){
      loadScript("https://apis.google.com/js/api.js", () => {
        this.setState({
          loaded: true,
          error : window.gapi !== undefined ? null : "Api not loaded"
        })
        this.handleClientLoad()
      })
    }
  }

  signIn(){
    window.gapi.auth2.getAuthInstance().signIn();
  }

  signOut(){
    window.gapi.auth2.getAuthInstance().signOut();
  }

  render(){
    const children = React.Children.map(this.props.children, (child, index) => {
        return React.cloneElement(child, {
            index,
            gapi: this.state.signin ? window.gapi : undefined
        });
    });

      return (
        <div>
          <p>{this.state.loaded ? (
            <span>
              {children}
              {gApiButton(this.state.signin, this.signIn, this.signOut)}
            </span>
          ) : (
              <strong>Loading...</strong>
            )
          }
          <span>{this.state.error}</span>
          </p>
        </div>
      );
  }
}

function gApiButton(signed, signIn, signOut) {
  if(signed){
    return (<button onClick={signOut} >Sign out</button>)
  }else{
    return (<button onClick={signIn} >Sign in</button>)
  }
}

export default GoogleApi
