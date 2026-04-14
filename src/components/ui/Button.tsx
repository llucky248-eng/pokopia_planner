"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "accent" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-sky-deep text-white hover:bg-sky-700 shadow-md",
  secondary: "bg-cloud-soft text-text-primary hover:bg-cloud border border-gray-200",
  accent: "bg-sunset text-white hover:bg-orange-500 shadow-md",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-md",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
