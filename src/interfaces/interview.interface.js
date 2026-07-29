export const createInterviewInterface = (overrides = {}) => ({
    id: '',
    questions: [],
    answers: [],
    interviewee_name: '',
    interviewer_name: '',
    interview_title: '',
    interviewee_image: '',
    publish_date: '',
    tags: [],
    category: [],
    ...overrides,
});