import { createKnowlegeHubInterface } from '../interfaces/knowlege-hub.interface';
import { requestJson } from './api';

const KNOWLEGE_HUB_PATH = '/knowlege-hub';

const mapKnowlegeHub = (item) => createKnowlegeHubInterface(item);

export async function getKnowlegeHubs() {
    const data = await requestJson(KNOWLEGE_HUB_PATH);
    return Array.isArray(data) ? data.map(mapKnowlegeHub) : [];
}

export async function getKnowlegeHub(id) {
    const data = await requestJson(`${KNOWLEGE_HUB_PATH}/${id}`);
    return mapKnowlegeHub(data);
}

export async function postKnowlegeHub(body) {
    const data = await requestJson(KNOWLEGE_HUB_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return mapKnowlegeHub(data);
}

export async function putKnowlegeHub(id, body) {
    const data = await requestJson(`${KNOWLEGE_HUB_PATH}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    return mapKnowlegeHub(data);
}

export async function deleteKnowlegeHub(id) {
    return requestJson(`${KNOWLEGE_HUB_PATH}/${id}`, {
        method: 'DELETE',
    });
}