export const createRegulationInterface = (overrides = {}) => ({
    id: '',
    title: '',
    authority: '',
    publish_date: '',
    file: '',
    ...overrides,
});