import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/style.css';
import './styles/app.scss';

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
    module.hot.accept('./components/App', function () {
	    // Require the new version and render it instead
	    var NextApp = require('./components/App');
	    ReactDOM.render(<NextApp />, document.getElementById('app'));
    });
}