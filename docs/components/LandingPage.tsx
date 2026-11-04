"use client";

import { useEffect, useState } from "react";

import ArrowIcon from "./ArrowIcon";

const footerShapes = [
  { primary: "01.png", alt: "01-dark.png", hiddenMobile: false },
  { primary: "02.png", alt: "02-dark.png", hiddenMobile: false },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: null, alt: null, hiddenMobile: true },
  { primary: "03.png", alt: "03-dark.png", hiddenMobile: false },
  { primary: "04.png", alt: "04-dark.png", hiddenMobile: false },
  { primary: "05.png", alt: "05-dark.png", hiddenMobile: true },
  { primary: "06.png", alt: "06-dark.png", hiddenMobile: false },
  { primary: "07.png", alt: "07-dark.png", hiddenMobile: false },
  { primary: "08.png", alt: "08-dark.png", hiddenMobile: true },
  { primary: "09.png", alt: "09-dark.png", hiddenMobile: true },
  { primary: "06.png", alt: "06-dark.png", hiddenMobile: true },
  { primary: "10.png", alt: "10-dark.png", hiddenMobile: true },
  { primary: "11.png", alt: "11-dark.png", hiddenMobile: true },
  { primary: "12.png", alt: "12-dark.png", hiddenMobile: true },
  { primary: "03.png", alt: "03-dark.png", hiddenMobile: true },
  { primary: "13.png", alt: "13-dark.png", hiddenMobile: false },
  { primary: "06.png", alt: "06-dark.png", hiddenMobile: false },
  { primary: "14.png", alt: "14-dark.png", hiddenMobile: true },
  { primary: "15.png", alt: "15-dark.png", hiddenMobile: true },
  { primary: "06.png", alt: "06-dark.png", hiddenMobile: true },
  { primary: "03.png", alt: "03-dark.png", hiddenMobile: true },
  { primary: "16.png", alt: "16-dark.png", hiddenMobile: false },
  { primary: "17.png", alt: "17-dark.png", hiddenMobile: false },
];

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Vocs 2 sets the active scheme as an inline `color-scheme` on <html>
    // ("light", "dark", or "light dark" meaning follow the OS).
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const checkDarkMode = () => {
      const scheme = document.documentElement.style.colorScheme;
      setIsDarkMode(scheme === "dark" || (scheme !== "light" && mq.matches));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    mq.addEventListener("change", checkDarkMode);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", checkDarkMode);
    };
  }, []);

  return (
    <div className="lp text-slate dark:text-white">
      <h1 className="lp-hero text-center !mt-24 !mb-6">
        Binary Proofs, <br className="lg:hidden" />
        Blazing Fast
      </h1>

      <p className="text-center text-[20px]">
        Unlock the full potential of high-performance ZK with Binius
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
        <a href="/basics">
          <div className="bg-green hover:brightness-110 transition-all p-8 flex flex-col h-full dark:text-slate ">
            <img
              src="books-icon.svg"
              alt="Books Icon"
              className="mb-6"
              style={{ width: "40px", height: "40px" }}
            />
            <div className="flex flex-col gap-4 flex-grow">
              <h2>Basics</h2>
              <p className="mb-4">
                Understand Binius fundamentals and core concepts
              </p>
            </div>
            <ArrowIcon />
          </div>
        </a>

        <a href="/building">
          <div className="bg-orange hover:brightness-110 transition-all p-8 flex flex-col h-full dark:text-slate">
            <img
              src="power-button-icon.svg"
              alt="Building Icon"
              className="mb-6"
              style={{ width: "40px", height: "40px" }}
            />
            <div className="flex flex-col gap-4 flex-grow">
              <h2>Building</h2>
              <p className="mb-4">Learn how to write a SNARK with Binius</p>
            </div>
            <ArrowIcon />
          </div>
        </a>

        <a href="/blueprint">
          <div className="bg-blue hover:brightness-110 transition-all p-8 flex flex-col h-full dark:text-slate">
            <img
              src="blueprint-icon.svg"
              alt="Blueprint Icon"
              className="mb-6"
              style={{ width: "40px", height: "40px" }}
            />
            <div className="flex flex-col gap-4 flex-grow">
              <h2>Blueprint</h2>
              <p className="mb-4">
                Learn how Binius proofs are generated and verified
              </p>
            </div>
            <ArrowIcon />
          </div>
        </a>

        <a href="/benchmarks">
          <div className="bg-red hover:brightness-110 transition-all p-8 flex flex-col h-full dark:text-slate">
            <img
              src="chart-icon.svg"
              alt="Chart Icon"
              className="mb-6"
              style={{ width: "40px", height: "40px" }}
            />
            <div className="flex flex-col gap-4 flex-grow">
              <h2>Benchmarks</h2>
              <p className="mb-4">Explore up-to-date comparative benchmarks</p>
            </div>
            <ArrowIcon />
          </div>
        </a>
      </div>

      <a
        href="https://github.com/binius-zk"
        aria-label="GitHub"
        className="flex justify-center mt-12 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>

      <footer className="w-screen absolute left-1/2 -translate-x-1/2 mt-20">
        <div className="shape-grid">
          {footerShapes.map((shape, index) => (
            <div
              key={index}
              className={shape.hiddenMobile ? "hidden-mobile" : ""}
            >
              {shape.primary && (
                <img
                  src={
                    isDarkMode
                      ? `shapes/${shape.alt}`
                      : `shapes/${shape.primary}`
                  }
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
