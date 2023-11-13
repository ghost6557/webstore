// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/auth';
import { Prisma } from '@prisma/client';
import prismaClient from '@/utils/initPrisma';
import { NextResponse, NextRequest } from 'next/server';

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
  // const { userId, product, cartAction }

  for await (const item of data) {
    // data.forEach((item) => {
    const { userId, product, cartAction } = item;

    // console.log('NEW', userId, product, cartAction);

    const { cart_details: existingCartData }: Prisma.JsonArray | any =
      await prismaClient['user_cart'].findFirst({
        select: { cart_details: true },
        where: { user_id: userId },
      });

    console.log('OLD', existingCartData);

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
        // cartAction === 'ADD' ? matchingObj.amount++ : matchingObj.amount--;
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

    // console.log(newCartData);

    // console.log(upsertCart);

    //   data: {
    //     email: email.toLowerCase(),
    //     password: hashedPassword,
    //   },
    // });
  }

  return NextResponse.json({});
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug[0];
  let data: any[] | any;
  // console.log('slug', slug);
  // const reqData = (await req.json()) as {
  //   userId: string;
  // };
  // console.log(reqData);

  const type = req.nextUrl?.searchParams?.get('type') as string;
  // console.log(type);

  if (type) {
    const unFormatData: any =
      await prismaClient.$queryRaw`select sum(amount) sum
                                   from "User_cart" uc,
                                        json_to_recordset(uc.cart_details)
                                        as product("modelVariantId" integer, amount integer)
                                   where 1 = 1
                                     and uc.user_id = ${slug}`;
    data = unFormatData[0]['sum'];
    console.log(data);
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
  // await prisma['user_cart'].findFirst({
  //   where: { user_id: slug },
  // });

  // console.log('cart', data);

  return NextResponse.json(data);
}

// newCartData = existingCartData.map(
//   (
//     product: { productId: string; amount: number },
//     idx: number,
//     array: any[]
//   ) => {
//     if (product.productId === data.product.productId) {
//       product.amount += data.product.amount;
//       return product;
//     } else {
//       console.log('NEW PROD');
//     }
//     // array.push(data.product);}
//   }
// );

// console.log(newCartData);

// if (existingCartData.productId === data.product.productId) {
//   console.log('RAVNI');
// }
// const newCartData = existingCartData?.cart_details as Prisma.JsonArray;
// console.log(typeof newCartData);
// console.log(newCartData[0]);
