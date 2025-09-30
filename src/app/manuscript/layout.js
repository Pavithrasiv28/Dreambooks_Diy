"use client";
import dynamic from "next/dynamic";

const ManuscriptLayout = dynamic(
  () => import("../components/manuscript"),
  { ssr: false } // client-only
);

export default function ManuscriptPage() {
  return <ManuscriptLayout />;
}