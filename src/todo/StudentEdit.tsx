/*import React, { useContext, useEffect, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonFabButton,
    IonIcon,
    IonTitle,
    IonGrid,
    IonCol,
    IonRow,
    IonFab,
    IonImg,
    IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { StudentContext } from './StudentProvider';
import { RouteComponentProps } from 'react-router';
import { StudentProps } from './StudentProps';
import {camera} from "ionicons/icons";
import {Photo, usePhotoGallery} from "./usePhotoGallery";

const log = getLogger('StudentEdit');

interface StudentEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const StudentEdit: React.FC<StudentEditProps> = ({ history, match }) => {
    const { photos, takePhoto } = usePhotoGallery();

    const { students, saving, savingError, saveStudent } = useContext(StudentContext);
    const [nume, setNume] = useState('');
    const [prenume, setPrenume] = useState('');
    const [grupa, setGrupa] = useState('');
    const [active, setActive] = useState('');
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();
    const [photoPath, setPhotoPath] = useState('');

    const [student, setStudent] = useState<StudentProps>();
    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const student = students?.find(it => it._id === routeId);
        setStudent(student);
        if (student) {
            setNume(student.nume);
            setPrenume(student.prenume);
        }
    }, [match.params.id, students]);
    const handleSave = () => {
        const editedStudent = student ? { ...student, nume,prenume,grupa,active} : { nume,prenume,grupa,active };
        //@ts-ignore
        saveStudent && saveStudent(editedStudent).then(() => history.goBack());
    };
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonInput placeholder={"Nume"} value={nume} onIonChange={e => setNume(e.detail.value || '')}/>
                <IonInput placeholder={"Prenume"} value={prenume} onIonChange={e => setPrenume(e.detail.value || '')}/>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Blank</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonImg
                    style={{width: "500px", height: "500px", margin: "0 auto"}}
                    onClick={() => {setPhotoToDelete(photos?.find(item => item.webviewPath === photoPath))}}
                    alt={"No photo"}
                    src={photoPath}
                />

                <IonFabButton onClick={() => takePhoto()}>
                    <IonIcon icon={camera}/>
                </IonFabButton>
                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save student'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default StudentEdit;
*/


import React, {useContext, useEffect, useState} from 'react';
import {
    IonActionSheet,
    IonButton,
    IonButtons,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon,
    IonInput, IonItem, IonLabel, IonListHeader,
    IonLoading,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar,
    IonImg
} from '@ionic/react';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {RouteComponentProps} from 'react-router';
import {StudentProps} from './StudentProps';
import {camera, close, trash} from "ionicons/icons";
import {Photo, usePhotoGallery} from "./usePhotoGallery";
import {MyMap} from "./MyMap";

const log = getLogger('PersonEdit');

interface StudentEditProps extends RouteComponentProps<{
    id?: string;
}> {
}

const StudentEdit: React.FC<StudentEditProps> = ({history, match}) => {
    const {students, saving, savingError, saveStudent} = useContext(StudentContext);
    const [nume, setNume] = useState('');
    const [prenume, setPrenume] = useState('');
    const [grupa, setGrupa] = useState('');
    const [active, setActive] = useState('');
    const [photoPath, setPhotoPath] = useState('');
    const [latitude, setLatitude] = useState(46.7533824);
    const [longitude, setLongitude] = useState(23.5831296);
    const [student, setStudent] = useState<StudentProps>();
    const {photos, takePhoto, deletePhoto} = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();

    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const stud = students?.find(it => it._id === routeId);
        setStudent(stud);
        if (stud) {
            setNume(stud.nume);
            setPrenume(stud.prenume);
            setGrupa(stud.grupa);
            setActive(stud.active);
            setPhotoPath(stud.photoPath);
            if (stud.latitude) setLatitude(stud.latitude);
            if (stud.longitude) setLongitude(stud.longitude);
        }
    }, [match.params.id, students]);

    const handleSave = () => {
        const editedStudent = student
            ? {
                ...student,
                nume,
                prenume,
                grupa,
                active,
                photoPath,
                latitude,
                longitude
            }
            : {
                nume,
                prenume,
                grupa,
                active,
                photoPath,
                latitude,
                longitude
            };
        saveStudent && saveStudent(editedStudent).then(() => {
            history.goBack();
        })
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>

                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput className="inputField" placeholder="Nume" value={nume}
                          onIonChange={e => setNume(e.detail.value || '')}/>
                <IonInput className="inputField" placeholder="Prenume" value={prenume}
                          onIonChange={e => setPrenume(e.detail.value || '')}/>


                <IonImg
                    style={{width: "500px", height: "500px", margin: "0 auto"}}
                    onClick={() => {
                        setPhotoToDelete(photos?.find(item => item.webviewPath === photoPath))
                    }}
                    alt={"No photo"}
                    src={photoPath}
                />
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton
                        onClick={() => {
                            const photoTaken = takePhoto();
                            photoTaken.then((data) => {
                                setPhotoPath(data.webviewPath!);
                            });
                        }}
                    >
                        <IonIcon icon={camera}/>
                    </IonFabButton>
                </IonFab>
                <MyMap
                    lat={latitude}
                    lng={longitude}
                    onMapClick={(location: any) => {
                        setLatitude(location.latLng.lat());
                        setLongitude(location.latLng.lng());
                    }}
                />
                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[
                        {
                            text: "Delete",
                            role: "destructive",
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                    setPhotoPath("")
                                }
                            },
                        },
                        {
                            text: "Cancel",
                            icon: close,
                            role: "cancel",
                        },
                    ]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </IonContent>
        </IonPage>
    );
};

export default StudentEdit;
