"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="relative">
          <h1 className="text-9xl font-black text-primary/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <Ghost className="size-24 text-primary animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-[500px] text-lg">
          Oops! It seems like the page you are looking for has vanished into the void.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/">
            <MoveLeft className="mr-2 size-4" />
            Return Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
