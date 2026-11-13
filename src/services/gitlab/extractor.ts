import { gitlabClient } from './client';

export async function fetchSyllabusPayload(): Promise<string> {
    // Get the payload for the syllabus from GitLab
    const response = await gitlabClient.get<any>(
        `/syllabus.json?ref_type=heads`
    );
    return response.data;
}

export async function fetchGradesPayload(): Promise<string> {
    // Get the payload for the grades from GitLab
    const response = await gitlabClient.get<any>(
        `grades.json?ref_type=heads`
    )
    return response.data;
}
