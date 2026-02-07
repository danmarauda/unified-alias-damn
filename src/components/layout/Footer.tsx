import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-border border-t px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-muted-foreground text-sm">
          <span>© 2025 </span>
          <span className="ml-2 flex items-center">
            <span className="font-bold">ALIAS - AEOS</span>
          </span>
        </div>
        <div className="hidden space-x-6 text-muted-foreground text-xs md:flex">
          <Link
            className="transition-colors hover:text-foreground"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/terms"
          >
            Terms of Use
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/documentation"
          >
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  );
}
