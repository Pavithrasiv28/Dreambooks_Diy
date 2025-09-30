"use client";
import dynamic from "next/dynamic";

// Dynamically import the client-only component
const BookCanvas = dynamic(() => import("../components/canvas"), { ssr: false });

export default function Booklayout() {
  return <BookCanvas />;
}
