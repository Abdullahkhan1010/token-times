export const createMagzineInterface = (overrides = {}) => ({
    _id: '',
    title: '',
    cover_img: '',
    description: '',
    price: 0,
    issue_name: '',
    publish_date: '',
    file: '',
    ...overrides,
});