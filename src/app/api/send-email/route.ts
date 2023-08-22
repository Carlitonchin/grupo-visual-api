import type { NextRequest } from "next/server";
import ContactEmailTemplate from "@/app/email-templates/contact-email-template";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const myEmail = process.env.EMAIL_RECEIVE;

export async function POST(req: NextRequest) {
  try {
    const { age, city, course, email, message, name, phone, state } =
      await req.json();
    const data = await resend.emails.send({
      from: "Mensagem de Contato Site <onboarding@resend.dev>",
      to: [myEmail],
      subject: "Contato Site",
      react: ContactEmailTemplate({
        age: age || "",
        city: city || "",
        course: course || "",
        email: email || "",
        message: message || "",
        name: name || "",
        phone: phone || "",
        state: state || "",
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error();
  }
}
