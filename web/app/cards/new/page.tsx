"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type WalletData = {
  id: string;
  currency: string;
  balance: number;
};

export default function NewCardPage() {
  const router = useRouter();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await fetch("http://localhost:3000/wallet", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка загрузки кошельков");
        
        const data = await res.json();
        setWallets(data);
        
        // Автовыбор первого кошелька
        if (data.length > 0) {
          setSelectedWallet(data[0].id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const handleCreateCard = async () => {
    if (!selectedWallet) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ walletId: selectedWallet }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ошибка при выпуске карты");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center font-sans">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Выпуск виртуальной карты</CardTitle>
          <CardDescription className="text-gray-500">
            Выберите кошелек, с которого будут списываться средства при оплате этой картой.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          
          
          <div className="space-y-4 mb-8">
            {wallets.length === 0 ? (
              <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl">
                У вас нет кошельков. Сначала создайте кошелек на главной странице.
              </div>
            ) : (
              wallets.map((w) => {
                const isSelected = selectedWallet === w.id;
                const currencySymbol = w.currency === "USD" ? "$" : w.currency === "EUR" ? "€" : "₽";
                
                return (
                  <div 
                    key={w.id}
                    onClick={() => setSelectedWallet(w.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                      isSelected 
                        ? "border-blue-600 bg-blue-50 shadow-sm" 
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {w.currency}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Кошелек в {w.currency}</p>
                        <p className="text-sm text-gray-500">Доступно: {currencySymbol}{Number(w.balance).toFixed(2)}</p>
                      </div>
                    </div>
                   

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-blue-600" : "border-gray-300"
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <div className="space-y-3">
            <Button 
              onClick={handleCreateCard}
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg rounded-xl"
              disabled={isSubmitting || wallets.length === 0}
            >
              {isSubmitting ? "Выпускаем..." : "Выпустить карту"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full py-6 text-lg rounded-xl"
              onClick={() => router.push("/dashboard")}
            >
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}