import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { StudentProps } from './StudentProps';

interface StudentPropsExt extends StudentProps {
    onEdit: (id?: string) => void;
}

const Student: React.FC<StudentPropsExt> = ({ id, nume,prenume,grupa,active, onEdit }) => {
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>{id}</IonLabel>
            <IonLabel>{nume}</IonLabel>
            <IonLabel>{prenume}</IonLabel>
            <IonLabel>{grupa}</IonLabel>
            <IonLabel>{active}</IonLabel>


        </IonItem>
    );
};

export default Student;
