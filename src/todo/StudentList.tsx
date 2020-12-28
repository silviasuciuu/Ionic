import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonSearchbar,
    IonList, IonLoading,
    IonPage,
    IonTitle,
    IonToolbar, IonCard, useIonViewWillEnter
} from '@ionic/react';
import {add} from 'ionicons/icons';
import Student from './Student';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {Plugins} from "@capacitor/core";
import {AuthContext} from "../auth";

const log = getLogger('StudentList');

const StudentList: React.FC<RouteComponentProps> = ({history}) => {
    const {students, fetching, fetchingError} = useContext(StudentContext);
    log('render');
    const {token} = useContext(AuthContext);
    const [names, setNames] = useState<string[]>([]);
    const [searchName, setSearchName] = useState<string>('');

    function fetchNames() {
        var myHeaders = new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const resp = fetch("http://localhost:3000/api/student", {
            headers: myHeaders,
            method: 'GET'
        })
        var obj: any;
        resp.then(res => res.json())
            .then(data => obj = data)
            .then(() => obj.forEach((x: { nume: string; }) => {
                setNames([...names, x.nume])
            }));

    }

    useIonViewWillEnter(async () => {
         fetchNames();
    });


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonSearchbar
                    value={searchName}
                    debounce={100}
                    onIonChange={e => setSearchName(e.detail.value!)}>
                </IonSearchbar>

                <IonLoading isOpen={fetching} message="Fetching students"/>
                {students && (
                    <IonList>
                        {students.filter(st=>st.nume.indexOf(searchName)>=0)

                            .map(({ _id, nume,prenume,grupa,active}) =>
                            <Student key={_id} _id={_id} nume={nume} prenume={prenume} grupa={grupa} active={active}  onEdit={id => history.push(`/student/${id}`)} />)}

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

                <IonFab vertical="top" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => logout()}>Logout
                    </IonFabButton>
                </IonFab>


            </IonContent>
        </IonPage>
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    function logout() {

        history.push('/login')
    }

    function setStorage() {
        const {Storage} = Plugins;

        let i = 0;
        (async () => {
            students?.forEach(async v => {
                Storage.set({
                    key: 'user' + i,
                    value: JSON.stringify({
                        nume: v.nume, prenume: v.prenume, grupa: v.grupa, active: v.active,
                    })
                });
                i++;
            })


        })();
        Storage.set({
            key: 'token',
            value: token
        })
    }
};

export default StudentList;