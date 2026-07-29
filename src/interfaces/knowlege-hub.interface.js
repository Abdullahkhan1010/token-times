export const createKnowlegeHubInterface = (overrides = {}) => ({
    id: '',
    question: '',
    answer: '',
    author: '',
    publish_date: '',
    tags: [],
    category: [],
    ...overrides,
});