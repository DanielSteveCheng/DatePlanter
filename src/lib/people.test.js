import { describe, expect, it } from 'vitest';
import { MAX_PEOPLE, canAddPerson, createPerson, findPerson, partnerOf, validatePersonName, withDevice } from './people';

const now = new Date('2026-10-21T09:00:00Z');
const dan = createPerson(' Dan ', { deviceId: 'desktop', now, id: 'dan' });
const sam = createPerson('Sam', { deviceId: 'mac', now, id: 'sam' });

describe('people', () => {
  it('creates a person owning the computer that set them up', () => {
    expect(dan).toEqual({ id: 'dan', name: 'Dan', deviceIds: ['desktop'], location: null, createdAt: now.toISOString() });
  });

  it('adds another computer to a person only once', () => {
    const withLaptop = withDevice(dan, 'laptop');
    expect(withLaptop.deviceIds).toEqual(['desktop', 'laptop']);
    expect(withDevice(withLaptop, 'laptop')).toBe(withLaptop);
  });

  it('allows only two people in a garden', () => {
    expect(MAX_PEOPLE).toBe(2);
    expect(canAddPerson([dan])).toBe(true);
    expect(canAddPerson([dan, sam])).toBe(false);
  });

  it('finds me and my partner', () => {
    expect(findPerson([dan, sam], 'sam')).toBe(sam);
    expect(findPerson([dan], 'nobody')).toBeNull();
    expect(partnerOf([dan, sam], dan)).toBe(sam);
    expect(partnerOf([dan], dan)).toBeNull();
    expect(partnerOf([dan, sam], null)).toBeNull();
  });

  it('needs a name', () => {
    expect(validatePersonName('  ')).toBeTruthy();
    expect(validatePersonName('Dan')).toBeNull();
  });
});
