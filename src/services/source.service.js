import { requestJson } from './api';

const SOURCE_PATH = '/source';

export async function getSources() {
    const data = await requestJson(SOURCE_PATH);
    return Array.isArray(data) ? data : [];
}

export async function getSource(id) {
    return requestJson(`${SOURCE_PATH}/${id}`);
}

export async function postSource(body) {
    return requestJson(SOURCE_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
        noCache: true,
    });
}

export async function patchSource(id, body) {
    return requestJson(`${SOURCE_PATH}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        noCache: true,
    });
}

export async function deleteSource(id) {
    return requestJson(`${SOURCE_PATH}/${id}`, {
        method: 'DELETE',
        noCache: true,
    });
}
