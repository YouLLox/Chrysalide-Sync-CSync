import { fetchEvents } from '../auriga/extractor';
import { transformEvent } from './transformers';
import { getLocalEvents, upsertEvents } from '../../repositories/event.repository';
import type { Event } from '../../types/chrysalide.types';
import type { AurigaIntervention } from '../../types/auriga.types';
import { CSyncError, SessionExpiredError, AurigaNetworkError } from '../../errors/domain.errors';

export interface SyncOptions {
    persist?: boolean;
}

/**
 * Retrieves the schedule from the API, converts it, and synchronizes it to the local database if requested.
 */
export async function syncScheduleEvents(options: SyncOptions = {}): Promise<Event[]> {
    try {
        console.log('--- Starting Schedule Events synchronization ---');

        console.log('Fetching raw schedule data from Auriga...');
        const rawResponse = await fetchEvents();

        const interventions: AurigaIntervention[] = Array.isArray(rawResponse)
            ? rawResponse
            : (rawResponse as any).interventions || [];

        if (interventions.length === 0) {
            console.log('No events found in the current schedule.');
            return [];
        }

        console.log(`${interventions.length} events detected. Transforming data...`);
        const events = interventions.map(transformEvent);

        if (events.length > 0) {
            console.log('Updating database with schedule events...');
            if (options.persist) {
                await upsertEvents(events);
                console.log('Database updated with synchronized schedule events.');
            }
        }

        console.log(`--- Schedule Events synchronization finished successfully: ${events.length} events synced ---`);
        return events;

    } catch (error) {
        if (error instanceof SessionExpiredError) {
            console.error('⚠️ Critical Error: Session expired. Please re-authenticate.');
        } else if (error instanceof AurigaNetworkError) {
            console.error('⚠️ Critical Error: Auriga server unreachable or network failure.');
        } else if (error instanceof CSyncError) {
            console.error(`⚠️ Critical Auriga error: ${error.message}`);
        } else {
            console.error('⚠️ Unhandled system error during schedule sync:', error);
        }

        throw error;
    }
}
