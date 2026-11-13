import { fetchStudentInformations } from '../auriga/extractor';
import { transformProfil } from './transformers';
import { upsertStudent, getLocalStudent } from '../../repositories/student.repository';
import type { Student } from '../../types/chrysalide.types';
import { CSyncError, SessionExpiredError, AurigaNetworkError } from '../../errors/domain.errors';

interface SyncOptions {
    persist?: boolean;
}

/**
 * Synchronizes the student profile from Auriga to the local database if requested.
 */
export async function syncStudentProfile(options: SyncOptions = {}): Promise<Student> {
    try {
        console.log('--- Starting Student Profile synchronization ---');

        console.log('Fetching raw profile data from Auriga...');
        const rawProfile = await fetchStudentInformations();

        console.log('Transforming raw data into domain model...');
        const studentData = transformProfil(rawProfile);

        if (options.persist) {
            await upsertStudent(studentData);
            console.log('Database updated with synchronized student profile.');
        }

        console.log('--- Student Profile synchronization finished successfully ---');
        return studentData;

    } catch (error) {
        if (error instanceof SessionExpiredError) {
            console.error('⚠️ Critical Error: Session expired. Please re-authenticate.');
        } else if (error instanceof AurigaNetworkError) {
            console.error('⚠️ Critical Error: Auriga server unreachable or network failure.');
        } else if (error instanceof CSyncError) {
            console.error(`⚠️ Critical Auriga error: ${error.message}`);
        } else {
            console.error('⚠️ Unhandled system error during student sync:', error);
        }

        throw error;
    }
}
