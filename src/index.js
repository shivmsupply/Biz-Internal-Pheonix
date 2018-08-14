import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';
import './assets/styles/style.css';
import './assets/styles/app.scss';

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
    module.hot.accept('./App', function () {
	    // Require the new version and render it instead
	    var NextApp = require('./App');
	    ReactDOM.render(<NextApp />, document.getElementById('app'));
    });
}