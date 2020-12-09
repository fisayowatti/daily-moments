import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  // IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../auth';
import { firestore, storage } from '../firebase';

const savePicture = async(blobUrl, userId, date) => {
  try {
    const pictureRef = storage.ref(`/users/${userId}/pictures/${date}`);
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const snapshot = await pictureRef.put(blob);
    const url = await snapshot.ref.getDownloadURL();
    return url;
  } catch (err) {
    console.log('err', err)
  }
}

const AddEntryPage: React.FC = () => {
  const {userId} = useAuth();
  const history = useHistory();

  const fileInputRef = useRef<HTMLInputElement>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [status, setStatus] = useState({ loading: false, error: null });
  const [pictureUrl, setPictureUrl] = useState("/assets/placeholder.png");

  //clean-up use effect for generated picture blobs
  useEffect(() => {
    return () => {
      if (pictureUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pictureUrl)
        console.log('revoked:', pictureUrl)
      };
    }
  }, [pictureUrl]);

  const handleSave = async () => {
    try {
      setStatus({ loading: true, error: null })
      const entriesRef = await firestore.collection('users').doc(userId).collection('entries');
      const entryData = { title, description, pictureUrl, date };
      if(pictureUrl.startsWith('blob:')){
        entryData.pictureUrl = await savePicture(pictureUrl, userId, entryData?.date);
      }
      console.log(entryData)
      await entriesRef.add(entryData);
      setStatus({ loading: false, error: null })
      history.goBack();
    } catch(error) {
      setStatus({ loading: false, error })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files.length > 0) {
      const file = event.target.files.item(0)
      const pictureUrl = URL.createObjectURL(file);
      setPictureUrl(pictureUrl);
      console.log('file', file, pictureUrl)
    }
  }

  const onImageClick = () => fileInputRef.current.click();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Entry</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position='stacked'>Date</IonLabel>
          <IonDatetime value={date} onIonChange={(event) => setDate(event.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'>Title</IonLabel>
          <IonInput value={title} onIonChange={(event) => setTitle(event.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'>Description</IonLabel>
          <IonTextarea value={description} onIonChange={(event) => setDescription(event.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'>Picture</IonLabel><br/>
          <input type="file" accept="image/*" hidden onChange={handleFileChange} ref={fileInputRef} />
          <img src={pictureUrl} alt='pic to upload' onClick={onImageClick} />
        </IonItem>
        <IonButton expand="block" onClick={handleSave} >
          Save
        </IonButton>
        <IonLoading isOpen={status.loading} />
        {/* <IonToast
          message={status.error}
          isOpen={Boolean(status.error)}
          onDidDismiss={() => setStatus({ loading: false, error: null })}
          duration={2000}
        /> */}
      </IonContent>
    </IonPage>
  );
};

export default AddEntryPage;
