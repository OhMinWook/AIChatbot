import { NextRequest } from 'next/server';

// NextRequest 타입 확장
declare module 'next/server' {
  interface NextRequest {
    auth?: any;
  }
}
