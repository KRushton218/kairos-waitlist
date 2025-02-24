import { useState } from "react";
import { motion } from "framer-motion";
import WorkSurvey from '../components/WorkSurvey';

export default function WorkSignUp() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-background p-8">
      <h1 className="text-3xl font-bold mb-6 text-text text-center sm:text-left relative top-8 w-full max-w-md">
        <span className="text-accent">Kairos</span> Waitlist Application
      </h1>
      <div className="mt-16 w-full max-w-md mx-auto">
        <WorkSurvey />
      </div>
    </div>
  );
}
