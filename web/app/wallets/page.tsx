"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type WalletData = {
  id: string;
  currency: string;
  balance: number;
};

export default function WalletsPage() {
  const router = useRouter();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);

  const fetchWallets = async () => {
    const res = await fetch("http://localhost:3000/wallet", { credentials: "include" });
    if (res.ok) setWallets(await res.json());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleAction = async (type: "deposit" | "withdraw") => {
    if (!selectedWallet || !amount) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return alert("Неверная сумма");

    try {
      const res = await fetch(`http://localhost:3000/wallet/${selectedWallet.id}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: numAmount }),
      });

      if (res.ok) {
        alert("Успешно!");
        setAmount("");
        setSelectedWallet(null);
        fetchWallets();
      } else {
        const err = await res.json();
        alert(err.message || "Ошибка");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateWallet = async (currency: string) => {
    const res = await fetch("http://localhost:3000/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currency }),
    });

    if (res.ok) fetchWallets();
    else alert("Ошибка создания кошелька");
  };

  if (isLoading) return <div className="p-10 text-center">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-6">
          ← Назад в профиль
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои кошельки</h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap gap-4">
          <Button onClick={() => handleCreateWallet("USD")} className="bg-blue-600 hover:bg-blue-700">+ Кошелек USD</Button>
          <Button onClick={() => handleCreateWallet("EUR")} className="bg-blue-600 hover:bg-blue-700">+ Кошелек EUR</Button>
          <Button onClick={() => handleCreateWallet("RUB")} className="bg-blue-600 hover:bg-blue-700">+ Кошелек RUB</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wallets.map((w) => (
            <div key={w.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-gray-800">{w.currency}</span>
                <span className="text-3xl font-extrabold text-blue-600">{Number(w.balance).toFixed(2)}</span>
              </div>
              
              {selectedWallet?.id === w.id ? (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <input 
                    type="number" 
                    placeholder="Введите сумму" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <div className="flex gap-3">
                    <Button onClick={() => handleAction("deposit")} className="flex-1 bg-green-600 hover:bg-green-700 py-6 text-base">Пополнить</Button>
                    <Button onClick={() => handleAction("withdraw")} className="flex-1 bg-red-600 hover:bg-red-700 py-6 text-base">Вывести</Button>
                  </div>
                  <button 
                    onClick={() => { setSelectedWallet(null); setAmount(""); }} 
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-800 transition-colors pt-2"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <Button onClick={() => setSelectedWallet(w)} className="w-full py-6 text-base" variant="outline">
                  Пополнить / Вывести
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}