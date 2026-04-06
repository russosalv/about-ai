---
layout: post
title: "Architettura AI-Native: Perché i Pattern Standard Battono l'Iper-Ingegnerizzazione nell'Era degli Agenti di Coding"
date: 2026-04-06
description: "Nell'era del Vibe Coding, la standardizzazione e la semplicità non sono un compromesso sulla qualità — sono un requisito tecnico."
lang: it
ref: ai-native-architecture
---

> **"Nell'era del Vibe Coding, la standardizzazione e la semplicità non sono un compromesso sulla qualità — sono un requisito tecnico."**

---

## Introduzione

Lo sviluppo software sta attraversando una trasformazione epocale. L'avvento degli agenti di coding AI — da GitHub Copilot a Claude Code, da Cursor ad Augment — ha introdotto un nuovo attore nel ciclo di vita del software: la macchina come sviluppatore attivo, non come semplice strumento passivo.

Questa trasformazione impone una domanda architettrale che molti team stanno affrontando: **le architetture software tradizionali, concepite per disciplinare team umani, sono ancora ottimali quando il 50-80% del codice viene generato o revisionato da agenti AI?**

La risposta, supportata da ricerca accademica, documentazione di industry leader come Martin Fowler e Thoughtworks, e dalle best practice ufficiali di Anthropic e GitHub, è chiara: **le architetture basate su pattern esotici, iper-astrazioni e varianti non-standard di pattern consolidati degradano sistematicamente la qualità dell'output degli agenti AI**. Un approccio architetturale "standard-first" non è una resa alla mediocrità — è una precondizione tecnica per ottenere risultati affidabili in un ecosistema multi-agente.

Questo articolo analizza il problema da tre angolazioni complementari: il funzionamento interno dei Large Language Models, i vincoli fisici della context window, e le dinamiche operative di un ciclo di vita software multi-agente. Per ciascuna dimensione vengono presentate evidenze tecniche e riferimenti autorevoli.

---

## 1. Come gli LLM Generano Codice: Memoria Parametrica e Bias Statistico

### 1.1 Il Meccanismo Fondamentale

I Large Language Model generano codice attraverso **pattern-matching statistico** sul proprio training data. Questo non è un dettaglio implementativo — è la caratteristica strutturale che determina cosa funziona e cosa no nell'interazione tra architettura software e agenti AI.

Gli LLM sono stati addestrati su miliardi di righe di codice open-source proveniente da GitHub, Stack Overflow, documentazione ufficiale e repository pubblici. I pattern architetturali che appaiono con maggiore frequenza in questo corpus — MVC classico, Repository Pattern canonico, Clean Architecture standard, CQRS via MediatR — costituiscono quella che tecnicamente si definisce **memoria parametrica** del modello: la conoscenza "nativa" che il modello porta con sé senza bisogno di istruzioni esplicite.

Quando il codice di un progetto segue questi pattern standard, l'agente AI opera in modalità **zero-shot**: produce risultati eccellenti basandosi esclusivamente sulla propria conoscenza interiorizzata durante il training, senza necessità di istruzioni aggiuntive nel contesto.

### 1.2 Il Costo dell'Esoterismo: In-Context Learning vs. Memoria Parametrica

Quando un'architettura impone pattern non-standard — come un DDD strict per le operazioni di scrittura combinato con lettura diretta dal database nei controller, o interfacce comuni custom per command ed entità — l'agente è forzato ad abbandonare ciò che "sa per natura" e ad affidarsi completamente alle istruzioni esplicite fornite nel contesto. Questo meccanismo è chiamato **In-Context Learning** e presenta due problemi documentati:

**Rottura della simmetria**: i LLM lavorano per probabilità sequenziale. Se un agente osserva che le operazioni di scrittura utilizzano un Command Handler con DDD strict, la distribuzione di probabilità del modello **si aspetterà un Query Handler simmetrico** per la lettura. Rompere questa simmetria — introducendo una lettura diretta dal controller — crea un conflitto tra la predizione del modello e l'architettura reale. Il risultato è allucinazione: l'agente genera codice standard, violando le regole custom del progetto.

**Saturazione del contesto**: anche con context window da 1 milione di token, le istruzioni custom competono per l'attenzione del modello con il codice sorgente, la storia della conversazione e tutti gli altri artefatti nel contesto. Più le regole architetturali sono esotiche, più token sono necessari per descriverle — e più token vengono sottratti alla comprensione del task effettivo.

### 1.3 Evidenze dalla Ricerca

