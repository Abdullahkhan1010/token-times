import { requestJson } from './api';

const FOREX_PATH = '/forex';

export async function getForexRates() {
    return requestJson(FOREX_PATH);
}
