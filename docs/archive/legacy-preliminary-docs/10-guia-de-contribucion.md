# 10 · Guía de Contribución - ClientumOS

Queremos que ClientumOS sea el mejor CRM de código abierto, y tu ayuda es fundamental.

## 1. Código de Conducta
Mantenemos un ambiente profesional, respetuoso y enfocado en la excelencia técnica.

## 2. Cómo Contribuir

### Reportar Errores (Bugs)
- Usa el sistema de Issues del repositorio.
- Incluye pasos para reproducir el error y detalles de tu entorno.

### Sugerir Mejoras
- Si tienes una idea para una nueva funcionalidad, abre un Issue de tipo "Feature Request".
- Describe el beneficio para el usuario final y cómo encaja en la arquitectura actual.

### Enviar Pull Requests (PRs)
1. **Haz un Fork** del repositorio.
2. **Crea una rama** descriptiva siguiendo la convención:
   - `feat/nombre-funcionalidad`: Nuevas características.
   - `fix/descripcion-error`: Corrección de fallos.
   - `docs/nombre-doc`: Mejoras en la documentación.
3. **Escribe código limpio** siguiendo las [guías de arquitectura](./01-introduccion-y-arquitectura.md).
4. **Commits Semánticos**: Preferimos mensajes claros como `feat: integrar api de mercado pago` o `fix: corregir salto de línea en kanban`.
5. **Verifica tu código**:
   - `npm run lint` (Debe ser exitoso).
   - `npm run build` (Debe generar el bundle sin advertencias).
6. **Envía el PR** detallando los cambios, pruebas realizadas y capturas de pantalla si aplica.

## 3. Estándares de Código

- **TypeScript**: Tipado estricto siempre. Evita el uso de `any`.
- **Componentes**: Prefiere componentes funcionales y hooks.
- **Estilos**: Usa utilidades de Tailwind. Mantén la consistencia con el [Manual de Marca](./04-manual-de-marca.md).
- **Documentación**: Si añades una funcionalidad importante, actualiza el archivo correspondiente en `/docs`.

## 4. Licencia
Al contribuir, aceptas que tus aportaciones estarán bajo la licencia del proyecto (MIT / Propietaria según corresponda).

---
*Gracias por ayudar a ClientumOS a crecer.*
