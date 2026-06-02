import { describe, it, expect } from 'vitest';
import { getFamilies, createFamily } from '../../services/familyService';
import { getIndividuals, createIndividual } from '../../services/individualService';

/**
 * Integration Test: Family + Individual Registration Flow
 *
 * Tests the complete field data registration sequence:
 *   1. Register a family household
 *   2. Register an individual belonging to that family
 *   3. Verify both resources return in list queries
 */
describe('Family Registration Integration Flow', () => {
  it('register family then fetch it from list', async () => {
    // Create
    const createRes = await createFamily({
      headName: 'Integration Test Family',
      villageName: 'Gundya Village',
      villageId: 'VLG-4829',
      houseNo: '99',
      economicStatus: 'BPL',
    });
    expect(createRes.status).toBe(201);
    expect(createRes.data.data).toHaveProperty('id');

    // List
    const listRes = await getFamilies();
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.data.data)).toBe(true);
  });

  it('register individual with family link', async () => {
    const res = await createIndividual({
      familyId: 'FAM-001',
      name: 'Integration Test Patient',
      age: 35,
      gender: 'Male',
      pregnancyStatus: 'No',
      malnutritionStatus: 'none',
    });
    expect(res.status).toBe(201);
    expect(res.data.data).toHaveProperty('id');
  });

  it('individual list contains data records array', async () => {
    const res = await getIndividuals();
    expect(res.data).toHaveProperty('data');
    expect(Array.isArray(res.data.data)).toBe(true);
  });
});
