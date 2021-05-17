import React from 'react';
import {IonItem, IonLabel, IonButton,} from '@ionic/react';
import {StudentProps} from './StudentProps';

interface StudentPropsExt extends StudentProps {
    onEdit: (id?: string) => void;
}

const Student: React.FC<StudentPropsExt> = ({_id, nume, prenume, grupa, active, onEdit}) => {
    return (



        <IonItem onClick={() => onEdit(_id)}>
            <IonLabel>{_id}</IonLabel>
            <IonLabel>{nume}</IonLabel>
            <IonLabel>{prenume}</IonLabel>
            <IonLabel>{grupa}</IonLabel>
            <IonLabel>{active}</IonLabel>

        </IonItem>
    );

};

export default Student;
