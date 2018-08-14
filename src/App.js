// IMPORT PACKAGES
import React from 'react';
import { Provider } from 'react-redux';

// IMPORT STORE
import { createAppStore } from './stores/AppStore';

// IMPORT Routers
import { AppRouter } from './routers/AppRouter';


// COMPONENT
export const App = () => (
    <Provider store = {createAppStore()}>
        <div >
            <AppRouter />
        </div>
    </Provider>
);