"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type WalletData = {
  id: string;
  currency: string;
  balance: number;
};

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const serviceName = searchParams.get("service") || "ChatGPT Plus";
  const serviceAmount = Number(searchParams.get("amount")) || 20;
  const targetCurrency = searchParams.get("currency") || "USD";

  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);

  const rates: Record<string, number> = {
    'USD_USD': 1, 'EUR_EUR': 1, 'RUB_RUB': 1,
    'USD_RUB': 95.0, 'EUR_RUB': 105.0,
    'USD_EUR': 0.92, 'EUR_USD': 1.08,
    'RUB_USD': 1 / 95.0, 'RUB_EUR': 1 / 105.0,
  };

  useEffect(() => {
    const fetchWallets = async () => {
      const res = await fetch("http://localhost:3000/wallet", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setWallets(data);
        if (data.length > 0) {
          const matched = data.find((w: WalletData) => w.currency === targetCurrency);
          setSelectedWallet(matched || data[0]);
        }
      }
      setIsLoading(false);
    };
    fetchWallets();
  }, [targetCurrency]);

  const handlePay = async () => {
    if (!selectedWallet) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:3000/cards/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          walletId: selectedWallet.id, 
          amount: serviceAmount, 
          service: serviceName,
          targetCurrency: targetCurrency
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: `Успешно оплачено! Списано ${data.deducted.toFixed(2)} ${data.currency}` });
        setWallets(prev => prev.map(w => w.id === selectedWallet.id ? {...w, balance: Number(w.balance) - data.deducted} : w));
      } else {
        setResult({ success: false, message: data.message || "Ошибка оплаты" });
      }
    } catch (e) {
      setResult({ success: false, message: "Ошибка сети" });
    } finally {
      setIsLoading(false);
    }
  };

  let finalAmount = serviceAmount;
  let canPay = false;
  
  if (selectedWallet) {
    const rateKey = `${targetCurrency}_${selectedWallet.currency}`;
    const rate = rates[rateKey];
    if (rate !== undefined) {
      finalAmount = serviceAmount * rate;
      canPay = Number(selectedWallet.balance) >= finalAmount;
    }
  }

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
      <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-6">
        ← Назад
      </Button>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Оплата: {serviceName}</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">С какого кошелька списать?</label>
          <div className="space-y-2">
            {wallets.map(w => (
              <div 
                key={w.id}
                onClick={() => setSelectedWallet(w)}
                className={`p-3 border rounded-xl cursor-pointer flex justify-between items-center ${
                  selectedWallet?.id === w.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedWallet?.id === w.id ? 'border-blue-600' : 'border-gray-300'}`}>
                    {selectedWallet?.id === w.id && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </div>
                  <span className="font-bold">{w.currency}</span>
                  <span className="text-gray-500 text-sm">{Number(w.balance).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mt-4">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Цена сервиса:</span>
            <span>{targetCurrency === 'USD' ? '$' : '€'}{serviceAmount}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
            <span>К списанию:</span>
            <span className={!canPay ? 'text-red-500' : ''}>
              {finalAmount.toFixed(2)} {selectedWallet?.currency}
            </span>
          </div>
          {selectedWallet?.currency !== targetCurrency && (
            <p className="text-xs text-gray-500 mt-2 text-right">С учетом конвертации</p>
          )}
          {!canPay && selectedWallet && (
            <p className="text-sm text-red-500 font-medium mt-2 text-center bg-red-50 p-2 rounded">
              Недостаточно средств на этом кошельке
            </p>
          )}
        </div>

        <Button 
          onClick={handlePay} 
          disabled={isLoading || !canPay}
          className={`w-full py-6 text-lg rounded-xl mt-4 ${canPay ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isLoading ? "Обработка..." : "Оплатить"}
        </Button>

        {result && (
          <div className={`p-4 rounded-xl text-center font-medium ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8 flex items-center justify-center">
      <Suspense fallback={<div>Загрузка...</div>}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}