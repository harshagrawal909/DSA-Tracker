import { ThemeProvider } from "@/components/ThemeProvider";

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="dashboard-layout">
        {children}
      </div>
    </ThemeProvider>
  );
}
