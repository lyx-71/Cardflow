"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type CardData = {
  id: string;
  maskedNumber: string;
  expiryMonth: number;
  expiryYear: number;
  status: string;
  walletId: string;
};

interface CardItemProps {
  card: CardData;
  walletCurrency: string;
  onUpdate: () => void;
}

export function CardItem({ card, walletCurrency, onUpdate }: CardItemProps) {
  const [revealedData, setRevealedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReveal = async () => {
    if (revealedData) {
      setRevealedData(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/cards/${card.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setRevealedData(data);
      }
    } catch (error) {
      console.error("Ошибка", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFreeze = async () => {
    try {
      await fetch(`http://localhost:3000/cards/${card.id}/toggle-freeze`, {
        method: "POST",
        credentials: "include",
      });
      onUpdate();
    } catch (error) {
      console.error("Ошибка заморозки", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите отвязать карту? Деньги останутся на кошельке.")) return;
    
    try {
      await fetch(`http://localhost:3000/cards/${card.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      onUpdate();
    } catch (error) {
      console.error("Ошибка удаления", error);
    }
  };

  return (
    <div className={`w-[320px] h-[200px] rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all ${
      card.status === 'frozen' ? 'bg-gray-500 grayscale' : 'bg-gradient-to-br from-gray-800 to-black text-white'
    }`}>
      <div className="absolute top-5 left-5 w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-80"></div>
      
      <div className="flex justify-between items-start mt-8 z-10">
        <div className="flex flex-col">
          <span className="font-semibold tracking-wider text-sm opacity-80">
            {card.status === 'active' ? 'Активная' : 'Заморожена'}
          </span>
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded mt-1 w-fit backdrop-blur-sm">
            {walletCurrency}
          </span>
        </div>
        <span className="text-lg font-bold italic">VISA</span>
      </div>

      <div className="z-10 mt-4">
        {revealedData ? (
          <div className="space-y-1">
            <p className="text-lg tracking-widest font-mono">
              {revealedData.number.replace(/(.{4})/g, "$1 ")}
            </p>
            <div className="flex gap-4 text-xs font-mono opacity-80">
              <span>{String(revealedData.expiryMonth).padStart(2, "0")}/{String(revealedData.expiryYear).slice(-2)}</span>
              <span>CVV: {revealedData.cvv}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-lg tracking-widest font-mono">{card.maskedNumber}</p>
            <p className="text-xs font-mono opacity-80">
              {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end z-10 mt-2">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={handleReveal} 
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 text-white border-0 text-xs h-8 px-3"
          >
            {isLoading ? "..." : revealedData ? "Скрыть" : "Данные"}
          </Button>
          
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={handleToggleFreeze}
            className="bg-white/10 hover:bg-white/20 text-white border-0 text-xs h-8 px-3"
          >
            {card.status === 'active' ? "Заморозить" : "Разморозить"}
          </Button>
        </div>

        <Button 
          size="sm" 
          variant="secondary" 
          onClick={handleDelete}
          className="bg-red-500/20 hover:bg-red-500/40 text-red-100 border-0 text-xs h-8 px-3"
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}