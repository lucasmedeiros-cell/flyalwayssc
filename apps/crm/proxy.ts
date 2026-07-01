import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "fa_crm_session";

/**
 * Protección de rutas a nivel edge (convención `proxy` de Next 16): sin sesión
 * → redirige a /login. El layout del grupo (app) re-valida la sesión en el
 * servidor (defensa en profundidad). En Fase 9 aquí se verificará el JWT.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  // /login siempre se renderiza. NO redirigimos por mera presencia de cookie:
  // una cookie inválida (p. ej. sesión vieja del modo mock) provocaría un bucle
  // /login → / → /login. La propia página de login valida la sesión y redirige
  // al dashboard sólo si es realmente válida.
  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Excluye API de auth, internals de Next y CUALQUIER archivo estático
  // (rutas con extensión: .png, .ico, .css, …) como el logo en /brand.
  matcher: ["/((?!api/auth|_next/static|_next/image|.*\\..*).*)"],
};
