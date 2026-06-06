import type { Quotation } from "./types";

export const inr = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  officer: "Purchasing Officer",
  manager: "Department Manager",
  vendor: "Vendor",
};

export const quoteSubtotal = (quote: Quotation) => {
  return quote.lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
};
