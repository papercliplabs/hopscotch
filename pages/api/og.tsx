import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import { colors } from "@/theme/colors";

export const config = {
    runtime: "edge",
};

// Make sure the font exists in the specified path:
const font = fetch(new URL("../../public/static/fonts/Inter-Bold.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
);

export default async function handler(req: NextRequest) {
    const fontData = await font;

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const background = searchParams.get("background");

    try {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: colors.primary,
                        gap: "12px",
                        fontSize: "32px",
                        color: "white",
                        fontWeight: "700",
                        fontFamily: "Inter",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            padding: "48px",
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                            }}
                        >
                            <svg
                                width="100px"
                                height="100px"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21.2256 4.00098C23.4143 3.90114 21.9553 11.4735 20.444 15.409C22.3201 12.8019 27.2785 6.17264 29.251 7.53795C32.6382 9.88261 25.1514 15.7743 21.903 18.9957C26.2458 17.1359 35.0877 13.4163 35.9214 16.3555C37.2397 21.0032 21.5384 21.3371 21.5384 21.3371C21.5384 21.3371 32.899 25.3224 29.5115 29.6067C26.4435 33.4868 22.5459 25.9036 20.8089 22.5825C21.6426 27.8133 20.6004 36.4315 17.5779 35.9832C14.6397 35.5473 15.8758 28.5078 16.9452 25.2905C15.878 28.0049 12.3387 32.3732 10.1256 31.151C8.06762 30.0145 13.235 24.2265 15.858 21.5364C12.2623 23.5124 4.37723 28.1911 4.02852 25.4221C3.35097 20.0419 14.9722 19.195 14.9722 19.195C14.9722 19.195 6.36073 16.1919 8.82294 13.9643C11.7412 11.324 15.4586 15.7245 17.5779 17.7503C16.1187 14.5621 17.3173 4.34969 21.2256 4.00098Z"
                                    fill="#FFFFFF"
                                />
                            </svg>
                            <div style={{ paddingLeft: "10px", fontSize: "60px", margin: "auto" }}>Hopscotch</div>
                        </div>
                    </div>
                    <div
                        style={{
                            height: "40vh",
                            width: "40vh",
                            background: background ?? "linear-gradient(45deg,#fffff,#00000)",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "100% 100%",
                            borderRadius: "100%",
                            display: "flex",
                            paddingBottom: 0,
                            marginBottom: 0,
                            border: "8px solid white",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            paddingBottom: "70px",
                            fontSize: "60px",
                        }}
                    >
                        {name}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: "Inter",
                        data: fontData,
                        style: "normal",
                    },
                ],
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
