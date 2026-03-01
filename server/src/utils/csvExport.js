const escapeCsv = (value) => {
  const stringValue = `${value ?? ""}`.replace(/"/g, '""');
  return `"${stringValue}"`;
};

export const toCsv = (rows, columns) => {
  const header = columns.map((column) => escapeCsv(column.label)).join(",");
  const body = rows
    .map((row) => columns.map((column) => escapeCsv(row[column.key])).join(","))
    .join("\n");
  return `${header}\n${body}`;
};
