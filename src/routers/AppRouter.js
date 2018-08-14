// IMPORT PACKAGE REFERENCES
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// IMPORT PROJECT REFERENCES
import Header  from '../components/Header/Header';
import Footer  from '../components/Footer/Footer.js';
import HomePage  from '../containers/HomePage';
import LoginPage2  from '../containers/LoginPage2';
import CreateNewPassword from '../containers/CreateNewPassword'
import LoginPage  from '../containers/LoginPage';
import EnterOtp from "../containers/EnterOtp"
import ScanQr from "../containers/ScanQr"
// COMPONENT

export const AppRouter = () => (
    <Router>
        <Fragment> 
            <Header />
                <Switch>
                    <Route exact strict path='/' component={HomePage} />
                    <Route path='/enterOtp' component={EnterOtp}/>
                    <Route path='/login' component={LoginPage} />
                    <Route path='/logins' component={LoginPage2} />
                    <Route path="/scanQr" component={ScanQr}/> 
                    <Route path="/createNewPassword" component={CreateNewPassword}/>
                    <Route component={HomePage} />
               </Switch>
           <Footer />
        </Fragment>
    </Router>
);