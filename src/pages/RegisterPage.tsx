import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useAuth } from '../auth';
import { auth } from '../firebase';

const RegisterPage: React.FC = () => {
  const {loggedIn} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null })

  const handleRegister = async () => {
    try {
      setStatus({ loading: true, error: null });
      await auth.createUserWithEmailAndPassword(email, password); //password: test1test1test2  email: test1@example.org
    } catch(err) {
      setStatus({ loading: false, error: err.message });
      console.log(err)
    }
  }

  if(loggedIn) {
    return <Redirect to='/my/entries'/>
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position='stacked'>Email</IonLabel>
          <IonInput type='email' onIonChange={(event) => setEmail(event.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'>Password</IonLabel>
          <IonInput type='password' onIonChange={(event) => setPassword(event.detail.value)} />
        </IonItem>
        <IonButton expand="block" onClick={handleRegister} >
          Register
        </IonButton>
        <IonButton expand="block" routerLink="/login" fill="clear" >
          Already have an account?
        </IonButton>
        <IonLoading isOpen={status.loading} />
        <IonToast
          message={status.error}
          isOpen={Boolean(status.error)}
          onDidDismiss={() => setStatus({ loading: false, error: null })}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
