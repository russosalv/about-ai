---
layout: post
title: "Il Tuo Server MCP Sta Divorando la Context Window — Ecco Cosa Abbiamo Fatto"
date: 2026-03-29
description: "Abbiamo sostituito i server MCP con Skills in plain-text e comandi CLI. I risultati ci hanno sorpreso."
lang: it
ref: mcp-context-window
image: /about-ai/article-graphics/01-context-window-comparison.png
---

C'è una tensione crescente nell'ecosistema degli agenti AI di cui nessuno vuole parlare: il protocollo stesso progettato per rendere gli agenti più capaci — MCP (Model Context Protocol) — potrebbe renderli più stupidi.

Negli ultimi sei mesi, il nostro team ha costruito workflow assistiti da AI per una piattaforma enterprise su larga scala — un sistema distribuito con 11 microservizi, 5 micro-frontend, un layer BFF, saga di orchestrazione e una pipeline CI/CD completa su più ambienti. Il tipo di progetto in cui ti aspetteresti di collegare una dozzina di server MCP e chiuderla lì.

Non l'abbiamo fatto. Invece, abbiamo costruito tre Skill personalizzate — semplici file Markdown che insegnano all'agente cosa fare — e le abbiamo abbinate a strumenti CLI che l'agente sa già usare. Nessun server MCP. Nessun overhead di protocollo. Nessun inquinamento del contesto.

Questo articolo spiega perché abbiamo fatto questa scelta, cosa abbiamo costruito e cosa dicono i dati.

---

## Il Costo Nascosto di MCP

MCP è un'idea elegante: un protocollo standardizzato che permette agli agenti AI di comunicare con servizi esterni. Installi un server per GitHub, un altro per Slack, un altro per il tuo sistema CI/CD, e il tuo agente ha improvvisamente dei superpoteri.

Il problema è dove vivono quei superpoteri: nella context window.

Ogni server MCP inietta il suo schema completo di tool — ogni endpoint, ogni parametro, ogni descrizione — nella memoria di lavoro dell'agente all'inizio di ogni sessione. Questo avviene prima che l'agente legga il tuo primo messaggio. Prima ancora che sappia di cosa hai bisogno.

I numeri fanno riflettere:

- **Tre server MCP** (GitHub, Slack, Sentry) possono bruciare **oltre 55.000 token** prima che l'agente elabori un singolo messaggio utente ([Apideck, Marzo 2026](https://www.apideck.com/blog/mcp-context-window))
- In un caso documentato, tre server MCP hanno consumato **143.000 token su una context window di 200.000** — il **72% del cervello dell'agente** occupato da definizioni di tool che potrebbe non usare mai
- Benchmark indipendenti di Scalekit hanno mostrato che MCP usa **4–32× più token** rispetto alla CLI per operazioni identiche, su 75 test con Claude Sonnet 4
- Lo stesso benchmark ha rilevato un **tasso di fallimento del 28%** nelle chiamate MCP dovuto a timeout TCP — qualcosa che semplicemente non succede con gli strumenti CLI locali
- Su scala (10.000 operazioni/mese), MCP costa circa **$55 contro $3 per la CLI** — una differenza di 17× guidata interamente dall'overhead di token

Queste non sono opinioni. Sono misurazioni.

![Utilizzo della Context Window: MCP vs Skills — 3 server MCP consumano il 72% di una context window da 200k, mentre 10 Skills consumano solo il 2.5%]({{ "/article-graphics/01-context-window-comparison.png" | relative_url }})

## Il Trilemma MCP

Una volta compreso il costo in termini di contesto, ci si trova di fronte a un insieme di scelte scomode:

**Caricare tutto in anticipo.** Ottieni piena capacità, ma il 72% della memoria dell'agente è sparito. Ha meno spazio per ragionare sul tuo problema reale. L'agente diventa meno intelligente.

**Limitare le integrazioni.** Usa solo uno o due server MCP per risparmiare contesto. Ma allora hai perso la proposta di valore di un protocollo universale — tanto vale usare direttamente la CLI.

**Costruire il caricamento dinamico dei tool.** Caricare i tool MCP on demand in base alle esigenze dell'utente. Tecnicamente possibile, ma stai costruendo un servizio per gestire i tuoi servizi, aggiungendo latenza e complessità middleware.

