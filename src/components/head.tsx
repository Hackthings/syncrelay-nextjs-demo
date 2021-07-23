import Link from "next/link";

export function Header() {
  return (
    <header className="mt-24 p-4 grid place-items-center">
      <Link href="/" passHref>
        <a>
          <h1 className="text-2xl font-bold">SyncRelay Demo</h1>
        </a>
      </Link>
    </header>
  );
}
