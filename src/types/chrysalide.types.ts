export type Rank = 'student' | 'teacher' | 'admin' | 'candidate';
export type Gender = 'male' | 'female' | 'other';
export type EvaluationType = 'EXO' | 'EXF' | 'TD';
export type EventStatus = 'planned' | 'cancelled';
export type EventType = 'TD' | 'CM' | 'EXM' | 'other';

export interface Teacher {
    lastName: string;
    firstName: string;
}

export interface Address {
    street: string;
    city: string;
    postalCode: string;
}

export interface Parent {
    lastName: string;
    firstName: string;
    address?: Address;
    mail?: string;
}

export interface EventName {
    fr: string;
    en: string;
}

export interface Student {
    id: number;
    login: string;
    schoolMail: string;
    lastName: string;
    firstName: string;
    phone: string;
    address: Address;
    birthDate: string;
    cityOfBirth: string;
    status: Rank;
    entryYear: number;
    bacYear: number;
    gender: Gender;
    bacOptions: string[];
    parents: {
        parent1?: Parent;
        parent2?: Parent;
    };
}

export interface Evaluation {
    id: number;
    description: string;
    coefficient: number;
    type: EvaluationType;
}

export interface Subject {
    id: string;
    name: string;
    semester: number;
    coefficient: number;
    minimalGrade: number;
    ue: number;
    description: string;
    evaluations: Evaluation[];
    campus: string[];
    duration: number;
    teacher: string[];
    referent: string[];
}

export interface Grade {
    id: number;
    code: string;
    semester: number;
    coefficient: number;
    type: string;
    value: number;
    isAbsent: boolean;
    absentReason: string | null;
    appreciation: string | null;
}

export interface ClassRoom {
    id: string;
    code: string;
    name: string;
    floor: number;
    capacity: {
        total: number;
        exam: number;
    };
    type: {
        id: string;
        name: string;
    };
}

export interface Event {
    id: number;
    type: EventType;
    code: string;
    name: EventName[];
    startDate: string;
    endDate: string;
    students: string[];
    classroom: ClassRoom[];
    campus: string[];
    duration: number;
    teacher: Teacher[];
    status: EventStatus;
    examen: boolean,

}
