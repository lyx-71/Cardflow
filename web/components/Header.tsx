"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  isAuthPage?: boolean; 
}

export function Header({ isAuthPage = false }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: "POST", credentials: "include" });
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <span className="font-bold text-lg hidden md:block text-gray-900 dark:text-white">CardFlow</span>
          </div>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Главная</a>
            {!isAuthPage && (
              <>
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Возможности</a>
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Тарифы</a>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthPage ? (
            <>
              <button onClick={() => router.push("/login")} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Войти
              </button>
              <Button onClick={() => router.push("/register")} className="px-6 rounded-lg">
                Начать бесплатно
              </Button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/profile")} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Личный кабинет
              </button>
              <Button onClick={handleLogout} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-lg">
                Выйти
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}