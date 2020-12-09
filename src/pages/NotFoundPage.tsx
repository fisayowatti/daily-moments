import {
    IonButton,
    IonContent,
    IonPage
  } from '@ionic/react';
  import React from 'react';
  
  const NotFoundPage: React.FC = () => {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          Page not found
          <IonButton expand='block' routerLink='/login'>Back to App</IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default NotFoundPage;
  