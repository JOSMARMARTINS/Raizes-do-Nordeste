import { ReactNode } from 'react';

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  hasBottomNav?: boolean;
}

export function ScreenWrapper({ children, className = '', scrollable = true, hasBottomNav = true }: ScreenWrapperProps) {
  return (
    <section
      className={`relative min-h-dvh w-full bg-[#FFF4DC] flex flex-col ${className}`}
    >
      {scrollable ? (
        <div
          className="flex-1 overflow-y-auto w-full"
          style={{
            paddingBottom: hasBottomNav ? '96px' : '16px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
