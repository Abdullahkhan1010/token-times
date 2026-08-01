export const createRegulationInterface = (overrides = {}) => ({
    _id: '',
    title: '',
    authority: '',
    publish_date: '',
    file: '',
    ...overrides,
});