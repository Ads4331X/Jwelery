export const formatNPR = (n?: number) =>
  typeof n === "number" && n > 0
    ? "Rs " +
      new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(n)
    : "N/A";
