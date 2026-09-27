import { describe, it, expect } from 'vitest';
import { canCreateBooking, timeValidation } from './bookingValidator';
import type { User } from '../models/user';

describe('timeValidation', () => { 
    it('accepts a valid same-day time range', () => { 
        expect(timeValidation('09:00', '17:00')).toBe(true);
    });
    it('rejects an invalid time format', () => { 
        expect(timeValidation('9:00', '17:00')).toBe(false);
    });
    it('rejects the same start and end time', () => { 
        expect(timeValidation('09:00', '09:00')).toBe(false);
    });
    it('rejects the end time before the start time', () => { 
        expect(timeValidation('17:00', '09:00')).toBe(false);
    });
    it('rejects bookings crossing midnight', () => { 
        expect(timeValidation('23:00', '01:00')).toBe(false);
    });
    it('accepts a one minute case1', () => { 
        expect(timeValidation('00:00', '00:01')).toBe(true);
    });
    it('accepts a one minute case2', () => { 
        expect(timeValidation('23:58', '23:59')).toBe(true);
    });
    it('accepts a one-minute booking across an hour boundary', () => { 
        expect(timeValidation('09:59', '10:00')).toBe(true);
    });
    it('rejects out-of-range hours', () => { 
        expect(timeValidation('24:00', '25:00')).toBe(false);
    });
    it('rejects an out-of-range end hour', () => { 
        expect(timeValidation('09:00', '24:00')).toBe(false);
    });
    it('rejects an out-of-range start minute', () => { 
        expect(timeValidation('09:60', '11:00')).toBe(false);
    });
    it('rejects an out-of-range end minute', () => { 
        expect(timeValidation('09:00', '10:60')).toBe(false);
    });
    it('rejects lack of minutes', () => { 
        expect(timeValidation('09:00', '17:0')).toBe(false);
    });
    it('rejects wrong separator', () => { 
        expect(timeValidation('09-00', '17:00')).toBe(false);
    });
    it('rejects letters instead of numbers', () => { 
        expect(timeValidation('ab:cd', '17:00')).toBe(false);
    });
    it('rejects lack of time', () => { 
        expect(timeValidation('', '17:00')).toBe(false);
    });
    it('rejects extra space', () => { 
        expect(timeValidation('09:00', '17:00 ')).toBe(false);
    });
});

describe('canCreateBooking', () => { 
    it('allows a user with the booker role to create a booking', () => { 
        const user: User = { id: 1, name: 'Alice', role: 'booker' };
        expect(canCreateBooking(user)).toBe(true);
    });
    it('does not allow a user with the viewer role to create a booking', () => { 
        const user: User = { id: 2, name: 'Bob', role: 'viewer' };
        expect(canCreateBooking(user)).toBe(false);
    });
});