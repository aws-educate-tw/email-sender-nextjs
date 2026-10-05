export const convertToTaipeiTime = (utcDateString: string): string => {
  const utcDate = new Date(utcDateString);

  // Taipei is UTC+8
  const taipeiOffset = 8 * 60; // offset in minutes
  const taipeiTime = new Date(utcDate.getTime() + taipeiOffset * 60 * 1000);

  return taipeiTime.toISOString().replace("T", " ").substring(0, 19);
};

// The send-email API only accepts ISO 8601 datetime strings without milliseconds
// (YYYY-MM-DDTHH:MM:SSZ), while Date.toISOString() always includes them.
export const toIso8601Seconds = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
