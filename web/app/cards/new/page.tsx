"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Header } from "@/components/Header";

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка загрузки кошельков");

        const data = await res.json();
        setWallets(data);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header isAuthPage={false} />
        <div className="p-10 text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header isAuthPage={false} />

      <div className="flex items-center justify-center p-4 pt-10 pb-10">
        <Card className="w-full max-w-lg shadow-lg border border-border bg-card">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              Выпуск виртуальной карты
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Выберите кошелек, с которого будут списываться средства при оплате этой картой.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 mb-8">
              {wallets.length === 0 ? (
                <div className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-4 rounded-xl">
                  У вас нет кошельков. Сначала создайте кошелек на главной странице.
                </div>
              ) : (
                wallets.map((w) => {
                  const isSelected = selectedWallet === w.id;
                  const currencySymbol =
                    w.currency === "USD" ? "$" : w.currency === "EUR" ? "€" : "₽";

                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWallet(w.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/60"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {w.currency}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">Кошелек в {w.currency}</p>
                          <p className="text-sm text-muted-foreground">
                            Доступно: {currencySymbol}
                            {Number(w.balance).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-primary" : "border-border"
                        }`}
                      >
                        {isSelected && <div className="w-3 h-3 bg-primary rounded-full" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center mb-4">{error}</p>}

            <div className="space-y-3">
              <Button
                onClick={handleCreateCard}
                className="w-full py-6 text-lg rounded-xl"
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
    </div>
  );
}