Un paper di arXiv del 2025 (*"LLM Hallucinations in Practical Code Generation"*) conferma questo comportamento: i modelli tendono a generare codice basato su pattern comuni nel training data piuttosto che su una comprensione profonda delle specifiche architetturali fornite nel contesto. Le violazioni empiricamente più frequenti sono:

- **Common > Custom**: pattern Express.js standard prevalgono sulle convenzioni proprietarie
- **Simple > Structured**: chiamate dirette al database preferite al Repository Pattern quando il contesto è ambiguo
- **Familiar > Framework-specific**: default export e pattern ubiqui nel training data prevalgono su convenzioni di progetto

Un ulteriore studio di arXiv (*"Do Code LLMs Understand Design Patterns?"*) ha valutato empiricamente la capacità dei code LLM di classificare e generare codice aderente a design pattern. I risultati mostrano che alcuni modelli — incluso GPT-4o — **performano meglio senza informazioni esplicite sui design pattern**, perché si affidano a pattern già interiorizzati durante il training. I pattern standard sono strutturalmente "nativi" per i modelli; i pattern custom richiedono un overhead cognitivo che degrada la qualità dell'output.

Un team che ha misurato la compliance ai pattern architetturali su un progetto reale ha registrato una **compliance del 30-40%** con documentazione statica (file markdown, wiki, documenti di analisi), salita all'80% solo introducendo feedback loop agentici in tempo reale su pattern standard.

