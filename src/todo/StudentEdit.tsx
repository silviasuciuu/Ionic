import React, {useContext, useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {RouteComponentProps} from 'react-router';
import {StudentProps} from './StudentProps';

const log = getLogger('StudentEdit');

interface StudentEditProps extends RouteComponentProps<{
    id?: string;
}> {
}

const StudentEdit: React.FC<StudentEditProps> = ({history, match}) => {
    const {students, saving, savingError, saveStudent} = useContext(StudentContext);
    const [id, setId] = useState('');

    const [nume, setNume] = useState('');
    const [prenume, setPrenume] = useState('');
    const [grupa, setGrupa] = useState('');
    const [active, setActive] = useState('');

    const [student, setStudent] = useState<StudentProps>();
    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';

        const s = students?.find(it => it.id === routeId);
        setStudent(s);
        if (s) {
            setNume(s.nume);
            setPrenume(s.prenume);
            setGrupa(s.grupa.toString());
            setActive(s.active.toString());


        }
    }, [match.params.id, students]);
    const handleSave = () => {

        var g = parseInt(grupa);
        var ac = (active == 'true');
        const editedStudent = student ? {...student, id, nume, prenume, grupa, active} : {id, nume, prenume, grupa, active};
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
                <IonInput placeholder={"Grupa"} value={grupa}  onIonChange={e => setGrupa(e.detail.value || '')}/>
                <IonInput placeholder={"Acitve"} value={active}  onIonChange={e => setActive(e.detail.value || '')}/>


                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save student'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default StudentEdit;
