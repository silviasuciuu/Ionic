import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { StudentProps } from './StudentProps';
import { createStudent, getStudents, newWebSocket, updateStudent } from './studentApi';
import { AuthContext } from '../auth';

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

const FETCH_STUDENTS_STARTED = 'FETCH_STUDENTS_STARTED';
const FETCH_STUDENTS_SUCCEEDED = 'FETCH_STUDENTS_SUCCEEDED';
const FETCH_STUDENTS_FAILED = 'FETCH_STUDENTS_FAILED';
const SAVE_STUDENTS_STARTED = 'SAVE_STUDENTS_STARTED';
const SAVE_STUDENTS_SUCCEEDED = 'SAVE_STUDENTS_SUCCEEDED';
const SAVE_STUDENTS_FAILED = 'SAVE_STUDENTS_FAILED';

const reducer: (state: StudentsState, action: ActionProps) => StudentsState =
    (state, { type, payload }) => {
        switch (type) {
            case FETCH_STUDENTS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_STUDENTS_SUCCEEDED:
                return { ...state, students: payload.students, fetching: false };
            case FETCH_STUDENTS_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_STUDENTS_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_STUDENTS_SUCCEEDED:
                const students = [...(state.students || [])];
                const student = payload.student;
                const index = students.findIndex(it => it._id === student._id);
                if (index === -1) {
                    students.splice(0, 0, student);
                } else {
                    students[index] = student;
                }
                return { ...state, students, saving: false };
            case SAVE_STUDENTS_FAILED:
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
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { students, fetching, fetchingError, saving, savingError } = state;
    useEffect(getStudentsEffect, [token]);
    useEffect(wsEffect, [token]);
    const saveStudent = useCallback<SaveStudentFn>(saveStudentCallback, [token]);
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
            if (!token?.trim()) {
                return;
            }
            try {
                log('fetchStudents started');
                dispatch({ type: FETCH_STUDENTS_STARTED });
                const students = await getStudents(token);
                log('fetchStudents succeeded');
                if (!canceled) {
                    dispatch({ type: FETCH_STUDENTS_SUCCEEDED, payload: { students } });
                }
            } catch (error) {
                log('fetchStudents failed');
                dispatch({ type: FETCH_STUDENTS_FAILED, payload: { error } });
            }
        }
    }

    async function saveStudentCallback(student: StudentProps) {
        try {
            log('saveStudent started');
            dispatch({ type: SAVE_STUDENTS_STARTED });
            const savedStudent = await (student._id ? updateStudent(token, student) : createStudent(token, student));
            log('saveStudent succeeded');
            dispatch({ type: SAVE_STUDENTS_SUCCEEDED, payload: { student: savedStudent} });
        } catch (error) {
            log('saveStudent failed');
            dispatch({ type: SAVE_STUDENTS_FAILED, payload: { error } });
        }
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const { type, payload: student } = message;
                log(`ws message, student ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({ type: SAVE_STUDENTS_SUCCEEDED, payload: { student } });
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};