Come ha detto Simon Willison: *"Quasi tutto ciò che potrei ottenere con un MCP può essere gestito da uno strumento CLI."*

David Zhang, costruendo il prodotto AI Duet, è andato oltre — ha rimosso completamente tutte le integrazioni MCP, anche dopo aver implementato OAuth e Dynamic Client Registration. Il compromesso era semplicemente insostenibile.

---

## L'Alternativa: Skills + CLI

Una Skill è un file Markdown. Punto.

Contiene istruzioni strutturate che insegnano a un agente AI come svolgere un compito specifico di dominio. Pensala come un runbook che daresti a un nuovo membro del team: ecco le procedure, i comandi, le convenzioni, i casi limite.

La differenza chiave rispetto a MCP è la **divulgazione progressiva**:

1. **Scoperta** (~80 token): L'agente vede solo il nome della skill e una descrizione di una riga. Questo è tutto ciò che occupa la context window di default.
2. **Attivazione** (<5.000 token): Solo quando il compito dell'utente corrisponde alla skill, le istruzioni complete vengono caricate. Le skill irrilevanti restano fuori dal contesto.
3. **Esecuzione** (0 token aggiuntivi): L'agente usa strumenti che ha già — `curl`, `git`, `kubectl`, `az cli` — per eseguire le istruzioni. Nessun layer di protocollo, nessun server da mantenere.

Cento skill caricate costano meno contesto di un singolo server MCP.

E poiché le skill sono semplici file di testo versionati in Git, chiunque nel team può leggerle, modificarle, revisionarle e migliorarle. Nessun deploy di server, nessuna infrastruttura, nessun debugging di errori di protocollo opachi.

![Architettura Skills + CLI: come l'agente carica le skill on demand e usa strumenti CLI per raggiungere i servizi esterni — confrontata con l'alternativa MCP]({{ "/article-graphics/03-skills-cli-architecture.png" | relative_url }})

---

## Cosa Abbiamo Costruito: Tre Skill per una Piattaforma Enterprise Complessa

La nostra piattaforma è un sistema distribuito per un dominio di back-office enterprise — microservizi, micro-frontend, architettura event-driven, deployment Kubernetes, tutto il pacchetto. Ecco cosa abbiamo costruito al posto dei server MCP.

### Skill 1: Governance Architetturale

**Il problema:** Con 11 microservizi che evolvono indipendentemente, la documentazione architetturale diventava obsoleta nel momento in cui veniva scritta. Gli assistenti AI (Claude, Copilot) generavano codice che non seguiva le nostre convenzioni. Il debito tecnico si accumulava invisibilmente.

**Cosa fa la skill:** Serve come unica fonte di verità per l'architettura target della piattaforma. Conosce i nostri pattern DDD, le convenzioni di messaggistica, le strutture delle cartelle, le regole di naming e otto vincoli architetturali assoluti. Quando invocata, genera e aggiorna 12 documenti strutturati — dalle linee guida e audit di conformità ai registri del debito tecnico con stime di effort.

**Perché non un MCP?** Questo è puro lavoro di conoscenza. Non c'è nessuna API esterna da chiamare. La skill insegna all'agente le nostre convenzioni e procedure — qualcosa che appartiene a un file di testo, non a un server di protocollo. Un server MCP per questo avrebbe caricato migliaia di token di definizioni di schema per endpoint che in realtà sono solo "leggi questo file e applica queste regole."

La skill genera anche file `CLAUDE.md` e istruzioni per GitHub Copilot, così gli assistenti AI di tutto il team producono codice conforme alla nostra architettura. Governance as code — con zero overhead a runtime.

### Skill 2: Orchestrazione CI/CD & Deployment

**Il problema:** Gestiamo 44 pipeline Azure DevOps (build CI, pubblicazione NuGet, deployment CD su due ambienti), un cluster AKS, un container registry e Helm chart. Fare il deploy di un servizio richiede controllare lo stato della build, recuperare i tag delle immagini, aggiornare le versioni dei chart, fare commit nel repo dell'infrastruttura, attivare le pipeline CD e verificare i pod.

**Cosa fa la skill:** Insegna all'agente il workflow completo di deployment — ogni ID di pipeline, ogni endpoint API, ogni percorso di Helm chart, ogni comando `kubectl`. L'agente orchestra deployment multi-servizio chiamando `curl` (API Azure DevOps), `az cli` (container registry), `kubectl` (Kubernetes) e `git` (aggiornamenti Helm chart).

