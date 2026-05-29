// src/components/workflow/WorkflowPage.tsx
"use client";

import React from "react";
import LenisProvider from "@/components/balanced/LenisProvider";
import Navbar from "@/components/balanced/Navbar";
import Footer from "@/components/balanced/Footer";
import WorkflowCanvas from "./WorkflowCanvas";

export default function WorkflowPage() {
  return (
    <LenisProvider>
      <Navbar />
      <WorkflowCanvas />
      <Footer />
    </LenisProvider>
  );
}
