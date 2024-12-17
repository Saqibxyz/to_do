import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
