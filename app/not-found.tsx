"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

function FloatingGhost() {
  return (
    <motion.div
      className="relative"
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-28 h-34 sm:w-32 sm:h-38 md:w-40 md:h-48 lg:w-48 lg:h-58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ghost body */}
        <motion.path
          d="M50 10 C25 10 10 35 10 60 L10 100 L20 90 L30 100 L40 90 L50 100 L60 90 L70 100 L80 90 L90 100 L90 60 C90 35 75 10 50 10Z"
          className="fill-primary/20 stroke-primary"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Left eye */}
        <motion.circle
          cx="35"
          cy="50"
          r="8"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        />
        {/* Right eye */}
        <motion.circle
          cx="65"
          cy="50"
          r="8"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        />
        {/* Mouth (surprised O) */}
        <motion.ellipse
          cx="50"
          cy="72"
          rx="6"
          ry="8"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        />
      </svg>

      {/* Glow effect */}
      <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full -z-10" />
    </motion.div>
  );
}

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center"
      >
        <FloatingGhost />

        <div className="mt-6 sm:mt-8 lg:mt-10 space-y-2 sm:space-y-3 lg:space-y-4">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter text-primary/80"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight"
          >
            Page Not Found
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-md lg:max-w-lg"
          >
            This page has ghosted you. It either never existed or has moved
            somewhere else.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3"
        >
          <Button
            size="lg"
            onClick={handleGoBack}
            className="rounded-full px-6 lg:px-8 gap-2 group cursor-pointer"
          >
            <MoveLeft className="size-4 lg:size-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/")}
            className="rounded-full px-6 lg:px-8 gap-2 group cursor-pointer"
          >
            <Home className="size-4 lg:size-5" />
            Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
