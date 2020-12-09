import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useAuth } from '../auth';
import { firestore, storage } from '../firebase';
import { Entry, toEntry } from '../models';
import { trash as trashIcon } from 'ionicons/icons';
import { formatDate } from '../date';


interface RouteParams {
  id: string;
}

const deletePicture = async(userId, date) => {
  try {
    const pictureRef = storage.ref(`/users/${userId}/pictures/${date}`);
    await pictureRef.delete();
  } catch (err) {
    console.log('err', err);
  }
}

const EntryPage: React.FC = () => {
  const { id } = useParams<RouteParams>() ;

  const [entry, setEntry] = useState<Entry>({ id: '', title: '', description: '', date: '', pictureUrl: '' });
  const [status, setStatus] = useState({ loading: false, error: null, deleting: false });

  const {userId} = useAuth();
  const history = useHistory();

  useEffect(() => {
    const entryRef = firestore.collection('users').doc(userId).collection('entries').doc(id);
    entryRef.get().then(doc => setEntry(toEntry(doc)))
  }, [userId, id])

  const handleDelete = async () => {
    try {
      setStatus({ loading: true, error: null, deleting: false })
      const entryRef = await firestore.collection('users').doc(userId).collection('entries').doc(id);
      await deletePicture(userId, entry?.date);
      await entryRef.delete();
      setStatus({ loading: false, error: null, deleting: false });
      history.goBack();
    } catch(error) {
      setStatus({ loading: false, error, deleting: false })
    }
  }

  console.log('[EntryPage]', entry)

  if (!entry.id) {
    return <IonLoading isOpen/>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{entry?.title}</IonTitle>
          <IonButtons slot="end" >
            <IonButton onClick={() => setStatus({ loading: false, error: null, deleting: true })}>
              <IonIcon icon={trashIcon} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h6>{formatDate(entry?.date)}</h6>
        <img src={entry?.pictureUrl} alt="entry?.title"/>
        <p>{entry?.description}</p>
        <IonLoading isOpen={status.loading} />
        <IonToast
          isOpen={status.deleting}
          onDidDismiss={() => setStatus({ loading: false, error: null, deleting: false })}
          message="Delete this entry?"
          position="bottom"
          buttons={[
            {
              text: 'Yes',
              handler: () => {
                handleDelete();
              }
            },
            {
              text: 'No',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default EntryPage;
