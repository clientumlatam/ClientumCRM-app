# Hermes & Clientum - Resumen de Arquitectura

Este documento resume las ideas principales desarrolladas durante la
conversación.

## Visión

**Clientum**: Plataforma SaaS para PyMEs.

**Hermes**: Motor de IA que coordina agentes, herramientas y
automatizaciones.

## Objetivos

-   Plataforma SaaS multiempresa.
-   Agentes especializados.
-   CRM + ERP + WhatsApp + Automatizaciones.
-   Marketplace de plugins y skills.
-   Arquitectura basada en eventos.
-   Integraciones mediante APIs y MCP.

## Agentes

-   Hermes Prime (Orquestador)
-   Ventas
-   Marketing
-   Finanzas
-   Operaciones
-   Soporte
-   DevOps

## Componentes

-   CRM
-   ERPNext / Dolibarr
-   WhatsApp
-   Email
-   Dashboard
-   Memoria
-   Workflows
-   Event Bus
-   API Gateway
-   Plugin Manager

## Skills

-   WhatsApp
-   Email
-   ERP
-   Docker
-   GitHub
-   Google Workspace
-   Browser
-   Calendario

## CLI

``` bash
hermes install
hermes doctor
hermes start
hermes stop
hermes update
hermes backup
hermes restore
hermes deploy cliente
hermes agent create ventas
hermes skill install evolution
```

## Scripts propuestos

-   bootstrap.sh
-   01-system.sh
-   02-docker.sh
-   03-database.sh
-   04-ai.sh
-   05-hermes.sh
-   06-monitoring.sh
-   07-security.sh
-   08-clientum.sh

## Roadmap

### Fase 1

-   Multiempresa
-   CRM
-   WhatsApp
-   Dashboard
-   Hermes Core

### Fase 2

-   ERP
-   Automatizaciones
-   Memoria
-   BI

### Fase 3

-   Marketplace
-   SDK
-   API pública
-   App móvil

### Fase 4

-   Ecosistema de partners
-   Agentes por industria
-   Expansión regional

## Principios

-   Arquitectura modular.
-   Open Core.
-   Seguridad por permisos.
-   Auditoría completa.
-   Eventos desacoplados.
-   Plugins y Skills.

## Visión

Hermes actúa como un sistema operativo de agentes que coordina personas,
software y automatizaciones, mientras Clientum ofrece la plataforma SaaS
para PyMEs.
