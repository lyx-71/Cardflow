"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Неверный email или пароль");
      
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <Header isAuthPage={true} />
      
      <div className="flex items-center justify-center pt-20 pb-10 px-4">
        <Card className="w-[400px] bg-white dark:bg-[#12121a] border-gray-100 dark:border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
              Вход в CardFlow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="bg-white dark:bg-[#0a0a0f] border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Пароль</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="bg-white dark:bg-[#0a0a0f] border-gray-300 dark:border-gray-700"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full rounded-lg">Войти</Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#12121a] px-2 text-gray-500 dark:text-gray-400">Или</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              onClick={() => router.push('/register')}
            >
              Создать новый аккаунт
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}