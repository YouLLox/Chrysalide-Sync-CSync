import { aurigaClient } from './client';
import {
    AurigaRawSyllabusResponse,
    AurigaDetailedSyllabus,
    AurigaCatalogDefinitionsResponse, AurigaRawGradesResponse, AurigaRawProfile, AurigaRawScheduleResponse
} from '../../types/auriga.types';
import { fetchGradesPayload, fetchSyllabusPayload } from "../gitlab/extractor";
import { handleAxiosError } from "./errors";
import {Evaluation, Grade} from "../../types/chrysalide.types";

/**
 * Fetches the IDs of all available course catalog definitions from Auriga.
 * * It makes a GET request to the course catalog definitions endpoint,
 * extracts the content array, and maps it to return a simple array of catalog IDs.
 */
export async function fetchSyllabusPayloadId(): Promise<number[]> {
    try {
        const response = await aurigaClient.get<AurigaCatalogDefinitionsResponse>(
            '/menuEntries/166/courseCatalogDefinitions?sortBy=code,asc'
        );

        return response.data.content.map(item => item.id);
    } catch (error) {
        handleAxiosError(error, { resourceType: 'CourseCatalogDefinitions' });
    }
}

/**
 * Retrieves all unique subject IDs across all available course catalogs.
 * * It first retrieves a base search payload from GitLab and the list of catalog IDs.
 * Then, it iterates through each catalog ID, injecting it into the base payload,
 * and paginates through Auriga's search endpoint via POST requests to extract
 * subject IDs from the data grid lines.
 */
export async function fetchSyllabusGrid(): Promise<number[]> {
    try {
        const syllabusPayload = await fetchSyllabusPayload();
        const basePayload = typeof syllabusPayload === 'string'
            ? JSON.parse(syllabusPayload)
            : syllabusPayload;

        const allSubjectIds: number[] = [];
        const payloadIds = await fetchSyllabusPayloadId();

        for (const payloadId of payloadIds) {
            let currentPage = 1;
            let numberOfPages = 1;

            while (currentPage <= numberOfPages) {
                const payload = {
                    ...basePayload,
                    page: currentPage,
                    size: 100,
                    searchResultDefinition: {
                        ...basePayload.searchResultDefinition,
                        filtersCustom: {
                            ...(basePayload.searchResultDefinition?.filtersCustom || {}),
                            id: payloadId
                        }
                    }
                };

                const response = await aurigaClient.post<AurigaRawSyllabusResponse>(
                    '/menuEntries/166/searchResult?sort=id',
                    payload
                );

                numberOfPages = response.data.totalPages || 1;

                const lines = response.data.content?.lines || [];
                for (const line of lines) {
                    allSubjectIds.push(Number(line[0]));
                }

                currentPage++;
            }
        }
        return allSubjectIds;
    } catch (error) {
        handleAxiosError(error, { resourceType: 'SyllabusGrid' });
    }
}

/**
 * Retrieves the detailed, deep-level data for a specific subject/course.
 * * It performs a GET request to the specific course catalog syllabus endpoint
 * using the provided subject ID and returns the complete syllabus object.
 */
export async function fetchSyllabusDetail(subjectId: number): Promise<AurigaDetailedSyllabus> {
    try {
        const response = await aurigaClient.get<AurigaDetailedSyllabus>(
            `/courseCatalogSyllabuses/${subjectId}`
        );
        return response.data;
    } catch (error) {
        handleAxiosError(error, { resourceType: 'SyllabusDetail', id: subjectId });
    }
}

export async function fetchGrades(): Promise<AurigaRawGradesResponse> {
    try {
        const gardesPayload = await fetchGradesPayload();

        const response = await aurigaClient.post<AurigaRawGradesResponse>(
            '/menuEntries/1036/searchResult?sort=id',
            gardesPayload
        );
        return response.data;
    } catch (error) {
        handleAxiosError(error, { resourceType: 'Grades' });
    }
}

export async function fetchStudentInformations(): Promise<AurigaRawProfile> {
    try {
        const response = await aurigaClient.get<AurigaRawProfile>('/me');
        return response.data;
    } catch (error) {
        handleAxiosError(error, { resourceType: 'StudentInformation' });
    }
}

export async function fetchEvents(): Promise<AurigaRawScheduleResponse> {
    try {
        const startDate = `${(new Date().getFullYear())-1}-08-30`;
        const endDate = `${new Date().getFullYear()}-08-29`;
        
        const response = await aurigaClient.get<AurigaRawScheduleResponse>(`/plannings/me?days=1&days=2&days=3&days=4&days=5&days=6&days=7&startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, { resourceType: 'Event' });
    }
}
