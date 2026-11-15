"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardItem, CardData } from "@/components/CardItem";
import { Button } from "@/components/ui/button";

type WalletData = {
  id: string;
  currency: string;
  balance: number;
};

type UserData = {
  userId: string;
  email: string;
  name: string;
};

type TransactionData = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<CardData[]>([]);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [activeCurrency, setActiveCurrency] = useState<string>("ALL");

  const fetchDashboardData = async () => {
    try {
      const authRes = await fetch("http://localhost:3000/auth/me", {
        credentials: "include",
      });
      if (!authRes.ok) throw new Error("Не авторизован");
      
      const userData = await authRes.json();
      setUser(userData);

      const cardsRes = await fetch("http://localhost:3000/cards", {
        credentials: "include",
      });
      if (cardsRes.ok) {
        const cardsData = await cardsRes.json();
        setCards(cardsData);
      }

      const walletsRes = await fetch("http://localhost:3000/wallet", {
        credentials: "include",
      });
      if (walletsRes.ok) {
        const walletsData = await walletsRes.json();
        setWallets(walletsData);
      }

      const txRes = await fetch("http://localhost:3000/transactions", {
        credentials: "include",
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return <div className="p-10 text-center text-xl font-sans">Загрузка данных...</div>;
  }

  const currentWallet = wallets.find((w) => w.currency === activeCurrency) || wallets[0];
  const totalBalance = currentWallet ? Number(currentWallet.balance) : 0;
  const userInitial = user?.name ? user.name[0].toUpperCase() : "U";
  
  const getCurrencySymbol = (currency: string) => {
    if (currency === "USD") return "$";
    if (currency === "EUR") return "€";
    if (currency === "RUB") return "₽";
    return currency;
  };

  const popularServices = [
    { name: "ChatGPT Plus", price: 20, currency: "USD", icon: "/icons/chatgpt-icon.webp" },
    { name: "Netflix", price: 15, currency: "USD", icon: "/icons/netflix-icon.png" },
    { name: "PS Plus", price: 10, currency: "USD", icon: "/icons/sony-icon.webp" },
    { name: "YouTube Premium", price: 12, currency: "EUR", icon: "/icons/youtube-icon.webp" },
    { name: "Spotify", price: 11, currency: "EUR", icon: "/icons/spotify-icon.jpg" },
    { name: "Amazon", price: 50, currency: "USD", icon: "/icons/amazon-icon.webp" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">CardFlow</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span 
              className="text-sm text-gray-900 font-semibold cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => router.push('/profile')}
            >
              {user?.name || "Пользователь"}
            </span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
          
          <div 
            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors"
            onClick={() => router.push('/profile')}
          >
            {userInitial}
          </div>

          <div className="flex gap-2 ml-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/profile')}>
              Профиль
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={async () => {
                await fetch('http://localhost:3000/auth/logout', { method: 'POST', credentials: 'include' });
                router.push('/login');
              }}
            >
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Добро пожаловать, {user?.name || "Пользователь"}!
          </h1>
          <p className="text-gray-500 mt-1">Управляйте своими картами и финансами здесь.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {wallets.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
                  💳
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">У вас пока нет кошелька</h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                  Создайте свой первый кошелек в долларах (USD), чтобы начать пользоваться сервисом и выпускать карты.
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg"
                  onClick={async () => {
                    try {
                      await fetch("http://localhost:3000/wallet", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ currency: "USD" }),
                      });
                      fetchDashboardData();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  Создать кошелек USD
                </Button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg flex flex-col justify-between">
                <div className="mb-8">
                  <p className="text-blue-100 text-sm font-medium mb-2">
                    {activeCurrency === "ALL" ? "Все кошельки" : "Баланс кошелька"}
                  </p>
                  
                  {activeCurrency === "ALL" ? (
                    <div className="space-y-1">
                      {wallets.map(w => (
                        <h2 key={w.id} className="text-4xl font-extrabold tracking-tight">
                          {getCurrencySymbol(w.currency)}{Number(w.balance).toFixed(2)}
                        </h2>
                      ))}
                    </div>
                  ) : (
                    <h2 className="text-5xl font-extrabold tracking-tight">
                      {getCurrencySymbol(activeCurrency)}{totalBalance.toFixed(2)}
                    </h2>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCurrency("ALL")}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeCurrency === "ALL"
                          ? "bg-white text-blue-700 shadow-sm"
                          : "bg-blue-700/50 text-blue-100 hover:bg-blue-700"
                      }`}
                    >
                      Все
                    </button>
                    
                    {wallets.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setActiveCurrency(w.currency)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                          activeCurrency === w.currency
                            ? "bg-white text-blue-700 shadow-sm"
                            : "bg-blue-700/50 text-blue-100 hover:bg-blue-700"
                        }`}
                      >
                        {w.currency}
                      </button>
                    ))}
                  </div>

                  <Button 
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 rounded-xl"
                    onClick={() => router.push("/wallets")}
                  >
                    Пополнить
                  </Button>
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Мои виртуальные карты</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => {
                  const cardWallet = wallets.find(w => w.id === card.walletId);
                  const currency = cardWallet ? cardWallet.currency : "USD";
                  
                  return (
                    <CardItem 
                      key={card.id} 
                      card={card} 
                      walletCurrency={currency} 
                      onUpdate={fetchDashboardData} 
                    />
                  );
                })}

                <button 
                  onClick={() => router.push("/cards/new")}
                  className="w-[320px] h-[200px] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <span className="text-2xl font-light">+</span>
                  </div>
                  <span className="font-medium">Выпустить новую карту</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Популярные сервисы</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {popularServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => router.push(`/checkout?service=${encodeURIComponent(service.name)}&amount=${service.price}&currency=${service.currency}`)}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform overflow-hidden">
                      <img 
                        src={service.icon} 
                        alt={service.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Img')}
                      />
                    </div>
                    <span className="font-semibold text-sm text-gray-800 text-center">{service.name}</span>
                    <span className="text-xs text-gray-500 font-medium">{service.currency === 'USD' ? '$' : '€'}{service.price}/мес</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Последние операции</h3>
              
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-sm">У вас пока нет операций.</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-start border-b border-gray-50 pb-4 last:border-0">
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                          tx.type === 'deposit' ? 'bg-green-50 text-green-600' : 
                          tx.type === 'withdraw' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {tx.type === 'deposit' ? '↓' : tx.type === 'withdraw' ? '↑' : '🛒'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{tx.description}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold ${
                        tx.type === 'deposit' ? 'text-green-600' : 
                        tx.type === 'withdraw' ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {tx.type === 'deposit' ? '+' : tx.type === 'withdraw' ? '-' : ''}
                        {getCurrencySymbol(tx.currency)}{Number(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}