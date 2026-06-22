import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './store/AppContext';
import { MobileFrame } from './components/MobileFrame';

// O AppShell é a casca da nossa aplicação, que segura o roteamento
function AppShell() {
  return (
    <MobileFrame>
      <RouterProvider router={router} />
    </MobileFrame>
  );
}

// App é o ponto de entrada principal que envolve tudo com o contexto global
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}