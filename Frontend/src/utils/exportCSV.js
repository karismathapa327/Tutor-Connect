export function downloadCSV(data, filename, columns) {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const headers = columns.map((col) => col.label).join(",");
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = col.render ? col.render(row[col.key], row) : row[col.key];
        const stringValue = value ? String(value).replace(/"/g, '""') : "";
        return `"${stringValue}"`;
      })
      .join(",");
  });

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
