import Header from '../../components/navbar/Header'
import Footer from '../../components/footer/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >

        <Header/>
        {/* <div style={{ height:"600px" }}> */}
        {children}
        {/* </div> */}
        <Footer/>
        </body>
    </html>
  );
}
