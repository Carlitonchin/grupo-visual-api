import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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

let payments: any[] = [
  {
    payment_method: "checkout",
    checkout: {
      customer_editable: true,
      skip_checkout_success_page: false,
      accepted_payment_methods: ["credit_card", "pix"],
      success_url: url_site,
      credit_card: {
        statement_descriptor: "Grupo Visual",
        operation_type: "auth_and_capture",
        installments: [],
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
      amount: Math.round(c.price * 100),
      description: c.text,
      quantity: cant,
      code: c.id + "",
    });
  }

  return items;
}

function createInstallMents(items: any[]): any[] {
  let installments = [];
  for (let i = 1; i <= 12; i++) {
    let inst = {
      number: i + "",
      total: 0,
    };

    for (let j = 0; j < items.length; j++) {
      let c = courses.find((x) => x.id == Number(items[j].code));
      if (!c) {
        throw new Error("curso no encontrado");
      }

      let price = Number(items[j].amount);
      const freeTax = c.freeTax || 1;
      if (i > freeTax) {
        const taxes = Math.round(price * (c.taxes / 100)) * (i - freeTax);
        price += taxes;
      }

      inst.total += price;
    }

    installments.push(inst);
  }

  return installments;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let items = createItems(body);
    const installments = createInstallMents(items);
    payments[0].checkout.credit_card.installments = installments;

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

    const resp = await axios.get(getUrl, { headers });
    return OkResponse(resp.data);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function OPTIONS() {
  return OkResponse({});
}
