import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { StudentProps } from './StudentProps';
import { createStudent, getStudents, newWebSocket, updateStudent } from './studentApi';

const log = getLogger('StudentProvider');

type SaveStudentFn = (student: StudentProps) => Promise<any>;

export interface StudentsState {
    students?: StudentProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveStudent?: SaveStudentFn,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: StudentsState = {
    fetching: false,
    saving: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: StudentsState, action: ActionProps) => StudentsState =
    (state, { type, payload }) => {
        switch (type) {
            case FETCH_ITEMS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_ITEMS_SUCCEEDED:
                return { ...state, students: payload.students, fetching: false };
            case FETCH_ITEMS_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_ITEM_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_ITEM_SUCCEEDED:
                const students = [...(state.students || [])];
                const student = payload.student;
                const index = students.findIndex(it => it.id === student.id);
                if (index === -1) {
                    students.splice(0, 0, student);
                } else {
                    students[index] = student;
                }
                return { ...state, students, saving: false };
            case SAVE_ITEM_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            default:
                return state;
        }
    };

export const StudentContext = React.createContext<StudentsState>(initialState);

interface StudentProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { students, fetching, fetchingError, saving, savingError } = state;
    useEffect(getStudentsEffect, []);
    useEffect(wsEffect, []);
    const saveStudent = useCallback<SaveStudentFn>(saveStudentCallback, []);
    const value = { students, fetching, fetchingError, saving, savingError, saveStudent };
    log('returns');
    return (
        <StudentContext.Provider value={value}>
            {children}
        </StudentContext.Provider>
    );

    function getStudentsEffect() {
        let canceled = false;
        fetchStudents();
        return () => {
            canceled = true;
        }

        async function fetchStudents() {
            try {
                log('fetchStudents started');
                dispatch({ type: FETCH_ITEMS_STARTED });
                const students = await getStudents();
                log('fetchStudents succeeded');
                if (!canceled) {
                    dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { students } });
                }
            } catch (error) {
                log('fetchStudents failed');
                dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
            }
        }
    }

    async function saveStudentCallback(student: StudentProps) {
        try {
            log('saveStudent started');
            dispatch({ type: SAVE_ITEM_STARTED });
            const savedStudent = await (student.id ? updateStudent(student) : createStudent(student));
            log('saveStudent succeeded');
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { student: savedStudent } });
        } catch (error) {
            log('saveStudent failed');
            dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
        }
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        const closeWebSocket = newWebSocket(message => {
            if (canceled) {
                return;
            }
            const { event, payload: { student }} = message;
            log(`ws message, student ${event}`);
            if (event === 'created' || event === 'updated') {
                dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { student } });
            }
        });
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket();
        }
    }
};
