import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './assets/styles/common.css';
// import './assets/styles/style.css';


ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
    module.hot.accept('./App', function () {
	    // Require the new version and render it instead
	    var NextApp = require('./App');
	    ReactDOM.render(<NextApp />, document.getElementById('app'));
    });
}