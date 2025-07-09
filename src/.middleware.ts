import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';


export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role;
    if (!isLoggedIn && (nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/admin'))) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }
    if (nextUrl.pathname.startsWith('/user') && role !== 'user') {
        return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }
    return NextResponse.next();
})

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"]
}

