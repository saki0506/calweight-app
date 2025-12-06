import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkProfileSetup } from "@/lib/profile";

export async function middleware(request: NextRequest) {
  // セッション更新
  let response = await updateSession(request);

  // /profile-setup へのアクセスをチェック
  if (request.nextUrl.pathname === "/profile-setup") {
    // Supabase クライアント作成
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // ユーザーの認証確認
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // 認証されていない場合はログインページへリダイレクト
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // プロフィール設定完了か確認
    const profileCheck = await checkProfileSetup(user.id);

    if (profileCheck.isComplete) {
      // プロフィール設定済みの場合はダッシュボードへリダイレクト
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};