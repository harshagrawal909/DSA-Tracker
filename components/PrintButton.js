"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="btn-primary btn-sm btn-print"
      style={{ display: "inline-block" }}
    >
      🖨️ Print Receipt
    </button>
  );
}
