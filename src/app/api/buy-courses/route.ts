import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { OkResponse } from "../utils";
import axios from "axios";
import { addDays } from "date-fns";
import { courses } from "../data";

const url = process.env.PAGARME_URL || "";
const key = process.env.PAGARME_KEY || "";

const headers = {
  accept: "application/json",
  "content-type": "application/json",
  authorization: "Basic " + Buffer.from(`${key}:`).toString("base64"),
};

let payments = [
  {
    payment_method: "checkout",
    checkout: {
      customer_editable: true,
      skip_checkout_success_page: false,
      accepted_payment_methods: ["credit_card", "boleto", "pix"],
      success_url: "https://www.pagar.me",
      boleto: {
        bank: "033",
        instructions: "Pagar até o vencimento",
        due_at: "2023-12-25T00:00:00Z",
      },
      credit_card: {
        capture: true,
        statement_descriptor: "Curso Grupo Visual",
      },
      pix: {
        expires_in: 100000,
      },
    },
  },
];

function createItems(body: any) {
  let items = [];
  for (let i = 0; i < body.courses.length; i++) {
    let courseReq = body.courses[i].item;
    let cant = body.courses[i].cant;
    let c = courses.find((x) => x.id == courseReq.id);
    if (!c) {
      throw new Error("curso no encontrado");
    }
    items.push({
      amount: c.price * 100,
      description: c.text,
      quantity: cant,
    });
  }

  return items;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const today = new Date();
    const futureDate = addDays(today, 10);
    payments[0].checkout.boleto.due_at = futureDate.toISOString();
    let items = createItems(body);

    const resp = await axios.post(
      url,
      { items, payments, customer: body.customer },
      { headers: headers }
    );

    return OkResponse(resp.data);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function OPTIONS() {
  return OkResponse({});
}
