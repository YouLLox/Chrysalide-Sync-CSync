import { fetchGrades } from '../auriga/extractor';
import { transformGrades } from './transformers';
import { upsertGrades } from '../../repositories/grade.repository';
import type { Grade } from '../../types/chrysalide.types';
import { CSyncError, SessionExpiredError, AurigaNetworkError } from '../../errors/domain.errors';

interface SyncOptions {
    persist?: boolean;
}

/**
 * Synchronizes notes from Auriga to the local database if requested.
 */
export async function syncGrades(options: SyncOptions = {}): Promise<Grade[]> {
    try {
        console.log('--- Starting Grades synchronization ---');

        console.log('Fetching raw grades data from Auriga...');
        const rawResponse = await fetchGrades();

        if (!rawResponse || !rawResponse.content || !rawResponse.content.lines) {
            console.log('No grades found or invalid Auriga response format. Aborting sync.');
            return [];
        }

        console.log(`${rawResponse.content.lines.length} grade lines detected. Transforming data...`);
        const transformedGrades = rawResponse.content.lines.map((line: any) => transformGrades(line));

        console.log(`--- Grades synchronization finished successfully: ${transformedGrades.length} grades synced ---`);

        if (options.persist) {
            await upsertGrades(transformedGrades);
            console.log('Database updated with synchronized grades.');
        }

        return transformedGrades;

    } catch (error) {
        if (error instanceof SessionExpiredError) {
            console.error('⚠️ Critical Error: Session expired. Please re-authenticate.');
        } else if (error instanceof AurigaNetworkError) {
            console.error('⚠️ Critical Error: Auriga server unreachable or network failure.');
        } else if (error instanceof CSyncError) {
            console.error(`⚠️ Critical Auriga error: ${error.message}`);
        } else {
            console.error('⚠️ Unhandled system error during grades sync:', error);
        }

        throw error;
    }
}
