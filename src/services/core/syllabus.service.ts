import { fetchSyllabusGrid, fetchSyllabusDetail } from '../auriga/extractor';
import { transformDetailedSyllabus } from './transformers';
import { upsertSubjects } from '../../repositories/subject.repository';
import { CSyncError, SessionExpiredError, AurigaNetworkError } from '../../errors/domain.errors';
import {Subject} from "../../types/chrysalide.types";

interface SyncOptions {
    persist?: boolean;
}

/**
 * Splits an array of IDs into smaller chunks for batch processing.
 */
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * MASTER FUNCTION: Centralizes and secures the course catalog synchronization process.
 */
export async function syncSyllabus(options: SyncOptions = {}): Promise<Subject[]> {
    try {
        console.log('--- Starting Syllabus synchronization ---');

        const subjectIds = await fetchSyllabusGrid();
        const subjectsToInsert = [];

        if (subjectIds.length === 0) {
            console.log('No subjects found in the current catalog.');
            return subjectsToInsert;
        }

        console.log(`${subjectIds.length} subjects detected. Starting details retrieval...`);

        const batches = chunkArray(subjectIds, 5);
        let globalSyncedCount = 0;

        for (let i = 0; i < batches.length; i++) {
            const currentBatch = batches[i];
            console.log(`Processing batch ${i + 1}/${batches.length}...`);

            const promises = currentBatch.map(id => fetchSyllabusDetail(id));
            const results = await Promise.allSettled(promises);

            for (const result of results) {
                if (result.status === 'fulfilled') {
                    const cleanSubject = transformDetailedSyllabus(result.value);
                    subjectsToInsert.push(cleanSubject);
                    globalSyncedCount++;
                } else {
                    const error = result.reason;
                    if (error instanceof CSyncError) {
                        console.error(`Skipping subject due to error: ${error.message}`);
                    } else {
                        console.error('Unexpected error on subject:', error);
                    }
                }
            }
        }

        if (options.persist) {
            await upsertSubjects(subjectsToInsert);
            console.log('Database updated with synchronized subjects.');
        }

        console.log(`--- Synchronization finished: ${globalSyncedCount}/${subjectIds.length} subjects synced ---`);
        return subjectsToInsert;

    } catch (criticalError) {
        if (criticalError instanceof SessionExpiredError) {
            console.error('⚠️ Critical Error: Session expired. Please re-authenticate.');
        } else if (criticalError instanceof AurigaNetworkError) {
            console.error('⚠️ Critical Error: Auriga server unreachable or network failure.');
        } else if (criticalError instanceof CSyncError) {
            console.error(`⚠️ Critical Auriga error: ${criticalError.message}`);
        } else {
            console.error('⚠️ Unhandled system error:', criticalError);
        }
        throw criticalError;
    }
}
