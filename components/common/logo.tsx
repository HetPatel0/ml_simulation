import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      scroll={true}
      className="flex items-center  font-semibold tracking-tight select-none"
    >
      <Image
        src="/logo.png"
        alt="ML Simulation Logo"
        width={60}
        height={60}
        priority
        className="shrink-0"
      />

      <span className="text-lg">
        ML<span className="font-normal">Simulation</span>
      </span>
    </Link>
  );
}
