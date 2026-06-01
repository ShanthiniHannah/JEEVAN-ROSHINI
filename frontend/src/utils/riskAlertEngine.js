/**
 * Risk Alert Evaluation Engine for Jeevan Roshini
 * Analyzes individual data fields and returns an array of clinical warnings/risk alerts.
 */
export function evaluateRiskAlerts(individual) {
  const alerts = [];
  const ageVal = parseInt(individual.age, 10) || 0;
  const isFemale = individual.gender?.toLowerCase() === 'female';
  const isPregnant = individual.pregnancyStatus?.toLowerCase() === 'yes';

  // 1. High-Risk Pregnancies
  if (isFemale && isPregnant) {
    if (ageVal < 18) {
      alerts.push({
        type: 'High-Risk Pregnancy',
        severity: 'high',
        reason: 'Teenage pregnancy (Age under 18)'
      });
    } else if (ageVal > 35) {
      alerts.push({
        type: 'High-Risk Pregnancy',
        severity: 'high',
        reason: 'Advanced maternal age (Age over 35)'
      });
    }

    if (individual.chronicDiseases?.includes('Hypertension')) {
      alerts.push({
        type: 'High-Risk Pregnancy',
        severity: 'critical',
        reason: 'Gestational Hypertension / Preeclampsia risk'
      });
    }

    if (individual.chronicDiseases?.includes('Diabetes')) {
      alerts.push({
        type: 'High-Risk Pregnancy',
        severity: 'critical',
        reason: 'Gestational Diabetes risk'
      });
    }
  }

  // 2. Uncontrolled Diabetes & Hypertension Risk
  if (individual.chronicDiseases?.includes('Diabetes')) {
    alerts.push({
      type: 'Chronic Disease Monitoring',
      severity: 'medium',
      reason: 'Active Diabetes: Requires monthly sugar tests & dietary follow-up'
    });
  }

  if (individual.chronicDiseases?.includes('Hypertension')) {
    alerts.push({
      type: 'Hypertension Risk',
      severity: 'medium',
      reason: 'Active Hypertension: Requires regular BP check-ups'
    });
  }

  // 3. Severe Child Malnutrition (Age <= 5)
  if (ageVal <= 5) {
    if (individual.malnutritionStatus === 'severe') {
      alerts.push({
        type: 'Severe Malnutrition',
        severity: 'critical',
        reason: 'Under-5 child marked as Severely Acutely Malnourished (SAM)'
      });
    } else if (individual.malnutritionStatus === 'moderate') {
      alerts.push({
        type: 'Moderate Malnutrition',
        severity: 'medium',
        reason: 'Under-5 child marked as Moderately Acutely Malnourished (MAM)'
      });
    }
  }

  // 4. Elderly Living Alone (Age >= 65)
  if (ageVal >= 65 && individual.livingAlone === 'yes') {
    alerts.push({
      type: 'Elderly Living Alone',
      severity: 'high',
      reason: 'Geriatric vulnerable group: Requires weekly social support check'
    });
  }

  // 5. Tuberculosis active tracker
  if (individual.chronicDiseases?.includes('Tuberculosis')) {
    alerts.push({
      type: 'Tuberculosis DOTS Monitoring',
      severity: 'high',
      reason: 'Active TB: Needs daily DOTS treatment tracking and contact tracing'
    });
  }

  return alerts;
}
