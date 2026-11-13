import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { students } from '../db/schema';
import type { Student } from '../types/chrysalide.types';

/**
 * Insère un nouvel étudiant ou met à jour ses informations s'il existe déjà.
 */
export async function upsertStudent(studentData: Student): Promise<void> {
    await db.insert(students)
        .values(studentData)
        .onConflictDoUpdate({
            target: students.id,
            set: studentData,
        });
}

/**
 * Récupère les informations d'un étudiant depuis le stockage local.
 */
export async function getLocalStudent(studentId: number): Promise<Student | undefined> {
    const result = await db.select()
        .from(students)
        .where(eq(students.id, studentId))
        .limit(1);

    return result[0];
}
