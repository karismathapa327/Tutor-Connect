import { useState } from "react";

function ReusableTable({
  columns = [],
  data = [],
  loading = false,
  emptyIcon: EmptyIcon,
  emptyTitle = "No Data",
  emptyDescription = "There are no records to display.",
  rowKey = "_id",
  onRowClick,
  actions,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const getValue = (obj, path) => {
    if (!path) return obj;
    return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = getValue(a, sortKey);
    const bVal = getValue(b, sortKey);
    if (aVal === undefined || bVal === undefined) return 0;
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortKey !== key) return null;
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="p-4">
                    {col.label}
                  </th>
                ))}
                {actions && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      <div className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded h-4 w-24" />
                    </td>
                  ))}
                  {actions && <td className="p-4" />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-12 text-center">
        {EmptyIcon && (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <EmptyIcon size={32} />
          </div>
        )}
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{emptyTitle}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`p-4 ${col.sortable !== false ? "cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable !== false && <span className="text-[10px] opacity-50">{getSortIcon(col.key)}</span>}
                  </div>
                </th>
              ))}
              {actions && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedData.map((row) => (
                  <tr
                    key={row[rowKey]}
                    onClick={() => onRowClick?.(row)}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="p-4">
                        {col.render ? col.render(getValue(row, col.key), row) : getValue(row, col.key) ?? "—"}
                      </td>
                    ))}
                    {actions && <td className="p-4 text-right">{actions(row)}</td>}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReusableTable;
