import { createPublishedNewsInterface } from '../interfaces/published-news.interface';
import { requestJson } from './api';

const PUBLISHED_NEWS_PATH = '/published-news';

const mapPublishedNews = (news) => createPublishedNewsInterface(news);

export async function getPublishedNews() {
    const data = await requestJson(PUBLISHED_NEWS_PATH);
    return Array.isArray(data) ? data.map(mapPublishedNews) : [];
}

export async function getPublishedNewsById(id) {
    const data = await requestJson(`${PUBLISHED_NEWS_PATH}/${id}`);
    return mapPublishedNews(data);
}

export async function postPublishedNews(body) {
    const data = await requestJson(PUBLISHED_NEWS_PATH, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return mapPublishedNews(data);
}

export async function putPublishedNews(id, body) {
    const data = await requestJson(`${PUBLISHED_NEWS_PATH}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
    return mapPublishedNews(data);
}

export async function deletePublishedNews(id) {
    return requestJson(`${PUBLISHED_NEWS_PATH}/${id}`, {
        method: 'DELETE',
    });
}

export async function archivePublishedNews(id) {
    const data = await requestJson(`${PUBLISHED_NEWS_PATH}/archive/${id}`, {
        method: 'POST',
    });
    return mapPublishedNews(data);
}
