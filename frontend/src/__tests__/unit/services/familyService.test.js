import { describe, it, expect } from 'vitest';
import { getFamilies, createFamily } from '../../../services/familyService';

describe('familyService', () => {
  it('getFamilies() — returns paginated family list', async () => {
    const response = await getFamilies();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.data)).toBe(true);
    expect(response.data.data.length).toBeGreaterThan(0);
  });

  it('getFamilies() — each family has required fields', async () => {
    const response = await getFamilies();
    const family = response.data.data[0];
    expect(family).toHaveProperty('id');
    expect(family).toHaveProperty('headName');
    expect(family).toHaveProperty('villageName');
  });

  it('createFamily() — returns 201 with new family data', async () => {
    const newFamily = {
      headName: 'Ramu Kumar',
      villageName: 'Gundya Village',
      villageId: 'VLG-4829',
      houseNo: '45',
      economicStatus: 'BPL',
    };
    const response = await createFamily(newFamily);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('data');
    expect(response.data.data).toHaveProperty('id');
  });
});
