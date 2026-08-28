export const createPublishedNewsInterface = (overrides = {}) => {
    const rawId = overrides.id || overrides.article_id || '';
    const idStr = typeof rawId === 'object' && rawId !== null ? String(rawId) : String(rawId || '');
    const nowIso = new Date().toISOString();
    const dateVal = overrides.publishedAt || overrides.createdAt || overrides.created_at || overrides.publish_date || nowIso;

    return {
        id: idStr,
        title: overrides.title || '',
        article: overrides.article || '',
        summary: overrides.summary || '',
        author: overrides.author || 'Editorial Desk',
        image: overrides.image || '',
        approx_time_to_read: Number(overrides.approx_time_to_read) || 3,
        category: Array.isArray(overrides.category) ? overrides.category : (overrides.category ? [overrides.category] : []),
        tags: Array.isArray(overrides.tags) ? overrides.tags : [],
        headlines: Array.isArray(overrides.headlines) ? overrides.headlines : [],
        display_section: Array.isArray(overrides.display_section) ? overrides.display_section : [],
        view_count: Number(overrides.view_count) || Number(overrides.views) || Number(overrides.clicks) || 0,
        status: overrides.status || 'published',
        createdAt: overrides.createdAt || overrides.created_at || dateVal,
        publishedAt: dateVal,
        publish_date: overrides.publish_date || dateVal,
        ...overrides,
        id: idStr,
        publishedAt: dateVal,
    };
};
