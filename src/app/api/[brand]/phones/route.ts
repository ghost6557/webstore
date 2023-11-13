// import supabase from '@/utils/supabase';
import prisma from '@/utils/initPrisma';
import { Prisma } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(
  req: NextRequest,
  { params }: { params: { brand: string } }
) {
  // const { data: phones, error } = await supabase.from('phone_desc').select('*');
  // console.log(params.brand);
  const { brand } = params;
  console.log(params);

  // const phones: any = await prisma['phone_desc'].findMany({
  //   include: {
  //     ['phone_models']: {
  //       select: { model_name: true, brand: true },
  //       where: { brand: params.brand },
  //     },
  //     ['model_storage_price']: {
  //       select: { msp_id: true, storage: true, price: true },
  //     },
  //   },
  // });

  // const phones: any = await prisma.phone_desc.findMany({
  //   select: {
  //     pd_id: true,
  //     m_id: true,
  //     desc: true,
  //     year: true,
  //     display: true,
  //     resolution: true,
  //     processor: true,
  //     main_camera: true,
  //     front_camera: true,
  //     battery: true,
  //     face_id: true,
  //     os: true,
  //     img_url: true,
  //     phone_models: { }
  //   },
  // });

  // console.log('search pars ' + req.nextUrl?.searchParams);
  console.log('disp ' + req.nextUrl?.searchParams.get('display')?.split(','));

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
    console.log(res);
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

  //  pm.brand = ${params.brand};
  const totalCount = parseInt(data[0].cnt);
  // console.log('totalCount', parseInt(totalCount));
  const totalPages = Math.ceil(totalCount / limit);
  console.log(totalPages);

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

// console.log(getFilters(filtersTemplate));
// const realFilters = `${
//   filtersValues?.brand
//     ? Prisma.sql`and pm.brand in (${Prisma.join(
//         filtersValues?.brand?.split(',')
//       )}) `
//     : Prisma.empty
// } ${
//   filtersValues?.rom
//     ? Prisma.sql`and msp.storage in (${Prisma.join(
//         filtersValues?.rom?.split(',')
//       )}) `
//     : Prisma.empty
// }`;
// console.log(fq2);

// const test: any = await prisma.$queryRaw`select count(1) cnt
//                                          from phone_desc pd
//                                            join phone_models pm on pd.m_id = pm.m_id
//                                            join model_storage_price msp on msp.m_id = pm.m_id
//                                          where 1 = 1
//                                          ${
//                                            (realFilters.brand,
//                                            realFilters.rom)
//                                          }
//                                         `;
// console.log('test ' + test[0].cnt);

// order by msp.msp_id asc
// ${Prisma.sql`limit ${limit} offset ${
//   page === 1 ? 0 : (page - 1) * limit
// }`}`);

// ${realFilters.brand}
// ${realFilters.rom}
// ${realFilters.display}

// ${realFilters.display}

// ${Prisma.sql`${
//   filtersValues.rom
//     ? 'and msp.storage in (' +
//       filtersValues.rom +
//       ')'
//     : Prisma.empty
// }`}

// console.log(JSON.parse(req.nextUrl?.searchParams?.get('filtersValues').brand));
// console.log(filtersValues?.brand);

// const filtersValues = JSON.parse(
//   req.nextUrl?.searchParams?.get('filtersValues') as string
// );
// console.log(filtersValues.brand);

// console.log('page ' + filtersValues.page);
// const filtersQuery = filtersValues.rom ? "and msp.storage in ('1TB', '256GB')" : '';

// console.log('filtersQuery ' + filtersQuery);

// const filtersQuery = filtersValues?.rom
//   ? Prisma.sql`and msp.storage in (${Prisma.join(
//       filtersValues?.rom?.split(',')
//     )})`
//   : Prisma.empty;

// const fq2 = filtersValues?.rom
//   ? `and msp.storage in (${Prisma.join(filtersValues?.rom?.split(','))})`
//   : '';
