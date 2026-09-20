# 01 · Introducción y Arquitectura General - ClientumOS

## 1. Visión General del Sistema
**ClientumOS** es una plataforma empresarial integrada de CRM, ERP y Automatización Comercial con Inteligencia Artificial, diseñada específicamente para PyMEs y PyMEs corporativas en América Latina. La plataforma centraliza la gestión comercial, la emisión fiscal (AFIP), la mensajería omnicanal (WhatsApp Cloud) y los pagos (Mercado Pago) bajo una experiencia de usuario sobria, rápida y confiable.

## 2. Pila Tecnológica (Tech Stack)
- **Frontend**: React 18+ con TypeScript, Vite (SPA), Tailwind CSS v4.
- **Iconografía**: `lucide-react`.
- **Animaciones**: `motion` (Motion for React) y Canvas Confetti.
- **Gráficos & Visualizaciones**: Recharts y D3.js.
- **Persistencia**: Firebase Firestore (en tiempo real) + caché local (`localStorage`) para soporte offline-first.
- **Backend & API Proxy**: Servidor Express en `server.ts` con integración a Webhooks de Meta, pasarelas de pago y Web Services de AFIP.

## 3. Principios de Diseño y Marca
- **Claridad Comercial Editorial**: Superficies limpias, tipografía Inter, uso riguroso del azul institucional (`#022046`) para bloques premium y portadas, azul de acción (`#0056B3`) para CTAs y verde (`#4CAF50`) exclusivamente para indicadores de éxito y crecimiento.
- **Menos Tareas Manuales**: Automatización de flujos de trabajo sin fricción innecesaria.
