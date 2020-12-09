import {
  IonApp, IonLoading
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import LoginPage from './pages/LoginPage';
import AppTabs from './AppTabs';
import { AuthContext, useAuthState } from './auth';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const {loading, auth} = useAuthState();

  if(loading) {
    return <IonLoading isOpen/>
  }

  return (
    <IonApp>
      <AuthContext.Provider value={{ loggedIn: auth.loggedIn, userId: auth.userId }} >
        <IonReactRouter>
          <Switch>
            <Route exact path='/login' >
              <LoginPage />
            </Route>
            <Route exact path='/register' >
              <RegisterPage />
            </Route>
            <Route path='/my' >
              <AppTabs />
            </Route>
            <Redirect exact path='/' to='/login'/>
            <Route><NotFoundPage/></Route>
          </Switch>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
