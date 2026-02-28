// File: app/layout.jsx

import { Patrick_Hand } from "next/font/google"; // Step 2
import "./globals.css";

// Step 3
const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Unfail.io",
  description: "Slightly helpful advice for when things go sideways.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Step 4: Apply the className here */}
      <body className={`${patrickHand.className} bg-[#FDFCF8] text-gray-800`}>
        {children}
      </body>
    </html>
  );
}