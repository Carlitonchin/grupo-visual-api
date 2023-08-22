import { NextResponse } from "next/server";

export const OkResponse = (data: any) => {
  return new NextResponse(data, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000/",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
