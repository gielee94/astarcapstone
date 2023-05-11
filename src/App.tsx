import React, { useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { Provider, useDispatch } from 'react-redux';

import './App.css';

import Navbar from './components/items/Navbar/Navbar';
import Page from './components/items/Page';
import Footer from './components/items/Footer/Footer';


import { useSelector } from 'react-redux';
import { AppState } from './components/redux/types';
import store from './components/redux/store';
import { fetchAndStoreToken } from './components/redux/actions/token';
import { fetchLabPlans } from './components/redux/actions/lp';
import { fetchLabs } from './components/redux/actions/labs';
import { fetchResourceGroups } from './components/redux/actions/rg';
import { ThunkDispatch } from 'redux-thunk';


interface AppProps {
  msalInstance: PublicClientApplication;
}

const App: React.FC<AppProps> = ({ msalInstance }) => {
  const { accounts } = useMsal();
  const account = accounts[0] || {};

  const dispatch = useDispatch<ThunkDispatch<AppState, unknown, any>>();
  const accessToken = useSelector((state: AppState) => state.token.accessToken);
  const sharedGalleries = useSelector((state: AppState) => state.labPlans.sharedGalleries);
  
  useEffect(() => {
    if (account) {
      fetchAndStoreToken(msalInstance, account, dispatch);
    }
  }, [msalInstance, account, dispatch]); 

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchLabs(accessToken));
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchResourceGroups(accessToken));
    }
  }, [accessToken, dispatch]);
  

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchLabPlans(accessToken));
      
    }
  }, [accessToken, dispatch]);
  

  return (
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <div className="container">
          <Navbar />
          <Page />
          
          
        </div>
      </MsalProvider>
    </Provider>
  );
};

export default App;
