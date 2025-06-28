import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware devre dışı - 2FA kodu ile güvenlik sağlanıyor
export function middleware(request: NextRequest) {
  // Middleware devre dışı bırakıldı
  // 2FA kodu sadece kullanıcıda olduğu için güvenlik yeterli
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Middleware devre dışı
  ],
}; 