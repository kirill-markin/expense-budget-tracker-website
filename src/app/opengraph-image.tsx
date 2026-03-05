import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#232323",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="512" height="512" rx="96" fill="#404040" />
            <path
              d="M256 80v352"
              stroke="#fff"
              strokeWidth="40"
              strokeLinecap="round"
            />
            <path
              d="M336 176c0-44-36-72-80-72s-80 28-80 72c0 48 40 64 80 80s80 32 80 80c0 44-36 72-80 72s-80-28-80-72"
              stroke="#fff"
              strokeWidth="40"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Expense Budget Tracker
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#898989",
          }}
        >
          Open Source Personal Finance
        </div>
      </div>
    ),
    { ...size },
  );
}
