// IMPORT PACKAGE REFERENCES
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// IMPORT PROJECT REFERENCES

import { Header } from '../components/Header/Header';
import  HomePage  from '../containers/HomePage';
import { AboutPage } from '../containers/AboutPage';
import { ZipCodesPage } from '../containers/ZipCodesPage';
import LoginPage  from '../containers/LoginPage';

// COMPONENT

export const AppRouter = () => (
    <Router>
        <Fragment> 
            <Switch>
           
                <Route exact strict path='/' component={HomePage} />
                <Route  path='/zipcodes' component={ZipCodesPage} />
                <Route  path='/about' component={AboutPage} />
                <Route  path='/login' component={LoginPage} />
                <Route component={HomePage} />
           </Switch>
        </Fragment>
    </Router>
);