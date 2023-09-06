import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { OkResponse } from "../utils";
import axios from "axios";
import { courses } from "../data";

const url_pagarme = process.env.PAGARME_URL || "";
const key = process.env.PAGARME_KEY || "";
const url_site = process.env.URL_SITE || "";

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
      accepted_payment_methods: ["credit_card", "pix"],
      success_url: url_site + "obrigado",
      credit_card: {
        statement_descriptor: "Grupo Visual",
        operation_type: "auth_and_capture",
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
      code: c.id + "",
    });
  }

  return items;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let items = createItems(body);
    const resp = await axios.post(
      url_pagarme,
      { items, payments, customer: body.customer },
      { headers: headers }
    );

    return OkResponse(resp.data);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const getUrl = url_pagarme + "/" + searchParams.get("order");
    console.log(getUrl);
    const resp = await axios.get(getUrl, { headers });
    return OkResponse(resp.data);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function OPTIONS() {
  return OkResponse({});
}
