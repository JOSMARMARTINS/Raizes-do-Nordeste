import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';

// Tela de erro amigável (página não encontrada - 404), para o cliente não se sentir perdido.


interface ErrorScreenProps {
  type?: 'network' | 'notfound' | 'generic';
  message?: string;
  onRetry?: () => void;
}

export function TelaErro({ type = 'generic', message, onRetry }: ErrorScreenProps) {
  const navigate = useNavigate();

  const configs = {
    network: {
      icon: '📶',
      title: 'Sem Conexão',
      sub: 'Verifique sua internet e tente novamente',
      emoji: <WifiOff size={40} className="text-[#C62828]" />
    },

    notfound: {
      icon: '🔍',
      title: 'Não encontrado',
      sub: 'A página que você procura não existe',
      emoji: null
    },

    generic: {
      icon: '⚠️',
      title: 'Algo deu errado',
      sub: message || 'Ocorreu um erro inesperado. Tente novamente.',
      emoji: null
    },
  };

  const config = configs[type];

  return (
    <div className="absolute inset-0 bg-[#FFF4DC] flex flex-col">

      <Header
        title={config.title}
        showBack
      />

      <div className="flex-1 flex flex-col items-center justify-center px-8">

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center"
        >

          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
            style={{
              background: 'rgba(198,40,40,0.15)',
              border: '1px solid rgba(198,40,40,0.3)'
            }}
          >
            <span style={{ fontSize: '48px' }}>
              {config.icon}
            </span>
          </div>


          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--color-foreground)',
              marginBottom: '8px'
            }}
          >
            {config.title}
          </h2>


          <p className="text-[#795548] text-sm mb-8 leading-relaxed">
            {config.sub}
          </p>


          <div className="flex flex-col gap-3 w-full">

            {onRetry && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onRetry}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #B94E2F, #C62828)'
                }}
              >
                <RefreshCw size={18} />
                Tentar Novamente
              </motion.button>
            )}

            <button
              onClick={() => navigate('/Admin')}
              className="w-full py-3 rounded-2xl font-semibold text-sm"
              style={{
                background: '#FFFFFF',
                color: 'var(--color-muted)'
              }}
            >
              Voltar ao Painel Administrativo
            </button>


          </div>

        </motion.div>

      </div>

    </div>
  );
}


export function TelaNaoEncontrada() {
  return <TelaErro type="notfound" />;
}