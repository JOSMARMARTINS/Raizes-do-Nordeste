import { ReactNode } from 'react';

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        min-h-dvh
        w-full
        bg-[#FFFFFF]
        overflow-x-hidden
      "
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <main
        className="
          relative
          w-full
          min-h-dvh
          mx-auto
          overflow-x-hidden

          md:max-w-6xl
          lg:max-w-[1400px]
          xl:max-w-[1600px]
          2xl:max-w-[1800px]
        "
      >
        {children}
      </main>
    </div>
  );
}

