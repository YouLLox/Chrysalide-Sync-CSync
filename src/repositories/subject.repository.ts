import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { subjects } from '../db/schema';
import type { Subject } from '../types/chrysalide.types';

/**
 * Inserts or updates a batch of subjects using a transaction for performance.
 */
export async function upsertSubjects(subjectsList: Subject[]): Promise<void> {
    if (subjectsList.length === 0) return;

    db.transaction((tx) => {
        for (const subjectData of subjectsList) {
            tx.insert(subjects)
                .values(subjectData)
                .onConflictDoUpdate({
                    target: subjects.id,
                    set: subjectData,
                });
        }
    });
}

/**
 * Retrieves all subjects from the local database using Drizzle query API.
 */
export async function getLocalSubjects(): Promise<Subject[]> {
    return (await db.query.subjects.findMany()) as unknown as Subject[];
}

/**
 * SubjectRepository provides clean, type-safe database operations.
 */
export const SubjectRepository = {
    /**
     * Retrieve a specific subject by its ID.
     */
    async findById(id: string): Promise<Subject | undefined> {
        return db.query.subjects.findFirst({
            where: eq(subjects.id, id),
        });
    },

    /**
     * Get all subjects, optionally filtered by semester.
     */
    async findAll(semester?: number): Promise<Subject[]> {
        if (semester) {
            return db.query.subjects.findMany({
                where: eq(subjects.semester, semester),
            });
        }
        return (db.query.subjects.findMany()) as unknown as Subject[];
    },

    /**
     * Delete a subject from the local cache.
     */
    async delete(id: string): Promise<void> {
        await db.delete(subjects).where(eq(subjects.id, id));
    }
};
