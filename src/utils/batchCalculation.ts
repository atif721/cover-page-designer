const YEAR = 2026;
const MONTH = 7;
const CURRENT_BATCH = 39;
function getCurrentBatch(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  // const currentYear = 2027;
  // const currentMonth = 7;

  const monthsPassed =
    (currentYear - YEAR) * 12 + (currentMonth - MONTH);
  const batchesPassed = Math.floor(monthsPassed / 6);

  return CURRENT_BATCH + batchesPassed;
}
function getBatches(): string[] {
  const seniorBatch = getCurrentBatch() - 9;
  const juniorBatches: string[] = [];
  for (let i = seniorBatch; i <= getCurrentBatch(); i++) {
    juniorBatches.push(i.toString());
  }
  return juniorBatches;
}
export const BATCH: string[] = getBatches();
