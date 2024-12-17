import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
    title: "TaskAi | Optimize Your Productivity",
    description: "A powerful task manager application to organize, manage, and optimize your tasks efficiently with AI.",
    keywords: "task manager, productivity, AI task optimization, to-do list, task management",
    author: "Saqib Ayoub",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords} />
                <meta name="author" content={metadata.author} />
                <link rel="icon" href="/favicon.ico" />
                <title>{metadata.title}</title>
            </head>
            <ClerkProvider>
                <body>
                    {children}
                </body>
            </ClerkProvider>
        </html>
    );
}