> **Riferimenti:**
> - Liu et al., *"LLM Hallucinations in Practical Code Generation"*, arXiv, 2024 — [arxiv.org/html/2409.20550v1](https://arxiv.org/html/2409.20550v1)
> - *"Do Code LLMs Understand Design Patterns?"*, arXiv, 2025 — [arxiv.org/html/2501.04835v1](https://arxiv.org/html/2501.04835v1)
> - Vuong Ngo, *"AI Keeps Breaking Your Architectural Patterns. Documentation Won't Fix It."*, dev.to, 2025 — [dev.to/vuong_ngo](https://dev.to/vuong_ngo/ai-keeps-breaking-your-architectural-patterns-documentation-wont-fix-it-4dgj)

---

## 2. La Context Window: Un Vincolo Fisico, Non Teorico

### 2.1 Il Fenomeno "Lost in the Middle"

Lo studio fondamentale **"Lost in the Middle: How Language Models Use Long Contexts"** (Liu et al., Stanford University, UC Berkeley, Samaya AI, 2023) ha dimostrato scientificamente che le performance dei LLM seguono una **curva a "U"** in relazione alla posizione delle informazioni nel contesto.

I ricercatori hanno condotto un esperimento controllato: dato un insieme di documenti dove solo uno contiene la risposta corretta, hanno variato la posizione di quel documento — inizio, mezzo o fine del contesto. I risultati mostrano che:

- L'accuratezza è **massima** quando l'informazione rilevante è all'inizio del contesto (primacy bias)
- L'accuratezza è **alta** quando l'informazione è alla fine (recency bias)  
- L'accuratezza **crolla significativamente** quando l'informazione è nel mezzo

Questo pattern si è confermato **consistente** attraverso modelli multipli, architetture diverse e dimensioni differenti. Non è un difetto di un singolo modello — è una caratteristica strutturale dell'architettura transformer.

**Perché è rilevante per l'architettura software:** Se le regole architetturali non-standard del progetto — come le eccezioni al DDD strict, le convenzioni sulle letture dirette da controller, le interfacce comuni custom — sono contenute in documenti di analisi o CLAUDE.md file estesi, l'agente tenderà a ignorarle quando sono "sepolte" nel mezzo di un contesto ampio. In assenza di istruzioni chiare e prominenti, l'AI farà **fallback** sulla propria memoria parametrica, generando codice standard.

Meno regole custom ci sono, meno probabilità ci sono che l'AI le perda nel mezzo del contesto.

### 2.2 Degradazione Progressiva della Context Window

La ricerca empirica mostra che le performance degli LLM degradano progressivamente all'aumentare del riempimento della context window, anche quando si rimane entro i limiti teorici dichiarati dal modello. I meccanismi alla base sono:

1. **Attention Dilution**: il meccanismo di self-attention nei transformer ha complessità O(n²). Più token sono presenti nel contesto, più il modello fatica a focalizzarsi sulle informazioni rilevanti per il task corrente
2. **Context Rot**: con contesti molto grandi, i modelli iniziano a replicare pattern dalla conversation history anziché dal training data, diventando progressivamente "meno intelligenti"
3. **Option Overload**: troppi strumenti, pattern alternativi o approcci disponibili nel contesto portano a scelte errate — una limitazione cognitiva che colpisce sia AI che umani
4. **Token Economics**: ogni token extra nel contesto ha un costo economico e computazionale diretto. Una specifica architetturale da 2.000 righe costa 6x di più da processare rispetto a una da 300 righe, riducendo proporzionalmente il budget disponibile per il ragionamento sul task

Dati sperimentali quantificano l'impatto:

| Riempimento Context Window | Qualità Output | Istruzioni Custom Seguite |
|---|---|---|
| 0–40% | Alta | Consistente |
| 40–70% | Media | Occasionalmente ignorate |
| 70%+ | Bassa | Spesso ignorate del tutto |

L'obiettivo operativo per un team che usa agenti AI è **massimizzare il tempo in cui l'agente opera nella zona "Alta Qualità" (sotto il 40% del context window)**. Un'architettura standard che non richiede documentazione aggiuntiva per essere compresa dall'agente lascia più spazio nel contesto per il task effettivo.

> **Riferimenti:**
> - Liu et al., *"Lost in the Middle: How Language Models Use Long Contexts"*, Transactions of the Association for Computational Linguistics, Vol. 12, 2023 — [arxiv.org/abs/2307.03172](https://arxiv.org/abs/2307.03172)
> - *"Why Your AI Agent Gets Dumber with Large Specs (And How to Fix It)"*, lean-spec.dev, 2025 — [lean-spec.dev/blog/ai-agent-performance](https://www.lean-spec.dev/blog/ai-agent-performance)
> - *"Context Windows Explained: Why Size Matters for AI Coding"*, inventivehq.com, 2026 — [inventivehq.com/blog/context-windows-explained-ai-coding](https://inventivehq.com/blog/context-windows-explained-ai-coding)
> - *"Why You Need To Clear Your Coding Agent's Context Window"*, willness.dev, 2026 — [willness.dev/blog/one-session-per-task](https://willness.dev/blog/one-session-per-task)

---

## 3. Il Problema della Segregazione Fisica: DLL, NuGet e Visibilità Agente

### 3.1 Come gli Agenti AI Navigano il Codice

Strumenti come GitHub Copilot, Claude Code e gli agenti LSP lavorano **indicizzando e leggendo file sorgente nel workspace locale**. L'agente costruisce la propria comprensione del progetto attraverso l'analisi diretta del codice sorgente, le definizioni di tipo, le dipendenze importate e la struttura delle directory.

Quando l'implementazione di un comando, un'entità o un servizio è "chiusa" dentro un pacchetto NuGet compilato, l'agente AI ne vede **solo la firma pubblica** (l'interfaccia), ma non può esplorarne il codice sorgente per comprendere:

- Il comportamento reale dell'implementazione
- Il dominio di business sottostante
- Eventuali side-effect o invarianti non espressi nell'interfaccia
- Le convenzioni di naming e strutturazione interne

Questo rende l'agente **cieco rispetto al quadro generale**. Il modello è costretto a inferire il comportamento dall'interfaccia — un processo soggetto ad allucinazione, specialmente quando le interfacce sono custom e non corrispondono a pattern noti nel training data.

### 3.2 Monorepo vs. Polyrepo nell'Era del Vibe Coding

La community di sviluppo AI-driven ha già affrontato questa questione in modo sistematico. L'articolo *"Monorepo vs. Polyrepo for Multi-Stack Vibe Coding: A Developer's Decision Framework"* spiega chiaramente che nello sviluppo AI-first, i monorepo o le architetture logicamente coese vincono nettamente:

> *"In a monorepo, the AI agent sees everything. It can trace a user action from the frontend button click, through the API call, to the database update, and back to the UI state change — all in a single context window."*

Il vantaggio è triplice:

- **Visibilità contestuale completa**: l'agente può fare reasoning cross-boundary, comprendendo come i componenti interagiscono realmente
- **Pattern recognition migliorato**: su un codebase coeso, l'agente riconosce e replica pattern esistenti in modo più accurato e consistente
- **Modifiche atomiche**: una feature che attraversa più layer può essere implementata in un singolo commit, senza coordinazione manuale tra repository

Una monorepo ben organizzata logicamente — ma non esasperata nella segregazione fisica — è infinitamente superiore per lo sviluppo agentico rispetto a un'architettura frammentata in decine di pacchetti NuGet chiusi.

> **Riferimenti:**
> - *"Monorepo vs. Polyrepo for Multi-Stack Vibe Coding"*, forceweaver.com, 2025 — [blog.forceweaver.com/blog/repo-types](https://blog.forceweaver.com/blog/repo-types)
> - *"Monorepo vs Polyrepo: AI's New Rules for Repo Architecture"*, Augment Code, 2025 — [augmentcode.com/learn/monorepo-vs-polyrepo](https://www.augmentcode.com/learn/monorepo-vs-polyrepo-ai-s-new-rules-for-repo-architecture)
> - Gary Sheng, *"The Right Way To Work Across Multiple Repos with AI Agents"*, LinkedIn, 2026

---

## 4. Il Ciclo di Vita Multi-Agente: Asimmetria di Contesto e Visibilità

### 4.1 Il Problema degli Agenti con Visibilità Parziale

In un progetto software moderno, il codice viene toccato da **molteplici agenti AI con contesti, visibilità e capacità radicalmente diversi** nel corso del suo ciclo di vita:

- **L'agente primario dello sviluppatore senior** (es. Claude Code Opus con 1M di token, LSP completo, accesso alla monorepo e a tutta la documentazione): conosce tutto, comprende le scelte architetturali, ha accesso ai documenti di analisi funzionale e alle linee guida
- **L'agente di PR review** su una sub-repo: opera nel proprio context window isolato, potenzialmente senza accesso alla documentazione tecnica contenuta nella repo umbrella principale
- **L'agente di CI/CD**: ha budget di token limitato, zero accesso ai documenti di design, deve validare il codice sulla base della sua struttura intrinseca
- **L'agente dello sviluppatore a fine mese**: usa modelli economici (Claude Haiku, GPT-4o-mini) per preservare il budget mensile di token — opera con poco contesto e capacità inferenziale ridotta

Questa asimmetria è un fatto strutturale del ciclo di vita del software nell'era agentica, non un caso limite.

### 4.2 Sub-Agent Context Hierarchy

La letteratura tecnica recente identifica questo come un problema di **context hierarchy isolation**. La soluzione raccomandata è una gerarchia a tre livelli:

1. **Root context** (20-50 righe): pattern condivisi da **tutti** gli agenti — naming conventions, error handling, architettura generale
2. **Agent context** (100-200 righe): flussi comportamentali specifici per il ruolo dell'agente (sviluppo, review, CI/CD)
3. **Package context** (50-150 righe): pattern domain-specific per il codice che l'agente gestisce

Il punto critico: **il root context — che deve contenere le convenzioni base condivise — funziona solo se quelle convenzioni sono semplici, compatte e standard**. Una convenzione che richiede 500 righe di spiegazione per essere compresa non può fisicamente entrare nel root context senza saturare il budget di token disponibile per tutti gli agenti a valle.

### 4.3 La Deducibilità Locale

La community ingegneristica definisce la proprietà chiave di un codebase AI-friendly come **deducibilità locale**: un agente deve poter capire cosa fare guardando solo i file adiacenti al punto di modifica, senza dover accedere a documenti esterni, wiki, o PDF di architettura.

Un'architettura basata su pattern standard è **intrinsecamente deducibile localmente**: l'agente riconosce il pattern dal training data e sa come operare. Un'architettura esotica richiede invece accesso a documentazione esterna per essere compresa — documentazione che potrebbe non essere disponibile nel contesto dell'agente corrente.

**Esempio concreto**: un agente di PR review sulla sub-repo di un microservizio vede un controller che legge direttamente dal database. Se l'architettura standard del progetto prevede il Repository Pattern, l'agente segnalerà (correttamente, dalla sua prospettiva) una violazione architetturale. Se invece la lettura diretta da controller è una scelta deliberata documentata solo nella repo umbrella, l'agente non ha modo di saperlo — e genererà un falso positivo, oppure (peggio) "correggerà" il codice introducendo un Repository non previsto.

> **Riferimenti:**
> - Birgitta Böckeler, *"Context Engineering for Coding Agents"*, martinfowler.com, 2026 — [martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
> - *"Sub-Agent Context Hierarchy: Managing Context Isolation in Multi-Agent Systems"*, understandingdata.com, 2026 — [understandingdata.com/posts/sub-agent-context-hierarchy](https://understandingdata.com/posts/sub-agent-context-hierarchy/)
> - *"Evaluating AGENTS.md: Are Repository-Level Context Files Effective?"*, arXiv, 2025 — [arxiv.org/html/2602.11988v1](https://arxiv.org/html/2602.11988v1)

---

## 5. Il Caso Specifico: DDD Ibrido e CQRS Asimmetrico

### 5.1 Perché il DDD Strict Write + Lettura Diretta da Controller è Problematico

L'approccio architetturale che combina DDD strict per le operazioni di scrittura con lettura diretta dal database nei controller è una variante del pattern CQRS, ma applicata in modo non-standard. Il problema per gli agenti AI è duplice:

**Il CQRS standard è ben compreso dai modelli.** Il pattern canonico — con command model separato dal query model, entrambi attraverso handler dedicati — è ampiamente rappresentato nel training data. La documentazione Microsoft stessa lo descrive come pattern raccomandato per microservizi con business logic complessa. Un agente che lavora su un codebase CQRS standard sa istintivamente come creare un nuovo command handler o un nuovo query handler.

**La variante "lettura diretta da controller" non ha rappresentazione ampia nel corpus di addestramento.** È percepita dal modello come un anti-pattern rispetto alla separazione dei concern. L'agente, non avendo un riferimento statistico nel training data per questa variante, tenderà a:

- Generare un Query Handler standard (violando l'architettura prevista)
- Allucinare un layer intermedio inesistente
- Produrre codice inconsistente tra un'esecuzione e l'altra

Un'analisi critica di CQRS + DDD documenta che uno dei pitfall più comuni è applicare questi pattern a domini che non li richiedono: *"applying CQRS to a straightforward CRUD system can lead to a bloated architecture with minimal added value"*. Per gli agenti AI, un CQRS applicato parzialmente (strict su un lato, assente sull'altro) è **peggiore** di un'assenza totale di CQRS, perché crea un'aspettativa di simmetria che viene poi violata.

### 5.2 Le Interfacce Comuni Custom e la Segregazione in NuGet

La creazione di interfacce comuni custom per command, query ed entità database — distribuite in pacchetti NuGet separati — presenta un problema di visibilità specifico per gli agenti AI:

- Con librerie standard (MediatR, AutoMapper, FluentValidation, Entity Framework), il modello **conosce già le interfacce** dal training data. Zero token necessari per descriverle nel contesto
- Con interfacce custom, **ogni interfaccia richiede documentazione esplicita** nel contesto dell'agente. Questo costo si moltiplica per il numero di interfacce e per il numero di agenti nel ciclo di vita

La segregazione puntuale in molti NuGet package crea inoltre un problema di **visibilità cross-boundary**: un agente con context window limitata deve inferire le dipendenze tra package senza poter caricare tutto il codice rilevante. Con interfacce standard, l'inferenza è immediata; con interfacce custom, l'agente procede per tentativi.

> **Riferimenti:**
> - Microsoft, *"Tackling Business Complexity in a Microservice with DDD and CQRS Patterns"*, learn.microsoft.com — [learn.microsoft.com/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns](https://learn.microsoft.com/et-ee/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/)
> - *"When CQRS and DDD Don't Mix: Recognizing Misfits in Modern Architectures"*, argosco.io, 2024 — [argosco.io](https://argosco.io/when-cqrs-and-ddd-dont-mix-recognizing-misfits-in-modern-architectures/clean-architecture/)
> - *"CQRS in .NET: Deep Analysis, Benefits, and Trade-Offs"*, dev.to, 2026 — [dev.to/arthus15/cqrs-in-net](https://dev.to/arthus15/cqrs-in-net-deep-analysis-benefits-and-trade-offs-47ka)

---

## 6. La Voce dell'Industria: Martin Fowler, Anthropic e GitHub

### 6.1 Martin Fowler / Thoughtworks: Encoding Team Standards (Marzo 2026)

L'articolo *"Encoding Team Standards"* di Rahul Garg su martinfowler.com argomenta esplicitamente che le istruzioni che governano le interazioni con gli AI coding assistant debbano essere trattate come **infrastruttura**: versionata, revisionata, condivisa e soggetta a code review esattamente come il codice di produzione.

La tesi centrale è che la qualità dell'output degli AI coding assistant dipende da quanto bene il team riesce ad articolare i propri standard in modo compatto e verificabile. L'implicazione diretta: **standard non articolabili in modo compatto non sono standard operativi nell'era agentica**.

### 6.2 Martin Fowler / Thoughtworks: Harness Engineering (Aprile 2026)

Birgitta Böckeler di Thoughtworks introduce il concetto di **"harness engineering"** per coding agent: un sistema di *guide* (feedforward) e *sensori* (feedback) che regolano il comportamento dell'agente verso lo stato desiderato del codebase.

Il concetto chiave è la **harnessability**: non tutti i codebase sono ugualmente governabili. Un codebase con linguaggi fortemente tipizzati, confini di modulo chiaramente definiti e framework che astraggono i dettagli implementativi offre naturalmente più leve per costruire un harness efficace. Un codebase con pattern esotici e convenzioni implicite è **strutturalmente meno governabile**.

In particolare, Böckeler introduce la distinzione tra controlli **computazionali** (deterministici: test, linter, type checker) e **inferenziali** (probabilistici: AI code review, "LLM as judge"). I controlli computazionali — che sono i più affidabili — funzionano meglio con architetture esprimibili in regole verificabili automaticamente. Pattern standard = regole esprimibili come fitness function. Pattern esotici = regole che richiedono judgment inferenziale, con tutti i limiti di non-determinismo che questo comporta.

### 6.3 Anthropic: Claude Code Best Practices

Le best practice ufficiali di Anthropic per Claude Code enfatizzano l'uso di file **CLAUDE.md** a livello di progetto per comunicare standard, decisioni architetturali e checklist di review. L'approccio raccomandato è gerarchico: un CLAUDE.md root per le convenzioni globali, con override a livello di sotto-directory per specificità locali.

Il vincolo operativo è implicito ma chiaro: le istruzioni devono essere **sintetiche e azionabili**. Un CLAUDE.md che supera le 500 righe inizia a perdere efficacia — le istruzioni in eccesso vengono progressivamente ignorate dal modello.

### 6.4 GitHub Copilot: Custom Instructions e Limiti

La documentazione ufficiale di GitHub per le custom instruction di Copilot code review è esplicita sui limiti:

- File di istruzioni **troppo lunghi** (oltre 1.000 righe) portano all'ignoranza selettiva di alcune regole
- Istruzioni **vaghe o ambigue** non funzionano: il modello richiede regole specifiche e verificabili
- Il comportamento è **non-deterministico** per natura: la stessa istruzione può essere seguita o ignorata in esecuzioni diverse

Questo è il circolo vizioso del pattern esotico: richiede istruzioni dettagliate → le istruzioni dettagliate saturano il contesto → alcune vengono ignorate → risultati inconsistenti → si aggiungono più istruzioni → il contesto si satura ulteriormente.

> **Riferimenti:**
> - Rahul Garg, *"Encoding Team Standards"*, martinfowler.com, 2026 — [martinfowler.com/articles/reduce-friction-ai/encoding-team-standards.html](https://martinfowler.com/articles/reduce-friction-ai/encoding-team-standards.html)
> - Birgitta Böckeler, *"Harness Engineering for Coding Agent Users"*, martinfowler.com, 2026 — [martinfowler.com/articles/harness-engineering.html](https://martinfowler.com/articles/harness-engineering.html)
> - Anthropic, *"Claude Code: Best Practices for Agentic Coding"*, 2025 — [anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices)
> - GitHub, *"Using Custom Instructions for Copilot Code Review"* — [docs.github.com/copilot/tutorials/use-custom-instructions](https://docs.github.com/en/copilot/tutorials/use-custom-instructions)

---

## 7. Principi per un Codebase AI-Native

### 7.1 AI Readability e System Legibility

Il concetto emergente di **AI Readability** (o **System Legibility**) stabilisce che il codice non deve essere scritto solo per essere manutenibile dagli umani, ma deve essere "leggibile operativamente" dagli agenti AI. Il principio fondante è la **deducibilità locale**: un agente deve poter capire cosa fare guardando solo i file adiacenti al punto di intervento.

Le architetture esageratamente frammentate — con decine di pacchetti NuGet, interfacce custom distribuite su assembly diversi, e pattern asimmetrici tra lettura e scrittura — **distruggono la System Legibility**.

### 7.2 KISS for AI: La Semplicità Come Requisito Tecnico

Le ricerche sull'ingegneria del software assistita da LLM dimostrano che i modelli faticano enormemente con:

- **Astrazioni premature**: layer di interfacce che non aggiungono valore se non "disciplinare" lo sviluppatore
- **Architetture eccessivamente stratificate**: ogni layer aggiuntivo è un salto contestuale che l'agente deve comprendere
- **Pattern asimmetrici**: regole diverse per operazioni strutturalmente simili (es. write via DDD vs. read diretta)

GitHub stessa, nelle best practice per Copilot, suggerisce di evitare astrazioni inutili, mantenere il flusso di codice prevedibile e limitare il contesto irrilevante.

### 7.3 Boilerplate is Better Than Magic

Prima dell'avvento degli agenti AI, si creavano interfacce comuni e layer di astrazione complessi per non scrivere codice ripetitivo (principio DRY — Don't Repeat Yourself). L'assunto era che il costo del boilerplate fosse superiore al costo della complessità architettrale.

Nell'era del Vibe Coding, questo calcolo si è **invertito**:

- L'AI genera boilerplate in pochi secondi — il costo della ripetizione è praticamente zero
- L'AI fatica enormemente con "magia" (reflection, convenzioni implicite, layer di indirezione multipli) — il costo della complessità è altissimo
- È diventato preferibile avere codice leggermente più verboso ma **esplicito, lineare e prevedibile**, piuttosto che codice "elegante" nascosto dietro tre layer di interfacce e convention-over-configuration

### 7.4 Explicit over Implicit

L'AI lavora meglio con il codice esplicito. Un controller che chiama un servizio che chiama un repository è un pattern che ogni modello comprende in zero-shot. Un controller che "magicamente" legge dal database perché "per le read non usiamo il DDD" è un salto logico che rompe le convenzioni standard — e l'agente lo interpreterà come un errore da correggere, non come una scelta architetturale deliberata.

### 7.5 Pattern Prevedibili e Simmetrici

Le architetture migliori per l'AI sono quelle basate su pattern **simmetrici e prevedibili**: se le write passano per un handler, anche le read dovrebbero farlo. Se un microservizio usa il Repository Pattern, tutti i microservizi dovrebbero usarlo. La prevedibilità è il moltiplicatore di qualità più potente nell'ecosistema agentico.

---

## 8. Confronto Architetturale: Old-Style vs. AI-Native

| Dimensione | Approccio Old-Style | Approccio AI-Native |
|---|---|---|
| **Astrazione / Layering** | Iper-astrazione, interfacce forzate per disciplinare lo sviluppatore | Pattern standard di mercato, astrazioni solo dove aggiungono valore di business |
| **Confini fisici** | Segregazione estrema in DLL/NuGet separati | Monorepo o workspace coeso, separazione logica con confini indicizzabili |
| **Simmetria Read/Write** | DDD strict write + lettura diretta da controller | Pattern simmetrico (CQRS standard o layered architecture uniforme) |
| **Interfacce** | Custom per ogni entità, distribuite su assembly diversi | Standard di libreria (MediatR, Entity Framework) — zero token di documentazione |
| **Curva di apprendimento** | L'umano legge il documento una volta e impara | L'AI deve ri-leggere il documento ad ogni sessione (costo in token, rischio errori) |
| **Resilienza Multi-Agente** | Bassa: un agente "minore" o senza accesso ai documenti sbaglierà | Alta: qualsiasi agente, anche con modello base, sa gestire pattern standard |
| **Costo di documentazione** | Elevato: regole esotiche richiedono documentazione estesa | Basso: pattern standard si autodocumentano attraverso il codice |
| **Verificabilità computazionale** | Difficile: regole asimmetriche richiedono judgment inferenziale | Facile: pattern standard esprimibili come fitness function deterministiche |

---

## 9. Raccomandazioni Operative

### Per il Codebase

- **Preferire pattern ad alta frequenza di training data**: Repository Pattern, CQRS via MediatR standard, Layered Architecture — sono nativi per i modelli e non richiedono documentazione aggiuntiva
- **Consistenza assoluta sopra originalità**: un pattern mediocre applicato uniformemente batte un pattern eccellente applicato in modo inconsistente
- **Interfacce standard sopra interfacce custom**: pacchetti NuGet pubblici e ampiamente utilizzati (MediatR, FluentValidation, AutoMapper) richiedono zero token di descrizione nel contesto
- **Simmetria architetturale**: se le write usano un pattern, le read usano lo stesso pattern (o uno altrettanto standard)

### Per la Documentazione Agentica

- **CLAUDE.md / AGENTS.md a livello umbrella** con regole path-based per le sub-directory: struttura gerarchica che permette ai sub-agenti di ricevere solo il contesto rilevante
- **Budget di documentazione < 500 righe per il root**: oltre questa soglia le istruzioni vengono sistematicamente ignorate
- **Istruzioni come infrastruttura**: versionate in Git, soggette a code review, condivise nel team
- **Preferire regole verificabili computazionalmente** (linter, ArchUnit, fitness function) su regole che richiedono interpretation inferenziale

### Per il Ciclo di Vita Multi-Agente

- **Configurare accesso in lettura alla repo umbrella** anche per agenti che operano su sub-repo
- **Progettare per il caso peggiore**: l'architettura deve essere comprensibile anche dall'agente con meno contesto nel ciclo di vita (il modello economico di fine mese, l'agente CI/CD con budget limitato)
- **Pattern standard = resilienza**: qualsiasi agente, anche di fascia bassa, sa gestire pattern convenzionali senza documentazione aggiuntiva

---

## Conclusione

L'architettura software nell'era degli agenti AI non è più solo una questione di manutenibilità umana — è una questione di **leggibilità macchina**. La ricerca accademica, le best practice di Anthropic e GitHub, e gli articoli di industry authority come Martin Fowler e Thoughtworks convergono sulla stessa evidenza: **i pattern standard non sono un compromesso, sono un moltiplicatore di qualità**.

L'approccio architetturale che privilegia pattern esotici, astrazioni custom e varianti non-standard di DDD/CQRS impone un costo misurabile: più token consumati per documentazione, più allucinazioni contestuali, più inconsistenza tra agenti con visibilità parziale, e degradazione accelerata della qualità con il riempimento della context window.

Il vero ruolo dell'architettura nell'era agentica è essere **leggibile dalla macchina quanto dall'umano**: pattern che un modello riconosce istantaneamente dal training data richiedono zero overhead di contesto, lasciando tutto il budget cognitivo disponibile per il problema di business effettivo.

Progettare un sistema per difendersi dagli errori degli sviluppatori junior del 2015 — attraverso iper-segregazione e pattern disciplinari — è un approccio superato. Progettare un sistema **AI-Native** — aperto, prevedibile, standardizzato e simmetrico — significa ottimizzare il codebase per il modo in cui il software viene effettivamente scritto oggi e lo sarà domani.

---

## Riferimenti Completi

| # | Fonte | Tipo |
|---|---|---|
| 1 | Liu et al., *"Lost in the Middle: How Language Models Use Long Contexts"*, Stanford/UC Berkeley, TACL Vol. 12, 2023 | Paper Accademico |
| 2 | *"Do Code LLMs Understand Design Patterns?"*, arXiv, 2025 | Paper Accademico |
| 3 | *"LLM Hallucinations in Practical Code Generation"*, arXiv, 2024 | Paper Accademico |
| 4 | *"Evaluating AGENTS.md: Are Repository-Level Context Files Effective?"*, arXiv, 2025 | Paper Accademico |
| 5 | Birgitta Böckeler, *"Context Engineering for Coding Agents"*, martinfowler.com, 2026 | Industry Authority |
| 6 | Birgitta Böckeler, *"Harness Engineering for Coding Agent Users"*, martinfowler.com, 2026 | Industry Authority |
| 7 | Rahul Garg, *"Encoding Team Standards"*, martinfowler.com, 2026 | Industry Authority |
| 8 | Anthropic, *"Claude Code: Best Practices for Agentic Coding"*, 2025 | Vendor Documentation |
| 9 | GitHub, *"Using Custom Instructions for Copilot Code Review"* | Vendor Documentation |
| 10 | *"Monorepo vs. Polyrepo for Multi-Stack Vibe Coding"*, forceweaver.com, 2025 | Industry Article |
| 11 | *"Why Your AI Agent Gets Dumber with Large Specs"*, lean-spec.dev, 2025 | Technical Blog |
| 12 | *"Sub-Agent Context Hierarchy"*, understandingdata.com, 2026 | Technical Blog |
| 13 | Microsoft, *"Tackling Business Complexity with DDD and CQRS Patterns"* | Official Documentation |
| 14 | *"When CQRS and DDD Don't Mix"*, argosco.io, 2024 | Technical Analysis |
| 15 | *"CQRS in .NET: Deep Analysis, Benefits, and Trade-Offs"*, dev.to, 2026 | Technical Blog |
| 16 | Vuong Ngo, *"AI Keeps Breaking Your Architectural Patterns"*, dev.to, 2025 | Technical Blog |
| 17 | Ben Houston, *"Agentic Coding Best Practices"*, 2025 | Industry Article |
| 18 | *"Preparing Your Codebase for Agentic Coding"*, CHSAMI, 2026 | Technical Blog |
| 19 | *"Context Windows Explained: Why Size Matters for AI Coding"*, inventivehq.com, 2026 | Technical Blog |
| 20 | CodeRabbit, *"GitHub Copilot Best Practices"*, 2025 | Technical Blog |

---

*Articolo redatto ad Aprile 2026. Le fonti e i riferimenti riflettono lo stato dell'arte della ricerca e delle best practice al momento della pubblicazione.*
