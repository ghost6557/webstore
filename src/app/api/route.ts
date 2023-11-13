import prisma from '@/utils/initPrisma';
import { NextResponse } from 'next/server';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  // const { data: phones, error } = await supabase.from('phone_desc').select('*');
  const phones = { test: 'Hello' };
  return NextResponse.json(phones);
}
