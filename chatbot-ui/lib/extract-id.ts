export const extractIds = (selectedRows: any[]): string => {
  return selectedRows.map((row) => row.id).join(', ');
};

export const extractReportId = (selectedRows: any[]): string => {
  return selectedRows.map((row) => row.report_id).join(', ');
};

export const extractManualId = (selectedRows: any[]): string => {
  return selectedRows.join(', ');
};
