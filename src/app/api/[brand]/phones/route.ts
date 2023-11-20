// import supabase from '@/utils/supabase';
import prisma from '@/utils/initPrisma';
import { NextResponse, NextRequest } from 'next/server';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(
  req: NextRequest,
  { params }: { params: { brand: string } }
) {
  const { brand } = params;
  const page: number = parseInt(
    req.nextUrl?.searchParams?.get('page') as string
  );

  const limit = 9;

  const getValList = (s: string) =>
    s
      .split(',')
      .map((el) => String(`'${el}'`))
      .join(',');

  const getRangeFilters = (f: any, type: string) => {
    let res: string = '';
    const filter: any = f?.split(',');
    if (filter) {
      for (let i = 0; i < filter.length; i += 2) {
        const [rv1, rv2] = filter.slice(i, i + 2);
        if (type === 'display') {
          res += `(to_number(substring(pd.display,1,3), '9.9') between ${rv1} and ${rv2}) or `;
        } else if (type === 'battery') {
          res += `(pd.battery between ${rv1} and ${rv2}) or `;
        }
      }
    }
    return res.slice(0, -4);
  };

  const getFiltersSqlString = (pars: any) => {
    let res: string = '';
    for (const [key, value] of Object.entries(pars)) {
      if (value) {
        res += value;
      }
    }
    return res;
  };

  const filtersValues = {
    brand: brand !== 'all' ? brand : req.nextUrl?.searchParams?.get('brand'),
    rom: req.nextUrl?.searchParams?.get('rom'),
    display: req.nextUrl?.searchParams.get('display'),
    battery: req.nextUrl?.searchParams.get('battery'),
  };

  const filtersTemplate = {
    brand: filtersValues?.brand
      ? `and pm.brand in (${getValList(filtersValues?.brand)}) `
      : '',
    rom: filtersValues?.rom
      ? `and msp.storage in (${getValList(filtersValues?.rom)}) `
      : '',
    display: filtersValues?.display
      ? `and (${getRangeFilters(filtersValues?.display, 'display')})`
      : '',
    battery: filtersValues?.battery
      ? `and (${getRangeFilters(filtersValues?.battery, 'battery')})`
      : '',
  };

  const data: any = await prisma.$queryRawUnsafe(`select count(1) cnt
                                                  from phone_desc pd
                                                    join phone_models pm on pd.m_id = pm.m_id
                                                    join model_storage_price msp on msp.m_id = pm.m_id
                                                  where 1 = 1                                       
                                                ${getFiltersSqlString(
                                                  filtersTemplate
                                                )}`);

  const totalCount = parseInt(data[0].cnt);
  const totalPages = Math.ceil(totalCount / limit);

  const phones = await prisma.$queryRawUnsafe(`select pd.*
                                                     ,pm.model_name
                                                     ,pm.brand
                                                     ,msp.msp_id
                                                     ,msp.storage rom
                                                     ,msp.price
                                               from phone_desc pd
                                                 join phone_models pm on pd.m_id = pm.m_id
                                                 join model_storage_price msp on msp.m_id = pm.m_id
                                               where 1 = 1          
                                               ${getFiltersSqlString(
                                                 filtersTemplate
                                               )}
                                               order by msp.msp_id asc
                                               limit ${limit} 
                                               offset ${
                                                 page === 1
                                                   ? 0
                                                   : (page - 1) * limit
                                               }`);

  return NextResponse.json({ phones, totalPages });
}
