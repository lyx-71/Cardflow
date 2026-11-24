"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";

export default function ProfilePage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("http://localhost:3000/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (res.ok) {
      setMessage("Пароль успешно изменен!");
      setOldPassword("");
      setNewPassword("");
    } else {
      const err = await res.json();
      setMessage(err.message || "Ошибка смены пароля");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <Header isAuthPage={false} />
      
      <div className="max-w-md mx-auto pt-10 px-4">
        <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-6 rounded-lg">
          ← Назад в профиль
        </Button>
        
        <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border">
          <h1 className="text-2xl font-bold mb-6">Смена пароля</h1>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label>Старый пароль</Label>
              <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            </div>
            <div>
              <Label>Новый пароль</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            {message && <p className={`text-sm ${message.includes("успешно") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
            <Button type="submit" className="w-full rounded-lg">Сменить пароль</Button>
          </form>
        </div>
      </div>
    </div>
  );
}