"use client";
import "tailwindcss/tailwind.css";
import * as React from "react";
import { Toaster, toast } from "sonner";

export default function Home() {
  return (
    <div>
      <h1 className="font-bold underline text-7xl">Hello world!</h1>
      <div>
        <Toaster />
        <button onClick={() => toast.success("Changes successfully saved!")}>
          Give me a toast
        </button>
      </div>
    </div>
  );
}
