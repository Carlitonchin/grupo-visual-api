import type { NextRequest } from "next/server";
import ContactEmailTemplate from "@/app/email-templates/contact-email-template";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { OkResponse } from "../utils";
import BuyTemplate from "@/app/email-templates/buy-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const myEmail = process.env.EMAIL_RECEIVE || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await resend.emails.send({
      from: "Grupo Visual <onboarding@resend.dev>",
      to: [body.data.customer.email],
      subject: "Notificação de Compra",
      react: BuyTemplate(body.data.items),
    });

    return OkResponse(data);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function OPTIONS() {
  return OkResponse({});
}
