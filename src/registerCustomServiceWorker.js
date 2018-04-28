export default function register() {if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {

        navigator.serviceWorker.register('/image-worker.js', {scope: '/projects/'}).then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
      });
      });
    }
}
