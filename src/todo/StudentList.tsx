import React, {useContext, useEffect} from 'react';
import {RouteComponentProps} from 'react-router';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonList, IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {add} from 'ionicons/icons';
import Student from './Student';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {Plugins} from "@capacitor/core";

const log = getLogger('StudentList');

const StudentList: React.FC<RouteComponentProps> = ({history}) => {
    const {students, fetching, fetchingError} = useContext(StudentContext);
    log('render');


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching students"/>
                {students && (
                    <IonList>

                        {students.map(({_id, nume, prenume, grupa, active}) =>

                            <Student key={_id} _id={_id} nume={nume} prenume={prenume} grupa={grupa} active={active}
                                     onEdit={id => history.push(`/student/${id}`)}/>)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch students'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed" {...setStorage()}>
                    <IonFabButton onClick={() => history.push('/student')}>
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks

    const {Storage} = Plugins;


    function setStorage() {
        let i=0;
        (async () => {
            const {Storage} = Plugins;
            students?.forEach(async v => {
                console.log(i);
                Storage.set({
                    key: 'user'+i,
                    value: JSON.stringify({
                        nume: v.nume, prenume: v.prenume, grupa: v.grupa, active: v.active,
                    })
                });
                i++;
            })


        })();
    }
};

export default StudentList;