import { useEffect, useState } from 'react';
import { Bell, Moon, Globe, Trash2, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';

// Tela de configurações do aplicativo, como preferências de notificação e tema.



type Settings = {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promoNotifications: boolean;
  darkMode: boolean;
  language: string;
};


export function TelaConfiguracoes() {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');

    if (savedSettings) {
      return JSON.parse(savedSettings) as Settings;
    }

    return {
      pushNotifications: true,
      emailNotifications: false,
      smsNotifications: true,
      orderUpdates: true,
      promoNotifications: false,
      darkMode: true,
      language: 'pt-BR',
    };
  });


  // Salva automaticamente as configurações alteradas
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);


  const toggle = (key: keyof Settings) => () =>
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));


  const Toggle = ({
    value,
    onToggle,
  }: {
    value: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className="w-12 h-6 rounded-full relative transition-colors duration-200"
      style={{
        background: value ? 'var(--color-primary)' : 'var(--color-border)',
      }}
    >
      <div
        className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow"
        style={{
          left: value ? '26px' : '2px',
        }}
      />
    </button>
  );


  const sections = [
    {
      title: 'Notificações',
      icon: Bell,
      items: [
        {
          key: 'pushNotifications',
          label: 'Notificações Push',
          sub: 'Alertas no dispositivo',
        },
        {
          key: 'emailNotifications',
          label: 'E-mail',
          sub: 'Confirmações e novidades',
        },
        {
          key: 'smsNotifications',
          label: 'SMS',
          sub: 'Status do pedido por SMS',
        },
        {
          key: 'orderUpdates',
          label: 'Atualiz. de Pedidos',
          sub: 'Quando o pedido mudar de status',
        },
        {
          key: 'promoNotifications',
          label: 'Promoções',
          sub: 'Cupons e ofertas especiais',
        },
      ],
    },
  ] as const;


  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Configurações" showBack />


      <div className="px-5 pt-4">

        {/* Notificações */}
        {sections.map(section => (
          <div key={section.title} className="mb-5">

            <div className="flex items-center gap-2 mb-3">

              <section.icon
                size={16}
                className="text-[#B94E2F]"
              />

              <h3 className="text-[#4E342E] text-[15px] font-bold">
                {section.title}
              </h3>

            </div>


            <div
              className="rounded-2xl overflow-hidden bg-white"
            >

              {section.items.map((item, i) => (

                <div
                  key={item.key}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderBottom:
                      i < section.items.length - 1
                        ? '1px solid rgba(92,61,30,0.3)'
                        : 'none',
                  }}
                >

                  <div>

                    <p className="text-[#4E342E] font-medium text-sm">
                      {item.label}
                    </p>

                    <p className="text-[#795548] text-xs">
                      {item.sub}
                    </p>

                  </div>


                  <Toggle
                    value={settings[item.key]}
                    onToggle={toggle(item.key)}
                  />

                </div>

              ))}

            </div>

          </div>
        ))}



        {/* Aparência */}
        <div className="mb-5">

          <div className="flex items-center gap-2 mb-3">

            <Moon
              size={16}
              className="text-[#8E44AD]"
            />

            <h3 className="text-[#4E342E] text-[15px] font-bold">
              Aparência
            </h3>

          </div>


          <div className="rounded-2xl overflow-hidden bg-white">

            <div className="flex items-center justify-between px-4 py-3">

              <div>

                <p className="text-[#4E342E] font-medium text-sm">
                  Modo Escuro
                </p>

                <p className="text-[#795548] text-xs">
                  Tema atual do aplicativo
                </p>

              </div>


              <Toggle
                value={settings.darkMode}
                onToggle={toggle('darkMode')}
              />

            </div>

          </div>

        </div>



        {/* Idioma */}
        <div className="mb-5">

          <div className="flex items-center gap-2 mb-3">

            <Globe
              size={16}
              className="text-[#2E7D32]"
            />

            <h3 className="text-[#4E342E] text-[15px] font-bold">
              Idioma
            </h3>

          </div>


          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white">

            <div>

              <p className="text-[#4E342E] font-medium text-sm">
                Idioma do App
              </p>

              <p className="text-[#795548] text-xs">
                🇧🇷 Português (Brasil)
              </p>

            </div>


            <ChevronRight
              size={16}
              className="text-[#BCAAA4]"
            />

          </button>

        </div>



        {/* Excluir conta */}
        <button
          className="
          w-full flex items-center justify-center gap-2 
          p-4 rounded-2xl mb-6
          "
          style={{
            background: 'rgba(198,40,40,0.1)',
            border: '1px solid rgba(198,40,40,0.25)',
          }}
        >

          <Trash2
            size={16}
            className="text-[#C62828]"
          />


          <span className="text-[#C62828] font-semibold text-sm">
            Excluir Conta
          </span>

        </button>


      </div>

    </ScreenWrapper>
  );
}