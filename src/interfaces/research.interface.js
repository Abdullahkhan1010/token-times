export const createResearchInterface = (overrides = {}) => ({
    _id: '',
    title: '',
    author: '',
    publish_date: '',
    file: '',
    ...overrides,
});