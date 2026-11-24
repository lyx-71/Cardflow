"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Header } from "@/components/Header";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header isAuthPage={true} />

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-[3.5rem] font-extrabold tracking-tight leading-tight mb-6 text-gray-900 dark:text-white">
            Умные виртуальные карты <br /> для современного бизнеса
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
            Создавайте, управляйте и контролируйте виртуальные карты для вашей команды. Тратьте с умом, отслеживайте каждую транзакцию и держите всё под контролем.
          </p>
          <Button onClick={() => router.push("/register")} className="px-8 rounded-lg">
            Начать бесплатно →
          </Button>
        </div>
        
        <div className="relative h-[400px] bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 flex items-center justify-center overflow-hidden transition-colors duration-300">
          <div className="absolute w-[280px] h-[170px] bg-gray-200 dark:bg-gray-700 rounded-xl transform rotate-[-10deg] translate-x-12 translate-y-8"></div>
          <div className="relative w-[320px] h-[200px] bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-2xl p-6 text-white flex flex-col justify-between transform rotate-[5deg]">
            <div className="flex justify-between items-start">
              <span className="font-semibold tracking-wider text-sm opacity-80">CardFlow</span>
              <span className="text-xl font-bold italic">МИР</span>
            </div>
            <div>
              <div className="text-xl tracking-widest font-mono mb-2">•••• •••• •••• 5555</div>
              <div className="flex justify-between text-xs opacity-80 font-mono">
                <span>ИВАН ИВАНОВ</span>
                <span>12/29</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { 
              title: "Мгновенные карты", 
              desc: "Выпускайте виртуальные карты за секунды для всех ваших сотрудников.",
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            },
            { 
              title: "Гибкий контроль", 
              desc: "Устанавливайте лимиты, категории и ограничения для каждой карты.",
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            },
            { 
              title: "Отслеживание в реальном времени", 
              desc: "Мониторьте расходы в реальном времени с уведомлениями.",
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            },
            { 
              title: "Создано для команд", 
              desc: "Управляйте картами, правами доступа и расходами всей команды.",
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-2 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-10 flex flex-col md:flex-row items-center gap-10 border border-blue-100 dark:border-blue-900/30 transition-colors duration-300">
          <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 w-full h-full text-blue-100 dark:text-blue-900/50">
              <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" />
            </svg>
            <svg 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              viewBox="0 0 24 24" 
              className="relative z-10 w-10 h-10 text-blue-600 dark:text-blue-400"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
              <path d="M12 15v2" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Безопасность, которой можно доверять</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Гарантированная защита ваших личных данных</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  ✔
                </div>
                <span className="leading-relaxed">Ваши данные зашифрованы и надежно защищены</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  ✔
                </div>
                <span className="leading-relaxed">Мы используем современные методы защиты от мошенничества</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  ✔
                </div>
                <span className="leading-relaxed">Соответствует мировым стандартам безопасности</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-2 uppercase">Простое и прозрачное ценообразование</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">Выберите тариф, который подходит вашему бизнесу</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col bg-white dark:bg-[#12121a] transition-colors duration-300">
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Стартовый</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Для фрилансеров и индивидуальных предпринимателей</p>
            <div className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">$0 <span className="text-base font-normal text-gray-500 dark:text-gray-400">/мес</span></div>
            <Button variant="outline" className="w-full mb-6 rounded-lg">Начать</Button>
            <ul className="space-y-3 text-sm flex-1">
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">До 3 виртуальных карт</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Базовый контроль расходов</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Отслеживание транзакций в реальном времени</span></li>
            </ul>
          </div>

          <div className="border-2 border-primary rounded-2xl p-8 flex flex-col relative shadow-xl shadow-blue-500/10 bg-white dark:bg-[#12121a] transition-colors duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Самый популярный</div>
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Рост</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Для растущих команд</p>
            <div className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">$19 <span className="text-base font-normal text-gray-500 dark:text-gray-400">/мес</span></div>
            <Button className="w-full mb-6 rounded-lg">Начать бесплатно</Button>
            <ul className="space-y-3 text-sm flex-1">
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">До 25 виртуальных карт</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Улучшенный контроль расходов</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Аналитика и отчеты по расходам</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Доступ и роли для команды</span></li>
            </ul>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col bg-white dark:bg-[#12121a] transition-colors duration-300">
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Бизнес</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Для крупных организаций</p>
            <div className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">$49 <span className="text-base font-normal text-gray-500 dark:text-gray-400">/мес</span></div>
            <Button variant="outline" className="w-full mb-6 rounded-lg">Связаться с нами</Button>
            <ul className="space-y-3 text-sm flex-1">
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Безлимитные виртуальные карты</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Продвинутый контроль и согласование</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Детальная аналитика и экспорт</span></li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✔ <span className="text-gray-600 dark:text-gray-300">Приоритетная поддержка</span></li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0f] pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900 dark:text-white">Продукт</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Обзор</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Виртуальные карты</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Контроль расходов</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900 dark:text-white">Решения</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Для стартапов</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Для агентств</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Для финансовых команд</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900 dark:text-white">Ресурсы</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Блог</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Справочный центр</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Документация API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900 dark:text-white">Компания</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">О нас</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Контакты</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Партнеры</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-900 dark:text-white">Будьте в курсе</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Получайте последние обновления продукта и финансовые советы прямо на почту.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="flex-1 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#12121a] text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors" />
              <button className="bg-primary text-white rounded-lg px-3 py-2 hover:bg-primary/90">→</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p>© 2026 CardFlow. Все права защищены.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Политика конфиденциальности</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Условия использования</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Безопасность</a>
          </div>
        </div>
      </footer>
    </div>
  );
}