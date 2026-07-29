import { createResearchInterface } from '../interfaces/research.interface';
import { requestJson } from './api';

const RESEARCH_PATH = '/research';

const mapResearch = (research) => createResearchInterface(research);

export async function getResearches() {
    const data = await requestJson(RESEARCH_PATH);
    return Array.isArray(data) ? data.map(mapResearch) : [];
}

export async function getResearch(id) {
    const data = await requestJson(`${RESEARCH_PATH}/${id}`);
    return mapResearch(data);
}

export async function postResearch(body) {
    const data = await requestJson(RESEARCH_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return mapResearch(data);
}

export async function putResearch(id, body) {
    const data = await requestJson(`${RESEARCH_PATH}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    return mapResearch(data);
}

export async function deleteResearch(id) {
    return requestJson(`${RESEARCH_PATH}/${id}`, {
        method: 'DELETE',
    });
}