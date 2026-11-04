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
