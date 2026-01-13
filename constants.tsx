
import React from 'react';
import { Scissors, ShoppingBag, Calendar, Users, BarChart3, Settings, LogOut, Home, Award, Camera } from 'lucide-react';
import { Service, Product } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'Corte Degradê', price: 45, duration: 40, category: 'Cabelo', image: 'https://picsum.photos/seed/cut1/400/300' },
  { id: '2', name: 'Barba Terapia', price: 35, duration: 30, category: 'Barba', image: 'https://picsum.photos/seed/beard1/400/300' },
  { id: '3', name: 'Combo (Cabelo + Barba)', price: 70, duration: 60, category: 'Combo', image: 'https://picsum.photos/seed/combo1/400/300' },
  { id: '4', name: 'Platinado', price: 120, duration: 120, category: 'Química', image: 'https://picsum.photos/seed/color1/400/300' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Pomada Efeito Matte', price: 35, stock: 15, category: 'Finalizador', image: 'https://picsum.photos/seed/pomade/400/300' },
  { id: 'p2', name: 'Óleo para Barba', price: 28, stock: 8, category: 'Cuidado', image: 'https://picsum.photos/seed/oil/400/300' },
  { id: 'p3', name: 'Shampoo Mentolado', price: 42, stock: 5, category: 'Higiene', image: 'https://picsum.photos/seed/shampoo/400/300' },
];

export const ADMIN_MENU = [
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Agenda', path: '/admin/agenda' },
  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Estoque', path: '/admin/estoque' },
  { icon: <Scissors className="w-5 h-5" />, label: 'Serviços', path: '/admin/servicos' },
  { icon: <Users className="w-5 h-5" />, label: 'Clientes', path: '/admin/clientes' },
  { icon: <Settings className="w-5 h-5" />, label: 'Configurações', path: '/admin/config' },
];

export const CLIENT_MENU = [
  { icon: <Home className="w-5 h-5" />, label: 'Início', path: '/app' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Agendar', path: '/app/agendar' },
  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Produtos', path: '/app/produtos' },
  { icon: <Award className="w-5 h-5" />, label: 'Fidelidade', path: '/app/fidelidade' },
  { icon: <Camera className="w-5 h-5" />, label: 'Galeria', path: '/app/galeria' },
];
