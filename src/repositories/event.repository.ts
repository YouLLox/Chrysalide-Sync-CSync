import { db } from '../db/client';
import { events } from '../db/schema';
import type { Event } from '../types/chrysalide.types';

/**
 * Insère ou met à jour une liste d'événements.
 * Utilise une transaction pour garantir l'intégrité des données lors du traitement par lot.
 */
export async function upsertEvents(eventsList: Event[]): Promise<void> {
    if (!eventsList || eventsList.length === 0) {
        return;
    }

    db.transaction((tx) => {
        for (const event of eventsList) {
            tx.insert(events)
                .values(event)
                .onConflictDoUpdate({
                    target: events.id,
                    set: event,
                });
        }
    });
}

/**
 * Récupère tous les événements stockés dans la base de données locale.
 */
export async function getLocalEvents(): Promise<Event[]> {
    const results = await db.select().from(events);

    return results as unknown as Event[];
}
