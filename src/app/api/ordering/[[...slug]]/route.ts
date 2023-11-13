// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/auth';
import { Prisma } from '@prisma/client';
import prismaClient from '@/utils/initPrisma';
import { NextResponse } from 'next/server';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

interface OrderDetails<T> {
  userId: T;
  itemsDetails: { msp_id: number; amount: number }[];
  totalSum: number;
  deliveryInfo: {
    deliveryAddress: T;
    apartment: T;
    entrance: T;
    floor: T;
    comment: T;
  };
}

export async function POST(req: Request) {
  const data = (await req.json()) as OrderDetails<string>;
  console.log(data);

  const { userId, itemsDetails, totalSum, deliveryInfo } = data;

  const insertedOrder = await prismaClient['user_orders'].create({
    data: {
      user_id: userId,
      entrance: BigInt(deliveryInfo.entrance),
      apartment: BigInt(deliveryInfo.apartment),
      floor: BigInt(deliveryInfo.floor),
      comment: deliveryInfo.comment,
      delivery_address: deliveryInfo.deliveryAddress,
      order_content: itemsDetails,
      //  as Prisma.JsonArray,
    },
  });

  return NextResponse.json({});
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug[0];
  // console.log('slug', slug);
  // const reqData = (await req.json()) as {
  //   userId: string;
  // };
  // console.log(reqData);

  const data: any[] | any = await prismaClient.$queryRaw`select * 
                                                         from (select uo.*
                                                                     ,product.msp_id         
                                                                     ,product.amount
                                                               from "user_orders" uo,
                                                                 jsonb_to_recordset(uo.order_content)
                                                                   as product(msp_id integer, amount integer)) t
                                                                 join model_storage_price msp on t.msp_id = msp.msp_id
                                                                 join phone_models pm on msp.m_id = pm.m_id
                                                                 join phone_desc pd on pm.m_id= pd.m_id
                                                         where 1 = 1 
                                                           and t.user_id = ${slug}
                                                         order by id desc`;

  // await prisma['user_cart'].findFirst({
  //   where: { user_id: slug },
  // });

  // console.log('cart', data);

  return NextResponse.json(data);
}
