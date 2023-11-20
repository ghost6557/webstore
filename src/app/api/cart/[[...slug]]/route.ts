import { NextResponse, NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';

import prismaClient from '@/utils/initPrisma';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

interface CartDetails {
  userId: string;
  product: { modelVariantId: number; amount?: number };
  cartAction: string;
}

export async function POST(req: Request) {
  let newCartData!: Prisma.JsonArray;
  const data = (await req.json()) as CartDetails[];

  for await (const item of data) {
    const { userId, product, cartAction } = item;
    const { cart_details: existingCartData }: Prisma.JsonArray | any =
      await prismaClient['user_cart'].findFirst({
        select: { cart_details: true },
        where: { user_id: userId },
      });

    if (existingCartData) {
      const matchingObj = existingCartData.find(
        (prod: { modelVariantId: number; amount: number }) =>
          prod.modelVariantId === product.modelVariantId
      );

      if (matchingObj) {
        switch (cartAction) {
          case 'ADD':
            matchingObj.amount++;
            break;
          case 'REMOVE':
            matchingObj.amount--;
            break;
          case 'DELETE':
            matchingObj.amount = 0;
            break;
        }
      } else if (!matchingObj && cartAction === 'ADD') {
        existingCartData.push(product);
      }
      newCartData = existingCartData;
    } else if (cartAction === 'ADD') {
      newCartData = [product];
    }

    newCartData = newCartData.filter((cart: any): boolean => cart.amount > 0);

    const upsertCart = await prismaClient['user_cart'].upsert({
      where: {
        user_id: userId,
      },
      update: {
        cart_details: newCartData,
      },
      create: {
        user_id: userId,
        cart_details: newCartData,
      },
    });
  }

  return NextResponse.json({});
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug[0];
  let data: any[] | any;
  const type = req.nextUrl?.searchParams?.get('type') as string;

  if (type) {
    const unFormatData: any =
      await prismaClient.$queryRaw`select sum(amount) sum
                                   from "User_cart" uc,
                                        json_to_recordset(uc.cart_details)
                                        as product("modelVariantId" integer, amount integer)
                                   where 1 = 1
                                     and uc.user_id = ${slug}`;
    data = unFormatData[0]['sum'];
  } else {
    data = await prismaClient.$queryRaw`select * 
                                        from (select uc.*
                                                    ,product."modelVariantId" modelVariantId         
                                                    ,product.amount
                                              from "User_cart" uc,
                                                json_to_recordset(uc.cart_details)
                                                as product("modelVariantId" integer, amount integer)) t
                                          join model_storage_price msp on t.modelVariantId = msp.msp_id
                                          join phone_models pm on msp.m_id = pm.m_id
                                          join phone_desc pd on pm.m_id= pd.m_id
                                        where 1 = 1 
                                          and t.user_id = ${slug}`;
  }

  return NextResponse.json(data);
}
