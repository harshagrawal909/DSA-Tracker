import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "AlgoPath – Master DSA at Your Own Pace",
  description:
    "Track your DSA journey day by day. Choose from 1-month to 6-month schedules. Follow Striver's A2Z sheet with streak tracking, problem notes, and progress analytics. One-time payment, lifetime access.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
