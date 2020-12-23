import React from 'react';
import {Redirect} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {
    IonItem,
    IonLabel,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLoading,
    IonList, IonFab, IonFabButton, IonIcon, IonPage,
} from '@ionic/react';
import {StudentProps} from './StudentProps';
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";

interface StudentPropsExt extends StudentProps {
    onEdit: (id?: string) => void;
}
let history = useHistory();

// @ts-ignore
const Student: React.FC<StudentPropsExt> = ({_id, nume, prenume, grupa, active, onEdit}) => {
    return (


        <IonPage>
            <IonHeader>

            </IonHeader>
            <IonContent>
                <IonItem onClick={() => onEdit(_id)}>

                    <IonLabel>{_id}</IonLabel>
                    <IonLabel>{nume}</IonLabel>
                    <IonLabel>{prenume}</IonLabel>
                    <IonLabel>{grupa}</IonLabel>
                    <IonLabel>{active}</IonLabel>

                </IonItem>
                <IonButton onClick={() => history.push('/login')
                }>Logout</IonButton>
            </IonContent>
        </IonPage>














        /*
             <IonItem onClick={() => onEdit(_id)}>

                 <IonLabel>{_id}</IonLabel>
                 <IonLabel>{nume}</IonLabel>
                 <IonLabel>{prenume}</IonLabel>
                 <IonLabel>{grupa}</IonLabel>
                 <IonLabel>{active}</IonLabel>

             </IonItem>
             */
    );

};

export default Student;
