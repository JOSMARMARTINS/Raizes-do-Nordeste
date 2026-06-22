import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

// Aquela telinha de abertura que aparece rapidamente quando o app está carregando.


export function TelaAbertura() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/login'), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F8EDD5 0%, #FFF4DC 40%, #F2E5C0 100%)' }}
    >
      {/* Raios de sol decorativos */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute origin-bottom"
            style={{
              width: '2px',
              height: '120px',
              background: 'linear-gradient(to top, rgba(185,78,47,0.4), transparent)',
              rotate: `${i * 30}deg`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: '50%',
              marginLeft: '-1px',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      {/* Logo area */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
        className="flex flex-col items-center"
      >
        {/* Icone */}
        <div
          className="w-28 h-28 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl"
          style={{ background: 'linear-gradient(145deg, #B94E2F, #C62828)', boxShadow: '0 20px 60px rgba(185,78,47,0.5)' }}
        >
          <span style={{ fontSize: '64px', lineHeight: 1 }}>🌵</span>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ fontFamily: "var(--font-family-display)", fontSize: '32px', fontWeight: 800, color: 'var(--color-foreground)', textAlign: 'center', lineHeight: 1.1 }}
        >
          Raízes do
          <br />
          <span style={{ color: 'var(--color-primary)' }}>Nordeste</span>
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-[#795548] text-sm mt-3 tracking-widest uppercase"
        >
          Sabores que contam histórias
        </motion.p>
      </motion.div>

      {/* Loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 flex flex-col items-center gap-4"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#B94E2F]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-[#795548] text-xs">Carregando sabores...</p>
      </motion.div>

      {/* Devoração inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, rgba(185,78,47,0.08), transparent)' }}
      />
    </div>
  );
}
