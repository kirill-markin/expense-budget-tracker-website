"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CopyCodeField.module.css";

type CopyState = "idle" | "copied" | "failed";

interface CopyCodeFieldProps {
  readonly value: string;
}

export function CopyCodeField({ value }: CopyCodeFieldProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        if (resetTimeoutRef.current !== null) {
          window.clearTimeout(resetTimeoutRef.current);
        }

        setCopyState("copied");
        resetTimeoutRef.current = window.setTimeout(() => {
          setCopyState("idle");
          resetTimeoutRef.current = null;
        }, 1600);
      })
      .catch(() => {
        setCopyState("failed");
      });
  };

  return (
    <div className={styles.root}>
      <code className={styles.value}>{value}</code>
      <button type="button" className={styles.button} onClick={handleCopy}>
        {copyState === "copied"
          ? "Copied"
          : copyState === "failed"
            ? "Copy failed"
            : "Copy"}
      </button>
    </div>
  );
}
