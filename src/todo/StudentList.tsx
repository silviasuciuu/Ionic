import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {Redirect} from "react-router-dom";
import {
    IonButton, IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent,
    IonLoading,
    IonPage, IonSearchbar, IonSelect, IonSelectOption,
    IonTitle,
    IonLabel,
    IonToolbar
} from '@ionic/react';
import {add} from 'ionicons/icons';
import Student from './Student';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {AuthContext} from "../auth";
import {StudentProps} from "./StudentProps";
import {useNetwork} from './useNetwork';
import {useAppState} from "./useAppState";

const log = getLogger('PersonList');

const StudentList: React.FC<RouteComponentProps> = ({history}) => {
    const {students, fetching, fetchingError} = useContext(StudentContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(
        false
    );
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState<string>('');
    const [pos, setPos] = useState(10);
    const selectOptions = ["true", "false"];
    const [studentsShow, setStudentsShow] = useState<StudentProps[]>([]);
    const {appState} = useAppState();
    const {networkStatus} = useNetwork();
    const { logout } = useContext(AuthContext);

    log("render");
    const handleLogout = () => {
        logout?.();
        return <Redirect to={{ pathname: "/login" }} />;
    };
    async function searchNext($event: CustomEvent<void>) {
        if (students && pos < students.length) {
            setStudentsShow([...students.slice(0, 10 + pos)]); //
            setPos(pos + 5);
        } else {
            setDisableInfiniteScroll(true);
        }
        await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    useEffect(() => {
        if (students?.length) {
            setStudentsShow(students.slice(0, pos));
        }
    }, [pos, students]);

    useEffect(() => {
        if (filter && students) {
            setStudentsShow(students.filter((student) => student.active === filter));
        }
    }, [filter, students]);

    useEffect(() => {
        if (search && students) {
            setStudentsShow(students.filter((student) => student.nume.startsWith(search)));
        }
    }, [search, students]);




    return (
        <IonPage>
            <IonHeader>
                <IonTitle id={"status"}></IonTitle>

            </IonHeader>

            <IonContent fullscreen>
                <div>Network status is {JSON.stringify(networkStatus)}</div>
                    <IonButton onClick={handleLogout}>
                        Logout
                    </IonButton>
                <IonLoading isOpen={fetching} message="Fetching students"/>

                <IonSearchbar
                    value={search}
                    debounce={1000}
                    onIonChange={(e) => setSearch(e.detail.value!)}
                ></IonSearchbar>
                <IonSelect
                    value={filter}
                    placeholder="Active"
                    onIonChange={(e) => setFilter(e.detail.value)}
                >
                    {selectOptions.map((option) => (
                        <IonSelectOption key={option} value={option}>
                            {option}
                        </IonSelectOption>
                    ))}
                </IonSelect>
                {studentsShow &&
                studentsShow.map((person: StudentProps) => {
                    return (
                        <Student
                            key={person._id}
                            _id={person._id}
                            nume={person.nume}
                            prenume={person.prenume}
                            grupa={person.grupa}
                            active={person.active}
                            photoPath={person.photoPath}
                            latitude={person.latitude}
                            longitude={person.longitude}
                            onEdit={(id) => history.push(`/student/${id}`)}
                        />
                    );
                })}
                <IonInfiniteScroll
                    threshold="100px"
                    disabled={disableInfiniteScroll}
                    onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent loadingText="Loading more contacts..."></IonInfiniteScrollContent>
                </IonInfiniteScroll>
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch Persons'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/student')}>
                        <IonIcon icon={add}/>
                    </IonFabButton>





                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default StudentList;
