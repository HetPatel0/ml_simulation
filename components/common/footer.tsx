import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Logo from "./logo";

import { HugeiconsIcon } from "@hugeicons/react";
import { CopyrightIcon } from "@hugeicons/core-free-icons";

function Footer() {
  function getYearFromDate(input: Date | string): number | null {
    try {
      let date: Date;

      // If input is a string, try to parse it
      if (typeof input === "string") {
        date = new Date(input);
      } else {
        date = input;
      }

      // Validate if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date provided.");
        return null;
      }

      return date.getFullYear();
    } catch (error) {
      console.error("Error extracting year:", error);
      return null;
    }
  }

  return (
    <footer className="relative mt-auto overflow-hidden">
      <Separator />
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col ">
            <div className="flex items-center scale-90 mr-200 ">
              <Logo />
            </div>

            <p className="flex items-center gap-1 text-sm leading-relaxed">
              <HugeiconsIcon icon={CopyrightIcon} className="h-3.5 w-3.5" />
              <span>
                {getYearFromDate(new Date())} ML
                <span className="font-normal">Simulation</span>
              </span>
            </p>

            <p className="text-sm leading-relaxed text-muted-foreground">
              All rights reserved <br />
              Not Financial advice, use responsibly
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
            {/* Column 1 */}
            <div className="[&>a:hover]:text-primary flex flex-col items-start gap-2">
              <Link href="/disclaimer">Disclaimer</Link>
            </div>
            {/* Column 2 */}
            <div className="[&>a:hover]:text-primary flex flex-col gap-2">
              <a href="https://github.com/HetPatel0/ml_simulation">
                Open Source
              </a>
              <a href="mailto:23010101034@darshan.ac.in">Contact</a>
            </div>

            {/* Column 3 */}
            <div className="[&>a:hover]:text-primary flex flex-col gap-2">
              <a href="https://x.com/Het1501">Twitter</a>
              <a href="https://www.linkedin.com/in/het-bhuva-b1330b332/">
                LinkedIn
              </a>
              <a href="https://github.com/HetPatel0">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