**Perché non un MCP?** Immagina di caricare 44 definizioni di pipeline come schema di tool MCP. Sono decine di migliaia di token — consumati ogni sessione, anche quando vuoi solo controllare lo stato di una build. Invece, la nostra skill insegna all'agente a usare `curl` con gli header e gli URL giusti. Divulgazione progressiva: l'agente legge la sezione deployment solo quando chiedi un deploy. Il resto del tempo, costa ~80 token.

Il confronto dei benchmark rende tutto evidente: un'operazione CLI per controllare il linguaggio di un repository costa **1.365 token**. La stessa operazione via MCP costa **44.026 token** (Scalekit, 75 test, Claude Sonnet 4). Per il nostro sistema con 44 pipeline, i risparmi si moltiplicano drammaticamente.

![Costo in Token per Operazione: MCP 44.026 token vs CLI 1.365 — una differenza di 32×, con MCP che costa $55/mese vs $3 per la CLI]({{ "/article-graphics/02-token-benchmark-mcp-vs-cli.png" | relative_url }})

### Skill 3: Generatore di Documentazione Architetturale

**Il problema:** Mantenere decisioni architetturali, registri dei componenti e specifiche dei servizi sincronizzati in una piattaforma in crescita è un lavoro a tempo pieno. Le modifiche a un servizio si propagano nella documentazione in modi imprevedibili. I componenti in fase draft necessitano di un trattamento diverso rispetto a quelli in produzione.

**Cosa fa la skill:** Mantiene un registro centrale di tutti i componenti del sistema con stati del ciclo di vita (approved, draft, deprecated). Genera definizioni del modello C4, mappe di interazione del sistema e specifiche tecniche per servizio. I componenti in stato "draft" vengono automaticamente esclusi dagli audit di conformità e dall'analisi del debito — nessun falso negativo durante le fasi di design.

**Perché non un MCP?** Stesso principio: questa è conoscenza strutturata, non integrazione API. La skill contiene file di riferimento per ogni pattern architetturale, caricati on demand. Un registro dei componenti non ha bisogno di un server in esecuzione — ha bisogno di un file di testo ben organizzato e istruzioni chiare su come aggiornarlo.

---

## Come le Abbiamo Costruite: lo Skill Creator

Ecco dove diventa interessante. Non abbiamo scritto queste skill da zero a mano sperando che funzionassero. Abbiamo usato lo [Skill Creator di Anthropic](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) — esso stesso una skill — per costruirle, testarle e validarle.

Questo è importante perché affronta la più grande obiezione alle skill: *"Come fai a sapere che funzionano davvero?"*

Prima che lo Skill Creator esistesse, costruire una skill era un atto di fede. Scrivevi le istruzioni, le provavi un paio di volte e le pubblicavi. Se un aggiornamento del modello rompeva qualcosa, lo scoprivi dagli utenti — non dai test. Non c'era un modo sistematico per misurare se una skill migliorava l'output dell'agente o lo peggiorava.

Lo Skill Creator cambia questo portando il rigore dell'ingegneria del software nella creazione delle skill:

**Creazione strutturata.** Ti intervista sullo scopo della skill, i casi limite, gli input e output attesi. Genera il SKILL.md e i casi di test iniziali — non solo la skill, ma i test per validarla.

**Test comparativi.** Per ogni caso di test, lancia due agenti in parallelo: uno con la skill, uno senza (baseline). Entrambi eseguono lo stesso compito. È così che sai che la skill aggiunge davvero valore — stai confrontando, non assumendo.

**Benchmark quantitativi.** Ogni test produce metriche: tassi di superamento delle asserzioni, consumo di token, tempo di esecuzione e il delta tra con-skill e baseline. Media e deviazione standard tra le esecuzioni. Se il delta è zero o negativo, la skill non sta aiutando — e hai i dati per dimostrarlo.

**Ottimizzazione della descrizione.** La descrizione della skill è il suo meccanismo di attivazione — determina quando l'agente la attiva. Lo Skill Creator genera 20 query di test (10 dovrebbero attivare, 10 non dovrebbero, con i casi al limite che sono i più preziosi) e esegue un ciclo di ottimizzazione per ridurre falsi positivi e falsi negativi. Anthropic ha riportato che questo processo ha migliorato l'accuratezza di attivazione in 5 su 6 skill pubbliche di creazione documenti.

