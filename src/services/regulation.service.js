import { createRegulationInterface } from '../interfaces/regulation.interface';
import { requestJson } from './api';

const REGULATIONS_PATH = '/regulation';

const mapRegulation = (regulation) => createRegulationInterface(regulation);

export async function getRegulations() {
    const data = await requestJson(REGULATIONS_PATH);
    return Array.isArray(data) ? data.map(mapRegulation) : [];
}

export async function getRegulation(id) {
    const data = await requestJson(`${REGULATIONS_PATH}/${id}`);
    return mapRegulation(data);
}

export async function postRegulation(body) {
    const data = await requestJson(REGULATIONS_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return mapRegulation(data);
}

export async function putRegulation(id, body) {
    const data = await requestJson(`${REGULATIONS_PATH}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    return mapRegulation(data);
}

export async function deleteRegulation(id) {
    return requestJson(`${REGULATIONS_PATH}/${id}`, {
        method: 'DELETE',
    });
}