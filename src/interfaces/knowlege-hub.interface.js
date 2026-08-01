export const createKnowlegeHubInterface = (overrides = {}) => ({
    _id: '',
    question: '',
    answer: '',
    author: '',
    publish_date: '',
    tags: [],
    category: [],
    ...overrides,
});