**Raffinamento iterativo.** Ogni ciclo di miglioramento crea una nuova directory con risultati di test freschi, così puoi confrontare le iterazioni e tracciare la convergenza. Un visualizzatore interattivo ti permette di revisionare gli output fianco a fianco e fornire feedback mirato.

Come dice Anthropic: *"I test trasformano una skill che sembra funzionare in una che sai che funziona."*

Questo è il cambiamento fondamentale. Le skill non sono più conoscenza tribale codificata come markdown pieno di speranze. Sono artefatti testati con prestazioni misurate — più vicini al codice che alla documentazione.

![Workflow dello Skill Creator: il ciclo di sviluppo in 5 fasi — Intervista, Test Comparativo, Benchmark, Revisione, Iterazione]({{ "/article-graphics/04-skill-creator-workflow.png" | relative_url }})

---

## Quando MCP Ha Ancora Senso

Questo non è un articolo "MCP è morto". MCP ha casi d'uso legittimi:

- **Integrazioni B2B multi-tenant** dove OAuth per utente è essenziale
- **Streaming in tempo reale** via WebSocket dove la comunicazione bidirezionale conta
- **Sistemi multi-agente** con catene di identità che necessitano di isolamento dei processi
- **Ecosistemi** dove un registry MCP fornisce già connettori pronti all'uso per le tue esigenze specifiche
- **Ambienti di compliance** che richiedono un rigoroso isolamento dei processi tra l'agente e i servizi esterni

Il punto non è evitare MCP dogmaticamente. Il punto è **trattare il contesto come una risorsa scarsa** e scegliere lo strumento più leggero che porta a termine il lavoro.

Per la maggior parte dei workflow interni — DevOps, governance architetturale, documentazione, policy di code review, procedure di deployment — Skills + CLI sono quello strumento più leggero. Costano meno contesto, non richiedono infrastruttura, falliscono in modo più trasparente e sono leggibili dagli esseri umani.

---

## La Conclusione

Gestiamo una piattaforma con 11 microservizi, 44 pipeline CI/CD e un cluster AKS. Tre Skill e comandi CLI standard gestiscono ciò che avrebbe richiesto almeno tre o quattro server MCP — ognuno bruciando migliaia di token per sessione.

La matematica è semplice:

| Approccio | Token per sessione | Infrastruttura | Modalità di fallimento |
|---|---|---|---|
| 3 server MCP | 55.000–143.000 | 3 server da mantenere | Timeout TCP (28%) |
| 3 Skills + CLI | ~240 (scoperta) + on-demand | Zero — solo file di testo | Errori CLI trasparenti |

L'agente resta intelligente perché la sua context window resta libera. Il team resta produttivo perché chiunque può leggere e migliorare un file Markdown. Il sistema resta affidabile perché gli strumenti CLI non hanno modalità di fallimento da timeout TCP.

E grazie allo Skill Creator, non speriamo che le nostre skill funzionino — lo misuriamo.

---

*Se stai costruendo workflow assistiti da AI e la tua prima scelta è MCP, considera se una Skill ben scritta e un comando CLI potrebbero essere tutto ciò di cui hai bisogno. La context window che risparmi potrebbe essere l'intelligenza di cui il tuo agente ha bisogno per risolvere davvero il tuo problema.*

---

**Riferimenti:**
- Apideck — ["Your MCP Server Is Eating Your Context Window"](https://www.apideck.com/blog/mcp-context-window) (Marzo 2026)
- Scalekit — MCP vs CLI Benchmark, 75 test con Claude Sonnet 4
- Intuition Labs — ["Claude Skills vs. MCP: A Technical Comparison"](https://intuitionlabs.ai/claude-skills-vs-mcp) (Feb 2026)
- ravichaganti.com — ["Agent Skills vs Model Context Protocol"](https://ravichaganti.com/blog/agent-skills-vs-mcp) (Feb 2026)
- Anthropic — ["Improving Skill Creator: Test, Measure, and Refine Agent Skills"](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills) (2026)
- Anthropic — [Skill Creator su GitHub](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
