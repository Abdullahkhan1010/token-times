export const createResearchInterface = (overrides = {}) => ({
    id: '',
    title: '',
    author: '',
    publish_date: '',
    file: '',
    ...overrides,
});