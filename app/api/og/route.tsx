import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const shopName = decodeURIComponent(searchParams.get("shopName") || "");
  const location = decodeURIComponent(searchParams.get("location") || "");
  const tagline = searchParams.get("tagline") || "";
  const additionalInfo = searchParams.get("additionalInfo") || "";

  // Updated gradient colors to match the landing page
  const color1 = "#fff1be"; // Light yellow
  const color2 = "#FEAF4E"; // Orange
  const color3 = "#F96E46"; // Coral

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(145deg, ${color1} 28%, ${color2} 70%, ${color3} 100%)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "whitesmoke",
            opacity: "0.8",
            borderRadius: "24px",
            padding: "40px 60px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            maxWidth: "85%",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: color3, // Using the deep charcoal for the shop name
              marginBottom: "16px",
              textAlign: "center",
              wordWrap: "break-word",
            }}
          >
            {shopName}
          </div>

          <div
            style={{
              fontSize: "36px",
              color: color3, // Using the deep charcoal for the location
              textAlign: "center",
              wordWrap: "break-word",
              marginBottom: "16px",
            }}
          >
            {location}
          </div>

          <div
            style={{
              fontSize: "28px",
              color: color3, // Using the deep charcoal for the tagline
              textAlign: "center",
              wordWrap: "break-word",
              fontStyle: "italic",
              marginBottom: "24px",
            }}
          >
            {tagline}
          </div>

          <div
            style={{
              fontSize: "24px",
              color: color3, // Using the deep charcoal for the additional info
              textAlign: "center",
              wordWrap: "break-word",
              marginTop: "16px",
            }}
          >
            {additionalInfo}
          </div>
        </div>
        <div
          style={{
            marginTop: "24px",
            fontSize: "24px",
            color: color1, // Using the warm orange for the footer
          }}
        >
          Discover more at local-boards.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
