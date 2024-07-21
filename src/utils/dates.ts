export const cancellationOnNextDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Set date to tomorrow
  tomorrow.setHours(23, 50, 0, 0); // Set time to 11:50 PM

  return tomorrow;
};
