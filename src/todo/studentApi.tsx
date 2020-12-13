import axios from 'axios';
import { getLogger } from '../core';
import { StudentProps } from './StudentProps';

const log = getLogger('itemApi');

const baseUrl = 'localhost:3000';
const studentUrl = `http://${baseUrl}/student`;

interface ResponseProps<T> {
    data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`);
            return Promise.reject(err);
        });
}

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const getStudents: () => Promise<StudentProps[]> = () => {
    return withLogs(axios.get(studentUrl, config), 'getStudents');
}

export const createStudent: (item: StudentProps) => Promise<StudentProps[]> = item => {
    return withLogs(axios.post(studentUrl, item, config), 'createStudents');
}

export const updateStudent: (item: StudentProps) => Promise<StudentProps[]> = item => {
    return withLogs(axios.put(`${studentUrl}/${item.id}`, item, config), 'updateStudents');
}

interface MessageData {
    event: string;
    payload: {
        student: StudentProps;
    };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`)
    ws.onopen = () => {
        log('web socket onopen');
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
