import { Toaster as SonnerToaster } from 'sonner';

function Toaster() {
  return (
    <SonnerToaster
      theme="light"
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'hsl(0 0% 100%)',
          color: 'hsl(200 9% 11%)',
          border: '1px solid hsl(222 12% 79%)',
        },
      }}
    />
  );
}

export { Toaster };
