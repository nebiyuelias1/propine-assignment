export const parseDate = (date: string) => {
    const timestamp = Date.parse(date);
    if (isNaN(timestamp) || timestamp < 0) {
      // Date is invalid format.
      console.error("Invalid date format. Use mm-dd-yyyy");
      process.exit(1);
    }
    return new Date(timestamp);
}