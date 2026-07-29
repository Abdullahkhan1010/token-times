import { createEventInterface } from '../interfaces/event.interface';
import { requestJson } from './api';

const EVENTS_PATH = '/events';

const mapEvent = (event) => createEventInterface(event);

export async function getEvents() {
    const data = await requestJson(EVENTS_PATH);
    return Array.isArray(data) ? data.map(mapEvent) : [];
}

export async function getEvent(id) {
    const data = await requestJson(`${EVENTS_PATH}/${id}`);
    return mapEvent(data);
}

export async function postEvent(body) {
    const data = await requestJson(EVENTS_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return mapEvent(data);
}

export async function putEvent(id, body) {
    const data = await requestJson(`${EVENTS_PATH}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    return mapEvent(data);
}

export async function deleteEvent(id) {
    return requestJson(`${EVENTS_PATH}/${id}`, {
        method: 'DELETE',
    });
}