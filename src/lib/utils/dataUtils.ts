export const convertToTaipeiTime = (utcDateString: string): string => {
    const utcDate = new Date(utcDateString);
    
    // Taipei is UTC+8
    const taipeiOffset = 8 * 60; // offset in minutes
    const taipeiTime = new Date(utcDate.getTime() + taipeiOffset * 60 * 1000);
    
    return taipeiTime.toISOString().replace('T', ' ').substring(0, 19);
  }

export const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }