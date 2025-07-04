export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `MP${timestamp}${randomPart}`.toUpperCase();
};

export const formatMerchantId = (id: string): string => {
  // Format as MP-XXXX-XXXX-XXXX
  return id.replace(/(.{2})(.{4})(.{4})(.*)/, '$1-$2-$3-$4');
};