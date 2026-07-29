import { createMagzineInterface } from '../interfaces/magzine.interface';
import { requestJson } from './api';

const MAGZINE_PATH = '/magzine';

const mapMagzine = (magzine) => createMagzineInterface(magzine);

export async function getMagzines() {
    const data = await requestJson(MAGZINE_PATH);
    return Array.isArray(data) ? data.map(mapMagzine) : [];
}

export async function getMagzine(id) {
    const data = await requestJson(`${MAGZINE_PATH}/${id}`);
    return mapMagzine(data);
}

export async function postMagzine(body) {
    const data = await requestJson(MAGZINE_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return mapMagzine(data);
}

export async function putMagzine(id, body) {
    const data = await requestJson(`${MAGZINE_PATH}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    return mapMagzine(data);
}

export async function deleteMagzine(id) {
    return requestJson(`${MAGZINE_PATH}/${id}`, {
        method: 'DELETE',
    });
}