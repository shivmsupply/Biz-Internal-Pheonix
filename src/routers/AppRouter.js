// IMPORT PACKAGE REFERENCES
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// IMPORT PROJECT REFERENCES

import { Header } from '../components/Header/Header';
import  HomePage  from '../containers/HomePage';
import { AboutPage } from '../containers/AboutPage';
import { ZipCodesPage } from '../containers/ZipCodesPage';


// COMPONENT

export const AppRouter = () => (
    <Router>
        <Fragment> 
            <Switch>
           
                <Route exact  path='/' component={HomePage} />
                <Route exact strict path='/zipcodes' component={ZipCodesPage} />
                <Route exact strict path='/about' component={AboutPage} />
                <Route component={HomePage} />
           </Switch>
        </Fragment>
    </Router>
);