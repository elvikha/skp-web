import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    phone_number: string;
    identification_number: string;
    status: Status;
}

enum Status {
    Student = 1,
    Lecturer = 2,
    Admin = 3,
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export type TSubStudySubject = {
    id: Key | null | undefined;
    name: string;
    description: string;
    point: number;
    study_subject_id?: number | null;
    sub_study_subjects?: TSubStudySubject[];
};

export type TStudySubject = {
    name: string;
    description: string;
    point: number;
    sub_study_subjects?: TSubStudySubject[];
};