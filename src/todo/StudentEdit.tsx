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
    createAnimation,
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
import {CreateAnimation, Animation} from '@ionic/react';

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

    function simpleAnimations() {
        const label1 = document.querySelector('.label1');
        if (label1) {
            const animation = createAnimation()
                .addElement(label1)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(1)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(0.5)', opacity: '0.5'
                    }
                ]);
            animation.play();

        }
    }

    function groupAnimations() {
        const label1 = document.querySelector('.label1');
        const label2 = document.querySelector('.label2');
        if (label1 && label2) {
            const animationA = createAnimation()
                .addElement(label1)
                .fromTo('transform', 'scale(0.5)', 'scale(1)');
            const animationB = createAnimation()
                .addElement(label2)
                .fromTo('transform', 'scale(1)', 'scale(0.5)');
            const parentAnimation = createAnimation()
                .duration(10000)
                .addAnimation([animationA, animationB]);
            parentAnimation.play();
        }
    }

    function chainAnimations() {
        const elB = document.querySelector('.label1');
        const elC = document.querySelector('.label2');
        if (elB && elC) {
            const animationA = createAnimation()
                .addElement(elB)
                .duration(3000)
                .fromTo('transform', 'scale(0.5)', 'scale(1)')
                .afterStyles({
                    'background': 'red'
                });
            const animationB = createAnimation()
                .addElement(elC)
                .duration(5000)
                .fromTo('transform', 'scale(1)', 'scale(0.5)')
                .afterStyles({
                    'background': 'red'
                });
            (async () => {
                await animationA.play();
                await animationB.play();
            })();
        }
    }
    //useEffect(chainAnimations, []);
    // useEffect(simpleAnimations, []);
    useEffect(chainAnimations, []);

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
                <IonItem>
                    <div className="label1"><IonLabel>Nume:</IonLabel></div>
                    <IonInput
                        className="inputField"
                        value={nume}
                        onIonChange={e => setNume(e.detail.value || '')}/>
                </IonItem>
                <IonItem>
                    <div className="label2"><IonLabel>Prenume:</IonLabel></div>
                    <IonInput
                        className="inputField"
                        value={prenume}
                        onIonChange={e => setPrenume(e.detail.value || '')}/>
                </IonItem>

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
