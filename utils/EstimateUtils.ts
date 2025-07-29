export const formatCountdown = (
  now: number,
  estimationCloseAt: string | Date | number | null
): string => {
  if (!estimationCloseAt) return "";

  const target = new Date(estimationCloseAt).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return "Estimation period has ended.";
  }

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

