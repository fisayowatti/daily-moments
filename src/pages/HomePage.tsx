import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';
import { add as addIcon } from 'ionicons/icons';
import { formatDate } from '../date';


const HomePage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const { userId } = useAuth();

  useEffect(() => {
    const entriesRef = firestore.collection('users').doc(userId).collection('entries').orderBy('date', 'desc');
    return entriesRef.onSnapshot((snapshot) => {
      const entries = snapshot.docs.map(toEntry)
      setEntries(entries);
    })
  }, [userId])
  console.log('[HomePage]', entries)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {entries.map(entry => 
            <IonItem key={entry.id} button routerLink={`/my/entries/view/${entry.id}`}>
              <IonThumbnail slot="start">
                <IonImg src={entry.pictureUrl} />
              </IonThumbnail>
              <IonLabel>
                <h6>{formatDate(entry?.date)}</h6>
                <h2>{entry.title}</h2>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton routerLink="/my/entries/add">
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
