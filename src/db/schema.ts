import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import type {
    Address, Parent, Rank, Gender, Evaluation,
    EventStatus, EventType, ClassRoom, Teacher, EventName
} from '../types/chrysalide.types';

export const students = sqliteTable('students', {
    id: integer('id').primaryKey(),
    login: text('login').notNull(),
    schoolMail: text('school_mail').notNull(),
    lastName: text('last_name').notNull(),
    firstName: text('first_name').notNull(),
    phone: text('phone').notNull(),
    address: text('address', { mode: 'json' }).$type<Address>().notNull(),
    birthDate: text('birth_date').notNull(),
    cityOfBirth: text('city_of_birth').notNull(),
    status: text('status').$type<Rank>().notNull(),
    entryYear: integer('entry_year').notNull(),
    bacYear: integer('bac_year').notNull(),
    gender: text('gender').$type<Gender>().notNull(),
    bacOptions: text('bac_options', { mode: 'json' }).$type<string[]>().notNull(),
    parents: text('parents', { mode: 'json' }).$type<{ parent1?: Parent; parent2?: Parent }>().notNull(),
});

export const subjects = sqliteTable('subjects', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    semester: integer('semester').notNull(),
    coefficient: real('coefficient').notNull(),
    minimalGrade: real('minimal_grade').notNull(),
    ue: integer('ue').notNull(),
    description: text('description').notNull(),
    evaluations: text('evaluations', { mode: 'json' }).$type<Evaluation[]>().notNull(),
    campus: text('campus', { mode: 'json' }).$type<string[]>().notNull(),
    duration: integer('duration').notNull(),
    teacher: text('teacher', { mode: 'json' }).$type<string[]>().notNull(),
    referent: text('referent', { mode: 'json' }).$type<string[]>().notNull(),
});

export const grades = sqliteTable('grades', {
    id: integer('id').primaryKey(),
    code: text('name').notNull(),
    value: real('value').notNull(),
    coefficient: integer('coefficient').notNull(),
    type: text('type').notNull(),
    isAbsent: integer('is_absent', { mode: 'boolean' }).notNull(),
    absentReason: text('absent_reason'),
    appreciation: text('appreciation'),
});

export const events = sqliteTable('events', {
    id: integer('id').primaryKey(),
    type: text('type').$type<EventType>().notNull(),
    code: text('code').notNull(),
    name: text('classroom', { mode: 'json' }).$type<EventName[]>().notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),
    students: text('students', { mode: 'json' }).$type<string[]>().notNull(),
    classroom: text('classroom', { mode: 'json' }).$type<ClassRoom[]>().notNull(),
    campus: text('campus', { mode: 'json' }).$type<string[]>().notNull(),
    duration: integer('duration').notNull(),
    teacher: text('teacher', { mode: 'json' }).$type<Teacher[]>().notNull(),
    status: text('status').$type<EventStatus>().notNull(),
    examen: integer('examen', { mode: 'boolean' }),
});
