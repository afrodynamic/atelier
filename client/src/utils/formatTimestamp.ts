export const formatDateTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
