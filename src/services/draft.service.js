import { createDraftInterface } from '../interfaces/draft.interface';
import { requestJson } from './api';

const DRAFTS_PATH = '/news/drafts';
const REDRAFT_PATH = '/news/redraft';

const mapDraft = (draft) => createDraftInterface(draft);

export async function getDrafts() {
    const data = await requestJson(DRAFTS_PATH);
    return Array.isArray(data) ? data.map(mapDraft) : [];
}

export async function getDraftById(id) {
    const data = await requestJson(`${DRAFTS_PATH}/${id}`);
    return mapDraft(data);
}

export async function postDraft(articleId) {
    const payload = typeof articleId === 'object' ? articleId : { article_id: articleId };
    const data = await requestJson(REDRAFT_PATH, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
    return mapDraft(data);
}

export const putDraft = postDraft;

export async function deleteDraft(id) {
    return requestJson(`${DRAFTS_PATH}/${id}`, {
        method: 'DELETE',
    });
}