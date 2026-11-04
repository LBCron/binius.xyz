"use client";

import * as React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  const childrenArray = React.Children.toArray(children);
  const headerContent = childrenArray[0];
  const bodyContent = childrenArray.slice(1);

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="space-y-3 text-md">
      {headerContent}
      {isOpen && bodyContent}

      <div
        className="flex justify-center hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-sm py-3 transition-colors duration-300"
        onClick={() => {
          setIsOpen((isOpen) => !isOpen);
        }}
      >
        <div
          className={`transition-transform duration-300 ${isOpen ? "-rotate-90" : "rotate-90"}`}
        >
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 11L6 6L1 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
