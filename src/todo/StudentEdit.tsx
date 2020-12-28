import React, { useContext, useEffect, useState } from 'react';
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
import { getLogger } from '../core';
import { StudentContext } from './StudentProvider';
import { RouteComponentProps } from 'react-router';
import { StudentProps } from './StudentProps';

const log = getLogger('StudentEdit');

interface StudentEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const StudentEdit: React.FC<StudentEditProps> = ({ history, match }) => {
    const { students, saving, savingError, saveStudent } = useContext(StudentContext);
    const [nume, setNume] = useState('');
    const [prenume, setPrenume] = useState('');
    const [grupa, setGrupa] = useState('');
    const [active, setActive] = useState('');

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


                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save student'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default StudentEdit;
