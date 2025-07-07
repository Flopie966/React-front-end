import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">About MoneyBear</h1>
      <p className="mb-4 text-lg">
        We at <span className="font-semibold">MoneyBear</span> believe visual AI-driven search of your second-hand items is the future. We want to make it freely available via a cross-platform search tool. If you have any suggestions, please feel free to leave them in the forms below.
      </p>
      <p className="mb-4 text-lg">
        Use our tool: upload photos and see for yourself!
      </p>
      <Link href="/" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Try the Visual Search
      </Link>
    </main>
  );
} 