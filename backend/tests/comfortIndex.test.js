import { describe, it, expect } from 'vitest';
import { computeComfortIndex } from '../src/services/comfortIndex.service';

describe('Comfort Index Service', () => {
    it('should calculate a perfect score for ideal conditions', () => {
        // Ideal: 21°C (294.15K), 50% humidity, 3m/s wind, 30% clouds, 10km visibility
        const idealData = {
            main: { temp: 294.15, humidity: 50 },
            wind: { speed: 3 },
            clouds: { all: 30 },
            visibility: 10000,
        };

        const result = computeComfortIndex(idealData);
        expect(result.score).toBe(100);
        expect(result.breakdown.temperature).toBe(100);
        expect(result.breakdown.humidity).toBe(100);
        expect(result.breakdown.wind).toBe(100);
        expect(result.breakdown.cloudiness).toBe(100);
        expect(result.breakdown.visibility).toBe(100);
    });

    it('should penalize high temperature', () => {
        // 30°C (303.15K) -> 6°C above ideal max (24°C)
        // Penalty: 6 * 3.5 = 21 -> Score: 79
        const hotData = {
            main: { temp: 303.15, humidity: 50 },
            wind: { speed: 3 },
            clouds: { all: 30 },
            visibility: 10000,
        };

        const result = computeComfortIndex(hotData);
        expect(result.breakdown.temperature).toBeCloseTo(79, 1);
    });

    it('should penalize very low humidity', () => {
        // 10% humidity -> 30% below ideal min (40%)
        // Penalty: 30 * 2.5 = 75 -> Score: 25
        const dryData = {
            main: { temp: 294.15, humidity: 10 },
            wind: { speed: 3 },
            clouds: { all: 30 },
            visibility: 10000,
        };

        const result = computeComfortIndex(dryData);
        expect(result.breakdown.humidity).toBe(25);
    });

    it('should handle zero visibility', () => {
        // 0m visibility -> Score: 0
        const fogData = {
            main: { temp: 294.15, humidity: 50 },
            wind: { speed: 3 },
            clouds: { all: 30 },
            visibility: 0,
        };

        const result = computeComfortIndex(fogData);
        expect(result.breakdown.visibility).toBe(0);
    });

    it('should handle stagnant wind', () => {
        // < 1m/s wind -> Score: 60
        const stillData = {
            main: { temp: 294.15, humidity: 50 },
            wind: { speed: 0.5 },
            clouds: { all: 30 },
            visibility: 10000,
        };

        const result = computeComfortIndex(stillData);
        expect(result.breakdown.wind).toBe(60);
    });

    it('should cap scores at 0 (no negative scores)', () => {
        // Extreme heat: 50°C (323.15K) -> 26°C above max
        // Penalty: 26 * 3.5 = 91 -> Score: 9
        // Wait, let's try extreme cold: -20°C (253.15K) -> 38°C below min (18)
        // Penalty: 38 * 3.5 = 133 -> Score: -33 -> Should be 0
        const freezingData = {
            main: { temp: 253.15, humidity: 50 },
            wind: { speed: 3 },
            clouds: { all: 30 },
            visibility: 10000,
        };

        const result = computeComfortIndex(freezingData);
        expect(result.breakdown.temperature).toBe(0);
    });
});
