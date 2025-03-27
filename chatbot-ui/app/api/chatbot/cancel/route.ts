import { NextResponse } from 'next/server';

const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/chatbot/cancel`;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { cookie } = requestBody;

    if (!cookie) {
      console.log('Cookie missing in request');
      return NextResponse.json(
        { error: 'chatId is required' },
        { status: 400 },
      );
    }

    const headers = {
      Cookie: cookie,
      'Content-Type': 'application/json',
      cache: 'no-store',
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
    });

    const contentType = response.headers.get('content-type');
    let responseData;

    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      // JSON이 아닌 경우 텍스트로 읽기
      const textData = await response.text();
      responseData = { message: textData };
    }

    return NextResponse.json(
      { message: 'Chat cancelled successfully' },
      { status: 200 },
    );
  } catch (error) {
    // console.error('Error cancelling chat:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
