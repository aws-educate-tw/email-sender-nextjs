export const convertToTaipeiTime = (utcDateString: string): string => {
    const utcDate = new Date(utcDateString);
    
    // Taipei is UTC+8
    const taipeiOffset = 8 * 60; // offset in minutes
    const taipeiTime = new Date(utcDate.getTime() + taipeiOffset * 60 * 1000);
    
    return taipeiTime.toISOString().replace('T', ' ').substring(0, 19);
  }