import prisma from '@/utils/initPrisma';
import { hash } from 'bcryptjs';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Register route');

    const { name, email, password } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
    };

    const hashedPassword = await hash(password, 12);
    const isUserExists = await prisma.user.findFirst({ where: { email } });

    if (isUserExists)
      throw new Error('Пользователь с таким email уже зарегистрирован');

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    console.log(user);

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
