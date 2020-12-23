import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { StudentProps } from './StudentProps';

const studentUrl = `http://${baseUrl}/api/student`;

export const getStudents: (token: string) => Promise<StudentProps[]> = token => {
    return withLogs(axios.get(studentUrl, authConfig(token)), 'getStudents');
}

export const createStudent: (token: string, student: StudentProps) => Promise<StudentProps[]> = (token, student) => {
    return withLogs(axios.post(studentUrl, student, authConfig(token)), 'createStudent');
}

export const updateStudent: (token: string, student: StudentProps) => Promise<StudentProps[]> = (token, student) => {
    return withLogs(axios.put(`${studentUrl}/${student._id}`, student, authConfig(token)), 'updateStudent');
}

interface MessageData {
    type: string;
    payload: StudentProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
