import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#232323",
          borderRadius: 34,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
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
    ),
    { ...size },
  );
}
