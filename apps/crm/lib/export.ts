/* Utilidades de exportación (cliente): CSV, Excel (.xls vía tabla HTML) y PDF
   (vía window.print sobre .print-area). Sin dependencias externas. */

export type Cell = string | number;

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: Cell): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function escapeHtml(value: Cell): string {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Exporta a CSV (con BOM para que Excel respete los acentos). */
export function exportCSV(filename: string, headers: string[], rows: Cell[][]) {
  const lines = [headers.map(escapeCsv).join(","), ...rows.map((r) => r.map(escapeCsv).join(","))];
  downloadBlob(`${filename}.csv`, `﻿${lines.join("\n")}`, "text/csv;charset=utf-8");
}

/** Exporta a Excel mediante una tabla HTML que Excel abre nativamente (.xls). */
export function exportExcel(filename: string, headers: string[], rows: Cell[][]) {
  const thead = `<tr>${headers.map((h) => `<th style="background:#3a23a8;color:#fff;text-align:left">${escapeHtml(h)}</th>`).join("")}</tr>`;
  const tbody = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">${thead}${tbody}</table></body></html>`;
  downloadBlob(`${filename}.xls`, html, "application/vnd.ms-excel;charset=utf-8");
}

/** Exporta a PDF usando el diálogo de impresión del navegador. */
export function exportPDF() {
  window.print();
}
