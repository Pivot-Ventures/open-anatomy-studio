"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowSquareOut,
  BookOpenText,
  BookmarkSimple,
  CheckCircle,
  CircleNotch,
  Cube,
  Flask,
  GlobeHemisphereWest,
  Info,
  Keyboard,
  MagnifyingGlass,
  Moon,
  Pause,
  Play,
  Scissors,
  Sun,
  Tag,
  X,
} from "@phosphor-icons/react";
import {
  anatomySources,
  localize,
  organById,
  organs,
  systems,
  type BodySystem,
  type Language,
} from "../lib/anatomy";
import { copy } from "../lib/copy";

type Theme = "dark" | "light";

const AnatomyViewer = dynamic(
  () => import("./AnatomyViewer").then((module) => module.AnatomyViewer),
  {
    ssr: false,
    loading: () => (
      <div className="viewer-module-loading" role="status">
        <span aria-hidden="true" />
      </div>
    ),
  },
);

const STORAGE = {
  language: "open-anatomy-language",
  theme: "open-anatomy-theme",
  favorites: "open-anatomy-favorites",
  visited: "open-anatomy-visited",
};

const readStoredList = (key: string) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const normalizeStructureName = (name: string) =>
  name
    .replace(/^(VIS|VH|VHM|VHF)[_-]*/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function AnatomyStudio() {
  const [lang, setLang] = useState<Language>("zh");
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeId, setActiveId] = useState("heart");
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState<BodySystem | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [sectionMode, setSectionMode] = useState(false);
  const [sectionDepth, setSectionDepth] = useState(0);
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>("aorta");
  const [resetSignal, setResetSignal] = useState(0);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const activeOrgan = organById[activeId] ?? organs[0];
  const ui = copy[lang];
  const selectedHotspot =
    activeOrgan.hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ??
    activeOrgan.hotspots[0];

  const selectOrgan = useCallback((id: string) => {
    const nextOrgan = organById[id];
    if (!nextOrgan) return;

    setActiveId(id);
    setSelectedStructure(null);
    setSelectedHotspotId(nextOrgan.hotspots[0]?.id ?? null);
    setSectionDepth(0);
    setAnswer(null);
    setChecked(false);
    setVisited((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      window.localStorage.setItem(STORAGE.visited, JSON.stringify(next));
      return next;
    });

  }, []);

  const selectRelative = useCallback((direction: number) => {
    const index = organs.findIndex((organ) => organ.id === activeId);
    const next = (index + direction + organs.length) % organs.length;
    selectOrgan(organs[next].id);
  }, [activeId, selectOrgan]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedLanguage = window.localStorage.getItem(STORAGE.language);
      const storedTheme = window.localStorage.getItem(STORAGE.theme);
      setLang(storedLanguage === "en" ? "en" : "zh");
      setTheme(storedTheme === "light" ? "light" : "dark");
      setFavorites(readStoredList(STORAGE.favorites));
      const storedVisited = readStoredList(STORAGE.visited);
      setVisited(storedVisited.includes("heart") ? storedVisited : [...storedVisited, "heart"]);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setAutoRotate(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(STORAGE.theme, theme);
    window.localStorage.setItem(STORAGE.language, lang);
  }, [lang, theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a")) return;

      if (event.key === " ") {
        event.preventDefault();
        setAutoRotate((value) => !value);
      }
      if (event.key.toLowerCase() === "j") selectRelative(1);
      if (event.key.toLowerCase() === "k") selectRelative(-1);
      if (event.key === "Escape") {
        setQuizOpen(false);
        setSourcesOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectRelative]);

  const visibleOrgans = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return organs.filter((organ) => {
      const text = [
        organ.name.zh,
        organ.name.en,
        organ.latin,
        systems[organ.system].zh,
        systems[organ.system].en,
      ]
        .join(" ")
        .toLocaleLowerCase();
      const matchesSearch = !normalized || text.includes(normalized);
      const matchesSystem = systemFilter === "all" || organ.system === systemFilter;
      const matchesFavorite = !favoritesOnly || favorites.includes(organ.id);
      return matchesSearch && matchesSystem && matchesFavorite;
    });
  }, [favorites, favoritesOnly, query, systemFilter]);

  const toggleFavorite = () => {
    setFavorites((current) => {
      const next = current.includes(activeId)
        ? current.filter((id) => id !== activeId)
        : [...current, activeId];
      window.localStorage.setItem(STORAGE.favorites, JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = favorites.includes(activeId);
  const activeIndex = organs.findIndex((organ) => organ.id === activeId);
  const nextModel = organs[(activeIndex + 1) % organs.length]?.model;

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <a className="brand" href="#explorer" aria-label={ui.brandName}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            <small>{ui.brandKicker}</small>
            <strong>{ui.brandName}</strong>
          </span>
        </a>

        <nav aria-label="Primary">
          <a className="active" href="#explorer">{ui.explore}</a>
          <a href="#library">{ui.library}</a>
          <a href="#learning">{ui.progress}</a>
        </nav>

        <div className="header-actions">
          <button className="text-action" type="button" onClick={() => setSourcesOpen(true)}>
            <BookOpenText size={17} weight="duotone" />
            <span>{ui.sources}</span>
          </button>
          <button
            className="icon-action"
            type="button"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            aria-label={ui.language}
            title={ui.language}
          >
            <GlobeHemisphereWest size={18} />
            <span>{lang === "zh" ? "EN" : "中"}</span>
          </button>
          <button
            className="icon-action"
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={ui.theme}
            title={ui.theme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <section className="explorer" id="explorer">
        <aside className="library-panel" id="library" aria-label={ui.library}>
          <div className="panel-heading">
            <div>
              <small>{ui.library}</small>
              <h2>{lang === "zh" ? "从系统进入人体" : "Enter through a system"}</h2>
            </div>
            <span className="count-badge">{organs.length}</span>
          </div>

          <label className="search-field">
            <MagnifyingGlass size={17} aria-hidden="true" />
            <span className="sr-only">{ui.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui.search}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={ui.close}>
                <X size={14} />
              </button>
            )}
          </label>

          <div className="system-filter" role="list" aria-label={lang === "zh" ? "按系统筛选" : "Filter by system"}>
            <button
              type="button"
              className={systemFilter === "all" && !favoritesOnly ? "active" : ""}
              onClick={() => {
                setSystemFilter("all");
                setFavoritesOnly(false);
              }}
            >
              {ui.allSystems}
            </button>
            {Object.entries(systems).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={systemFilter === id && !favoritesOnly ? "active" : ""}
                onClick={() => {
                  setSystemFilter(id as BodySystem);
                  setFavoritesOnly(false);
                }}
              >
                {localize(label, lang)}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`favorites-filter ${favoritesOnly ? "active" : ""}`}
            onClick={() => setFavoritesOnly((value) => !value)}
          >
            <BookmarkSimple size={16} weight={favoritesOnly ? "fill" : "regular"} />
            {ui.favorites}
            <span>{favorites.length}</span>
          </button>

          <div className="organ-list">
            {visibleOrgans.map((organ, index) => (
              <button
                key={organ.id}
                type="button"
                className={`organ-row ${activeId === organ.id ? "active" : ""}`}
                onClick={() => selectOrgan(organ.id)}
                style={{ "--organ-accent": organ.accent } as React.CSSProperties}
                aria-current={activeId === organ.id ? "true" : undefined}
              >
                <span className="organ-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="organ-swatch" aria-hidden="true"><Cube size={18} weight="duotone" /></span>
                <span className="organ-copy">
                  <strong>{localize(organ.name, lang)}</strong>
                  <small>{localize(systems[organ.system], lang)}</small>
                </span>
                {favorites.includes(organ.id) && <BookmarkSimple className="saved-icon" size={14} weight="fill" />}
              </button>
            ))}
            {!visibleOrgans.length && (
              <div className="empty-library">
                <CircleNotch size={22} />
                <p>{favoritesOnly && !favorites.length ? ui.favoritesEmpty : ui.noResults}</p>
              </div>
            )}
          </div>
        </aside>

        <section className="viewer-panel" aria-label={ui.modelStage}>
          <div className="viewer-titlebar">
            <div>
              <span>{ui.modelStage} / {localize(systems[activeOrgan.system], lang)}</span>
              <h1>{localize(activeOrgan.name, lang)}</h1>
              <em>{activeOrgan.latin}</em>
            </div>
            <button
              type="button"
              className={`favorite-button ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
              aria-label={isFavorite ? ui.favoriteRemove : ui.favoriteAdd}
              title={isFavorite ? ui.favoriteRemove : ui.favoriteAdd}
            >
              <BookmarkSimple size={20} weight={isFavorite ? "fill" : "regular"} />
            </button>
          </div>

          <div className="viewer-canvas" style={{ "--organ-accent": activeOrgan.accent } as React.CSSProperties}>
            <div className="viewer-orbit" aria-hidden="true" />
            <AnatomyViewer
              organ={activeOrgan}
              nextModel={nextModel}
              lang={lang}
              autoRotate={autoRotate}
              showLabels={showLabels}
              sectionMode={sectionMode}
              sectionDepth={sectionDepth}
              selectedStructure={selectedStructure}
              onSelectStructure={setSelectedStructure}
              onSelectHotspot={(id) => {
                setSelectedHotspotId(id);
                setSelectedStructure(null);
              }}
              resetSignal={resetSignal}
              loadingLabel={ui.loading}
            />

            <div className="viewer-instructions"><Info size={14} /> {ui.dragHint}</div>
            <div className="viewer-readout">
              <span>{ui.currentOrgan}</span>
              <strong>{String(organs.findIndex((organ) => organ.id === activeId) + 1).padStart(2, "0")}</strong>
              <small>/ {String(organs.length).padStart(2, "0")}</small>
            </div>
          </div>

          <div className="viewer-controls">
            <button type="button" className={autoRotate ? "active" : ""} onClick={() => setAutoRotate((value) => !value)}>
              {autoRotate ? <Pause size={16} /> : <Play size={16} />}
              {ui.rotate}
            </button>
            <button type="button" className={showLabels ? "active" : ""} onClick={() => setShowLabels((value) => !value)}>
              <Tag size={16} />
              {ui.labels}
            </button>
            <button type="button" className={sectionMode ? "active" : ""} onClick={() => setSectionMode((value) => !value)}>
              <Scissors size={16} />
              {ui.section}
            </button>
            <button type="button" onClick={() => setResetSignal((value) => value + 1)}>
              <Cube size={16} />
              {ui.reset}
            </button>
            {selectedStructure && (
              <button type="button" onClick={() => setSelectedStructure(null)}>
                <X size={16} />
                {ui.clearFocus}
              </button>
            )}
          </div>

          {sectionMode && (
            <label className="section-slider">
              <span>{ui.sectionDepth}</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.02"
                value={sectionDepth}
                onChange={(event) => setSectionDepth(Number(event.target.value))}
              />
              <output>{sectionDepth.toFixed(2)}</output>
            </label>
          )}
        </section>

        <aside className="info-panel" aria-label={ui.overview}>
          <div className="info-status">
            <span style={{ background: activeOrgan.accent }} aria-hidden="true" />
            {localize(systems[activeOrgan.system], lang)}
            <small>HRA · CC BY 4.0</small>
          </div>

          <div className="info-intro">
            <small>{ui.overview}</small>
            <p>{localize(activeOrgan.summary, lang)}</p>
            <blockquote>{localize(activeOrgan.role, lang)}</blockquote>
          </div>

          <section className="focus-card">
            <div className="section-label">
              <span>{ui.selectedStructure}</span>
              <Cube size={15} />
            </div>
            {selectedStructure ? (
              <div className="model-structure">
                <strong>{normalizeStructureName(selectedStructure)}</strong>
                <small>{lang === "zh" ? "来自模型的语义对象名称" : "Semantic object name from the model"}</small>
              </div>
            ) : selectedHotspot ? (
              <div className="hotspot-detail">
                <strong>{localize(selectedHotspot.name, lang)}</strong>
                <p>{localize(selectedHotspot.detail, lang)}</p>
              </div>
            ) : (
              <p className="muted-copy">{ui.selectStructure}</p>
            )}
            <div className="hotspot-tabs" aria-label={ui.labels}>
              {activeOrgan.hotspots.map((hotspot, index) => (
                <button
                  key={hotspot.id}
                  type="button"
                  className={!selectedStructure && selectedHotspotId === hotspot.id ? "active" : ""}
                  onClick={() => {
                    setSelectedStructure(null);
                    setSelectedHotspotId(hotspot.id);
                  }}
                  aria-label={localize(hotspot.name, lang)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>

          <section className="fact-section">
            <div className="section-label"><span>{ui.keyFacts}</span><Flask size={15} /></div>
            <dl>
              {activeOrgan.facts.map((fact) => (
                <div key={fact.label.en}>
                  <dt>{localize(fact.label, lang)}</dt>
                  <dd>{localize(fact.value, lang)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="function-section">
            <div className="section-label"><span>{ui.functions}</span><CheckCircle size={15} /></div>
            <ul>
              {activeOrgan.functions.map((item, index) => (
                <li key={item.en}><span>{String(index + 1).padStart(2, "0")}</span>{localize(item, lang)}</li>
              ))}
            </ul>
          </section>

          <button type="button" className="quiz-button" onClick={() => setQuizOpen(true)}>
            <span><Flask size={18} weight="duotone" />{ui.openQuiz}</span>
            <span aria-hidden="true">↗</span>
          </button>

          <p className="source-note"><Info size={14} /> {ui.sourceNote}</p>
        </aside>
      </section>

      <section className="learning-band" id="learning">
        <div>
          <small>{ui.progress}</small>
          <strong>{visited.length} {ui.of} {organs.length}</strong>
        </div>
        <div className="progress-track" aria-label={`${visited.length} ${ui.of} ${organs.length}`}>
          <span style={{ width: `${(visited.length / organs.length) * 100}%` }} />
        </div>
        <p><Keyboard size={17} /> {ui.keyboard}</p>
        <button type="button" onClick={() => setSourcesOpen(true)}>{ui.sources}<ArrowSquareOut size={16} /></button>
      </section>

      <footer>
        <p>{ui.attribution}</p>
        <p>{ui.educational}</p>
      </footer>

      {sourcesOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSourcesOpen(false)}>
          <aside
            className="source-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="source-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <small>{ui.sources}</small>
                <h2 id="source-title">{ui.sourceTitle}</h2>
                <p>{ui.sourceLead}</p>
              </div>
              <button type="button" onClick={() => setSourcesOpen(false)} aria-label={ui.close}><X size={20} /></button>
            </div>

            <div className="license-matrix">
              <div><small>{ui.modelLicense}</small><strong>CC BY 4.0</strong><p>{ui.modelLicenseText}</p></div>
              <div><small>{ui.codeLicense}</small><strong>MIT</strong><p>{ui.codeLicenseText}</p></div>
              <div><small>{ui.contentLicense}</small><strong>{lang === "zh" ? "教育摘要" : "Educational summary"}</strong><p>{ui.contentLicenseText}</p></div>
            </div>

            <div className="source-list">
              {anatomySources.map((source, index) => (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{localize(source.title, lang)}</strong><p>{localize(source.detail, lang)}</p></div>
                  <ArrowSquareOut size={18} />
                </a>
              ))}
            </div>
          </aside>
        </div>
      )}

      {quizOpen && (
        <div className="modal-backdrop centered" role="presentation" onMouseDown={() => setQuizOpen(false)}>
          <section
            className="quiz-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <small>{localize(activeOrgan.name, lang)} / {ui.quiz}</small>
                <h2 id="quiz-title">{localize(activeOrgan.quiz.question, lang)}</h2>
                <p>{ui.quizHint}</p>
              </div>
              <button type="button" onClick={() => setQuizOpen(false)} aria-label={ui.close}><X size={20} /></button>
            </div>
            <div className="quiz-options">
              {activeOrgan.quiz.options.map((option, index) => {
                const isCorrect = index === activeOrgan.quiz.answer;
                const state = checked && isCorrect ? "correct" : checked && answer === index ? "wrong" : answer === index ? "selected" : "";
                return (
                  <button key={option.en} type="button" className={state} onClick={() => !checked && setAnswer(index)}>
                    <span>{String.fromCharCode(65 + index)}</span>
                    {localize(option, lang)}
                    {checked && isCorrect && <CheckCircle size={18} weight="fill" />}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div className={`quiz-feedback ${answer === activeOrgan.quiz.answer ? "correct" : "wrong"}`}>
                <strong>{answer === activeOrgan.quiz.answer ? ui.correct : ui.incorrect}</strong>
                <p>{localize(activeOrgan.quiz.explanation, lang)}</p>
              </div>
            )}
            <div className="quiz-actions">
              {!checked ? (
                <button type="button" className="primary" disabled={answer === null} onClick={() => setChecked(true)}>{ui.check}</button>
              ) : (
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    selectRelative(1);
                    setQuizOpen(false);
                  }}
                >
                  {ui.nextOrgan}
                </button>
              )}
              <button type="button" onClick={() => setQuizOpen(false)}>{ui.close}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
