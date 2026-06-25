import { SpeedInsights } from "@vercel/speed-insights/next";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
