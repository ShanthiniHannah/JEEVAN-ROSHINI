import { describe, it, expect } from 'vitest';
import { getIndividuals, createIndividual } from '../../../services/individualService';

describe('individualService', () => {
  it('getIndividuals() — returns patient list', async () => {
    const response = await getIndividuals();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  it('getIndividuals() — each individual has required PII fields', async () => {
    const response = await getIndividuals();
    const patient = response.data.data[0];
    expect(patient).toHaveProperty('id');
    expect(patient).toHaveProperty('name');
    expect(patient).toHaveProperty('age');
    expect(patient).toHaveProperty('gender');
  });

  it('createIndividual() — registers a new health record with 201', async () => {
    const payload = {
      familyId: 'FAM-001',
      name: 'Kavitha N',
      age: 28,
      gender: 'Female',
      pregnancyStatus: 'Yes',
    };
    const response = await createIndividual(payload);
    expect(response.status).toBe(201);
    expect(response.data.data).toHaveProperty('id');
  });
});
