import { createInterviewInterface } from '../interfaces/interview.interface';
import { requestJson } from './api';

const INTERVIEWS_PATH = '/interviews';

const mapInterview = (interview = {}) =>
    createInterviewInterface({
        ...interview,
        id: interview._id ? String(interview._id) : interview.id || '',
        _id: interview._id ? String(interview._id) : interview._id,
    });

export async function getInterviews() {
    const data = await requestJson(INTERVIEWS_PATH);
    return Array.isArray(data) ? data.map(mapInterview) : [];
}

export async function getInterview(id) {
    const data = await requestJson(`${INTERVIEWS_PATH}/${id}`);
    return mapInterview(data);
}

export async function postInterview(body) {
    const data = await requestJson(INTERVIEWS_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return mapInterview(data);
}

export async function putInterview(id, body) {
    const data = await requestJson(`${INTERVIEWS_PATH}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    return mapInterview(data);
}

export async function deleteInterview(id) {
    return requestJson(`${INTERVIEWS_PATH}/${id}`, {
        method: 'DELETE',
    });
}