import { requestJson } from './api';

const CRYPTO_PATH = '/crypto';

export async function getCryptoTrend(symbol = 'BTCUSDT', interval = '1h', limit = 100) {
    const query = new URLSearchParams({ symbol, interval, limit: String(limit) });
    return requestJson(`${CRYPTO_PATH}?${query.toString()}`);
}

export async function getCrypto24HourTickerData(symbol = 'BTCUSDT') {
    return requestJson(`${CRYPTO_PATH}/ticker/24h?symbol=${encodeURIComponent(symbol)}`);
}

export async function getCryptoStats(symbol = 'BTCUSDT') {
    return requestJson(`${CRYPTO_PATH}/stats?symbol=${encodeURIComponent(symbol)}`);
}

export async function getCryptoPrice(symbol = 'BTCUSDT') {
    return requestJson(`${CRYPTO_PATH}/price?symbol=${encodeURIComponent(symbol)}`);
}