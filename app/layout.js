import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

export const metadata = {
  title: "DSA Tracker",
  description: "Track your DSA journey day by day",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
