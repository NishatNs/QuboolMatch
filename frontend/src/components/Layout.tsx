import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DevLogin from './DevLogin';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <DevLogin />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;