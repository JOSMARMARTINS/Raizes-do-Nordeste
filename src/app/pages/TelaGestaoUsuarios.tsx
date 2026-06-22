import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, Shield, ShieldOff, Pencil, X, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { UserRole } from '../store/AppContext';

// Tela administrativa para gerenciar os usuários e funcionários cadastrados no sistema.


interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
  active: boolean;
}

const INITIAL_USERS: ManagedUser[] = [
  { id: '1', name: 'Josmar Nascimento Martins', email: 'josmar@email.com', role: 'cliente', active: true },
  { id: '2', name: 'João Souza', email: 'atendente@raizes.com', role: 'atendente', storeId: 'rcf-01', storeName: 'Boa Vista (PE)', active: true },
  { id: '3', name: 'Ana Ferreira', email: 'gerente@raizes.com', role: 'gerente', storeId: 'rcf-01', storeName: 'Boa Vista (PE)', active: true },
  { id: '4', name: 'Carlos Administrador', email: 'admin@raizes.com', role: 'admin', active: true },
  { id: '5', name: 'Pedro Lima', email: 'pedro@raizes.com', role: 'atendente', storeId: 'rcf-02', storeName: 'Boa Viagem (PE)', active: true },
  { id: '6', name: 'Carla Mota', email: 'carla@raizes.com', role: 'gerente', storeId: 'for-01', storeName: 'Meireles (CE)', active: false },
  { id: '7', name: 'Roberto Nunes', email: 'roberto@raizes.com', role: 'atendente', storeId: 'ssa-01', storeName: 'Pelourinho (BA)', active: true },
];

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; icon: string }> = {
  cliente:   { label: 'Cliente',    color: '#2980B9', icon: '👤' },
  atendente: { label: 'Atendente',  color: 'var(--color-primary)', icon: '🧑‍💼' },
  gerente:   { label: 'Gerente',    color: 'var(--color-accent)', icon: '🏪' },
  admin:     { label: 'Admin',      color: 'var(--color-secondary)', icon: '👑' },
};

const ROLES: UserRole[] = ['cliente', 'atendente', 'gerente', 'admin'];

export function TelaGestaoUsuarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'todos'>('todos');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('cliente');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'todos' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const startEdit = (u: ManagedUser) => {
    setEditingId(u.id);
    setEditRole(u.role);
  };

  const saveEdit = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: editRole } : u));
    setEditingId(null);
  };

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Gerenciar Usuários" showBack />

      <div className="px-5 pt-4">
        {/* Summario */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {ROLES.map(role => {
            const count = users.filter(u => u.role === role && u.active).length;
            const cfg = ROLE_CONFIG[role];
            return (
              <div key={role} className="p-2.5 rounded-xl text-center" style={{ background: '#FFFFFF', border: `1px solid ${cfg.color}20` }}>
                <span style={{ fontSize: '16px', display: 'block' }}>{cfg.icon}</span>
                <p className="font-bold text-sm" style={{ color: cfg.color }}>{count}</p>
                <p className="text-[#BCAAA4] text-[9px]">{cfg.label}</p>
              </div>
            );
          })}
        </div>

        {/* procurar */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#795548]" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
          />
        </div>

        {/* Filtrar por função */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {(['todos', ...ROLES] as const).map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
              style={{
                background: filterRole === r ? 'var(--color-primary)' : '#FFFFFF',
                color: filterRole === r ? 'white' : 'var(--color-muted)',
                border: `1px solid ${filterRole === r ? 'var(--color-primary)' : 'rgba(185,78,47,0.2)'}`,
              }}
            >
              {r === 'todos' ? 'Todos' : ROLE_CONFIG[r].label}
            </button>
          ))}
        </div>

        {/* Lista de Usuárois */}
        <div className="flex flex-col gap-2 mb-6">
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>🔍</span>
              <p className="text-[#795548] text-sm">Nenhum usuário encontrado</p>
            </div>
          )}
          {filtered.map(u => {
            const cfg = ROLE_CONFIG[u.role];
            const isEditing = editingId === u.id;
            return (
              <motion.div
                key={u.id}
                layout
                className="p-3 rounded-2xl"
                style={{
                  background: u.active ? '#FFFFFF' : 'rgba(188,170,164,0.08)',
                  border: `1px solid ${u.active ? 'rgba(185,78,47,0.1)' : 'rgba(188,170,164,0.25)'}`,
                  opacity: u.active ? 1 : 0.65,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cfg.color}18` }}
                  >
                    <span style={{ fontSize: '20px' }}>{cfg.icon}</span>
                  </div>

                  {/* Informação */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[#4E342E] font-bold text-sm">{u.name}</p>
                      {!u.active && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#C6282820', color: 'var(--color-secondary)' }}>Inativo</span>
                      )}
                    </div>
                    <p className="text-[#BCAAA4] text-[10px] truncate">{u.email}</p>
                    {u.storeName && <p className="text-[#795548] text-[10px]">📍 {u.storeName}</p>}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => startEdit(u)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(185,78,47,0.1)' }}
                    >
                      <Pencil size={12} className="text-[#B94E2F]" />
                    </button>
                    <button
                      onClick={() => toggleActive(u.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: u.active ? 'rgba(198,40,40,0.1)' : 'rgba(46,125,50,0.1)' }}
                    >
                      {u.active
                        ? <ShieldOff size={12} className="text-[#C62828]" />
                        : <Shield size={12} className="text-[#2E7D32]" />
                      }
                    </button>
                  </div>
                </div>

                {/* Distintivo de função + editar em linha */}
                <AnimatePresence>
                  {!isEditing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 ml-13 pl-[52px]">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${cfg.color}18`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </motion.div>
                  )}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <p className="text-[#795548] text-xs font-semibold mb-2">Alterar perfil de acesso:</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ROLES.map(r => {
                          const rc = ROLE_CONFIG[r];
                          return (
                            <button
                              key={r}
                              onClick={() => setEditRole(r)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                              style={{
                                background: editRole === r ? rc.color : `${rc.color}15`,
                                color: editRole === r ? 'white' : rc.color,
                                border: `1px solid ${rc.color}40`,
                              }}
                            >
                              {rc.icon} {rc.label}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                          style={{ background: 'rgba(188,170,164,0.15)', color: 'var(--color-muted)' }}
                        >
                          <X size={12} /> Cancelar
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => saveEdit(u.id)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1"
                          style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)' }}
                        >
                          <Check size={12} /> Salvar
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Botão para adicionar usuário */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-6"
          style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)', boxShadow: '0 8px 24px rgba(185,78,47,0.35)' }}
        >
          <UserPlus size={18} className="text-white" />
          <span className="text-white font-bold">Adicionar Novo Usuário</span>
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}
