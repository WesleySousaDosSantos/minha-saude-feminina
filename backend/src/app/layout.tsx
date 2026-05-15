export const metadata = {
  title: 'Minha Saúde Feminina API',
  description: 'Backend institucional UNIFEBE × UBS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
