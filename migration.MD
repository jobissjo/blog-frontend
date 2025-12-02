VITE -> NEXT_PUBLIC_

Most of the client side code use "use client"

INSTEAD OF ROUTER NAVIGATE -> NEXT/router
like
```jsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/login");

```

to 

```jsx
import { useRouter } from "next/router";

const router = useRouter();
router.push("/login");

```

### Routes

```jsx
import { Link } from "next/link";

<Link href="/login">Login</Link>
```

And Your App.tsx routes needed to file based, example if you have admin route
inside app folder create a admin folder and inside admin folder create a page.tsx, Be clear page.tsx need to lower case, not Page.tsx


### Image Optimization

```jsx
import Image from "next/image";

<Image src="/path/to/image.jpg" alt="Description" width={500} height={500} />
```


## STYLING

in tailwind.config.ts, previously look lik this
```ts
content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"]
```

now look like this
```ts
content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"]
```

## Local Storage Access

```ts
if (typeof window === "undefined") return null;
```

or More better and reuse this
```ts
const isBrowser = () => typeof window !== "undefined";

export const authService = {
  getCurrentUser(): User | null {
    if (!isBrowser()) return null;
    return JSON.parse(localStorage.getItem("user") ?? "null");
  },
```

## global context wrapper
```jsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```
