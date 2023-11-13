import prisma from '@/utils/initPrisma';
import { NextResponse } from 'next/server';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(
  req: Request,
  { params }: { params: { brand: string; id: string } }
) {
  console.log(params);
  //   const slug = params.slug;
  const { brand, id } = params;
  const data = await prisma.$queryRaw`select pd.*
                                            ,pm.model_name
                                            ,pm.brand
                                            ,(select jsonb_agg(jsonb_build_object('rom', msp.storage, 'price', msp.price, 'msp_id', msp.msp_id))
                                              from model_storage_price msp
                                              where msp.m_id = pm.m_id) rom_price
                                      from phone_desc pd
                                      join phone_models pm on pd.m_id = pm.m_id
                                      where 1 = 1
                                        and pm.brand = ${brand}
                                        and pm.m_id = ${BigInt(id)}`;

  return NextResponse.json(data);
}
