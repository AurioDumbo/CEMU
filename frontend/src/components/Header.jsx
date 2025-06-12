import React from 'react';
import logo from '../assets/icons/CEMU com legenda.png'; // ajuste o caminho conforme onde salvar a imagem

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 flex items-center h-16 px-6 fixed top-0 left-0 right-0 z-50">
      <img src={logo} alt="Logo" className="h-14 w-auto" />
    </header>
  );
}
