import { db } from '../db/client';
import { grades } from '../db/schema';
import type { Grade } from '../types/chrysalide.types';

export async function upsertGrades(gradesList: Grade[]): Promise<void> {
    if (gradesList.length === 0) return;

    db.transaction((tx) => {
        for (const gradeData of gradesList) {
            tx.insert(grades)
                .values(gradeData)
                .onConflictDoUpdate({
                    target: grades.id,
                    set: gradeData,
                });
        }
    });
}
