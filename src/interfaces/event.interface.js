export const createEventInterface = (overrides = {}) => ({
    id: '',
    event_title: '',
    event_venue: '',
    event_adress: '',
    event_date: '',
    event_guests: [],
    event_description: '',
    event_hosts: [],
    event_agenda: '',
    image: '',
    ...overrides,
});