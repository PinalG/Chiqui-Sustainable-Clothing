
export const calculateTaxBenefit = (totalValue: number): number => {
  // Simplified tax benefit calculation - typically 30% of donation value
  return totalValue * 0.30;
};

export const calculateStorageBenefit = (storageArea: number): number => {
  // Simplified storage benefit calculation - $2.50 per sq ft
  return storageArea * 2.50;
};

export const generateBatchId = (): string => {
  return `RTL-${Math.floor(100000 + Math.random() * 900000)}`;
};

export const generateDefaultBatchName = (): string => {
  return `Batch #${Math.floor(1000 + Math.random() * 9000)}`;
};
