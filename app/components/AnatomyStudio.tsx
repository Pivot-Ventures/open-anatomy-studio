"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowSquareOut,
  ArrowsOut,
  ArrowsIn,
  BookOpenText,
  BookmarkSimple,
  Camera,
  CheckCircle,
  CircleNotch,
  Cube,
  Eye,
  EyeSlash,
  Flask,
  Info,
  Keyboard,
  ListBullets,
  MagnifyingGlass,
  Moon,
  Minus,
  Palette,
  Pause,
  Play,
  Plus,
  Scissors,
  Sparkle,
  Sun,
  ArrowClockwise,
  ImageSquare,
  Tag,
  Target,
  TextAa,
  X,
} from "@phosphor-icons/react";
import {
  anatomySources,
  organById,
  organs,
  systems,
  type BodySystem,
  type Hotspot,
} from "../lib/anatomy";
import { copy } from "../lib/copy";
import { lessonByOrganId, type LearningActivity } from "../lib/learning";
import { describeStructure, structureGroupKey } from "../lib/structures";
import { cachedReference, requestAiReference, type AiReference } from "../lib/ai-reference";
import type { MaterialMode, SectionAxis } from "./AnatomyViewer";

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
  theme: "human-atlas-theme",
  favorites: "human-atlas-favorites",
  visited: "human-atlas-visited",
  material: "human-atlas-material",
};

const readStoredList = (key: string) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const ui = copy;

type StructureGroup = {
  key: string;
  label: string;
  meaning?: string;
  names: string[];
};

export function AnatomyStudio() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeId, setActiveId] = useState("heart");
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState<BodySystem | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>(["heart"]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [sectionMode, setSectionMode] = useState(false);
  const [sectionAxis, setSectionAxis] = useState<SectionAxis>("x");
  const [sectionDepth, setSectionDepth] = useState(0);
  const [explodeMode, setExplodeMode] = useState(false);
  const [explode, setExplode] = useState(0);
  const [materialMode, setMaterialMode] = useState<MaterialMode>("realistic");
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [hiddenStructures, setHiddenStructures] = useState<string[]>([]);
  const [structures, setStructures] = useState<string[]>([]);
  const [structureFilter, setStructureFilter] = useState("");
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>("ventricle");
  const [resetSignal, setResetSignal] = useState(0);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [snapshotNotice, setSnapshotNotice] = useState(false);
  const [aiReference, setAiReference] = useState<AiReference | null>(null);
  const [aiTarget, setAiTarget] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const captureRef = useRef<(() => string | null) | null>(null);
  const viewerPanelRef = useRef<HTMLElement>(null);

  const activeOrgan = organById[activeId] ?? organs[0];
  const activeLesson = lessonByOrganId[activeId] ?? null;
  const lessonCompletedCount = activeLesson
    ? activeLesson.activities.filter((activity) => completedActivityIds.includes(activity.id)).length
    : 0;
  const nextActivityId = activeLesson?.activities.find(
    (activity) => !completedActivityIds.includes(activity.id),
  )?.id;

  const resolveStructure = useCallback(
    (target: string | undefined) => {
      if (!target) return null;
      return structures.find((name) => name === target)
        ?? structures.find((name) => name.startsWith(target))
        ?? structures.find((name) => name.toLowerCase().includes(target.toLowerCase()))
        ?? null;
    },
    [structures],
  );

  const handleStructuresLoaded = useCallback((names: string[]) => {
    setStructures((current) => (
      current.length === names.length && current.every((name, index) => name === names[index]) ? current : names
    ));
  }, []);

  const completeActivity = useCallback((id: string) => {
    setCompletedActivityIds((current) => current.includes(id) ? current : [...current, id]);
  }, []);

  const selectHotspot = useCallback((id: string) => {
    const hotspot = activeOrgan.hotspots.find((candidate) => candidate.id === id);
    setSelectedHotspotId(id);
    setSelectedStructure(hotspot?.mesh ? resolveStructure(hotspot.mesh) : null);
    activeLesson?.activities.forEach((activity) => {
      if (activity.kind === "locate" && activity.targetHotspotId === id) completeActivity(activity.id);
    });
  }, [activeLesson, activeOrgan.hotspots, completeActivity, resolveStructure]);

  const selectOrgan = useCallback((id: string) => {
    const nextOrgan = organById[id];
    if (!nextOrgan) return;
    setActiveId(id);
    setSelectedStructure(null);
    setHiddenStructures([]);
    setStructures([]);
    setStructureFilter("");
    setSelectedHotspotId(nextOrgan.hotspots[0]?.id ?? null);
    setSectionDepth(0);
    setExplode(0);
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

  const requestReference = useCallback(async (structureName: string | null, force = false) => {
    const info = structureName ? describeStructure(structureName) : null;
    // "Heart left ventricle" reads as "Left ventricle" once the organ is named.
    const organPrefix = new RegExp(`^${activeOrgan.name.split(" ")[0]}\\s+`, "i");
    const structure = info
      ? { name: info.label.replace(organPrefix, (match) => (info.label.length > match.length + 2 ? "" : match)).replace(/^[a-z]/, (c) => c.toUpperCase()), meaning: info.meaning }
      : null;
    setAiTarget(structure?.name ?? null);
    const cached = cachedReference(activeOrgan, structure?.name);
    if (cached && !force) {
      setAiReference(cached);
      return;
    }
    setAiReference({ status: "loading" });
    const result = await requestAiReference(activeOrgan, structure, { force });
    setAiReference(result);
  }, [activeOrgan]);

  // Realistic tissue mode also asks EASI for the AI reference image of the
  // organ. Cached results return instantly; a fresh render costs one call.
  useEffect(() => {
    if (materialMode !== "realistic") return;
    let active = true;
    // Resolve through the request helper (async) so React never sees a
    // synchronous state update inside the effect body.
    const run = async () => {
      const cached = cachedReference(activeOrgan, null);
      if (!active) return;
      setAiTarget(null);
      if (cached) {
        setAiReference(cached);
        return;
      }
      setAiReference({ status: "loading" });
      const result = await requestAiReference(activeOrgan, null);
      if (active) setAiReference(result);
    };
    void run();
    return () => {
      active = false;
    };
  }, [activeOrgan, materialMode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedTheme = window.localStorage.getItem(STORAGE.theme);
      const storedMaterial = window.localStorage.getItem(STORAGE.material);
      setTheme(storedTheme === "light" ? "light" : "dark");
      setMaterialMode(storedMaterial === "schematic" ? "schematic" : "realistic");
      setFavorites(readStoredList(STORAGE.favorites));
      const storedVisited = readStoredList(STORAGE.visited);
      setVisited(storedVisited.includes("heart") ? storedVisited : [...storedVisited, "heart"]);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAutoRotate(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = "en";
    window.localStorage.setItem(STORAGE.theme, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.material, materialMode);
  }, [materialMode]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a")) return;
      const key = event.key.toLowerCase();
      if (event.key === " ") {
        event.preventDefault();
        setAutoRotate((value) => !value);
      }
      if (key === "j") selectRelative(1);
      if (key === "k") selectRelative(-1);
      if (key === "l") setShowLabels((value) => !value);
      if (key === "s") setSectionMode((value) => !value);
      if (key === "e") setExplodeMode((value) => !value);
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
        organ.name,
        organ.latin,
        systems[organ.system],
        ...organ.hotspots.map((hotspot) => hotspot.name),
        ...organ.terms.map((term) => term.term),
      ]
        .join(" ")
        .toLocaleLowerCase();
      const matchesSearch = !normalized || text.includes(normalized);
      const matchesSystem = systemFilter === "all" || organ.system === systemFilter;
      const matchesFavorite = !favoritesOnly || favorites.includes(organ.id);
      return matchesSearch && matchesSystem && matchesFavorite;
    });
  }, [favorites, favoritesOnly, query, systemFilter]);

  const structureGroups = useMemo<StructureGroup[]>(() => {
    const groups = new Map<string, StructureGroup>();
    structures.forEach((name) => {
      const key = structureGroupKey(name);
      const existing = groups.get(key);
      if (existing) {
        existing.names.push(name);
        return;
      }
      const info = describeStructure(name);
      groups.set(key, { key, label: key, meaning: info.meaning, names: [name] });
    });
    const filter = structureFilter.trim().toLowerCase();
    return [...groups.values()]
      .filter((group) => !filter || group.label.toLowerCase().includes(filter) || group.meaning?.toLowerCase().includes(filter))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [structureFilter, structures]);

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

  const updateSectionDepth = (value: number) => {
    setSectionDepth(value);
    if (!activeLesson || !sectionMode) return;
    activeLesson.activities.forEach((activity) => {
      if (activity.kind === "section" && Math.abs(value) >= activity.minimumDepth) completeActivity(activity.id);
    });
  };

  const updateExplode = (value: number) => {
    setExplode(value);
    if (!activeLesson) return;
    activeLesson.activities.forEach((activity) => {
      if (activity.kind === "explode" && value >= activity.minimumAmount) completeActivity(activity.id);
    });
  };

  const activateGuidedActivity = (activity: LearningActivity) => {
    if (activity.kind === "locate") {
      setShowLabels(true);
      setSelectedStructure(null);
      setSelectedHotspotId(null);
    }
    if (activity.kind === "section") {
      setSectionMode(true);
      setAutoRotate(false);
    }
    if (activity.kind === "explode") {
      setExplodeMode(true);
      setAutoRotate(false);
    }
    if (activity.kind === "quiz") setQuizOpen(true);
    if (activity.kind !== "quiz") {
      window.requestAnimationFrame(() => {
        viewerPanelRef.current?.scrollIntoView({ block: "start" });
      });
    }
  };

  const toggleGroupVisibility = (group: StructureGroup) => {
    setHiddenStructures((current) => {
      const allHidden = group.names.every((name) => current.includes(name));
      if (allHidden) return current.filter((name) => !group.names.includes(name));
      return [...new Set([...current, ...group.names])];
    });
  };

  const isolateGroup = (group: StructureGroup) => {
    setHiddenStructures(structures.filter((name) => !group.names.includes(name)));
    setSelectedStructure(group.names[0] ?? null);
  };

  const saveSnapshot = () => {
    const data = captureRef.current?.();
    if (!data) return;
    const link = document.createElement("a");
    link.href = data;
    link.download = `${activeOrgan.id}-human-atlas.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setSnapshotNotice(true);
    window.setTimeout(() => setSnapshotNotice(false), 1800);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void viewerPanelRef.current?.requestFullscreen?.();
  };

  const aiBusy = aiReference?.status === "loading";
  const selectedInfo = selectedStructure ? describeStructure(selectedStructure) : null;
  const hotspotForStructure: Hotspot | undefined = selectedStructure
    ? activeOrgan.hotspots.find((hotspot) => hotspot.mesh && resolveStructure(hotspot.mesh) === selectedStructure)
    : undefined;
  const selectedHotspot =
    activeOrgan.hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? activeOrgan.hotspots[0];

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
          <button className="text-action" type="button" onClick={() => setSourcesOpen(true)} aria-label={ui.sources} title={ui.sources}>
            <BookOpenText size={17} weight="duotone" />
            <span>{ui.sources}</span>
          </button>
          <button className="icon-action" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={ui.theme} title={ui.theme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <nav className="mobile-nav" aria-label={ui.mobileNavigation}>
        <a href="#explorer"><Flask size={18} weight="duotone" /><span>{ui.explore}</span></a>
        <a href="#library"><BookOpenText size={18} weight="duotone" /><span>{ui.library}</span></a>
        <a href="#learning"><CheckCircle size={18} weight="duotone" /><span>{ui.progress}</span></a>
      </nav>

      <section className="explorer" id="explorer">
        <aside className="library-panel" id="library" aria-label={ui.library}>
          <div className="panel-heading">
            <div>
              <small>{ui.library}</small>
              <h2>{ui.enterThrough}</h2>
            </div>
            <span className="count-badge">{organs.length}</span>
          </div>

          <label className="search-field">
            <MagnifyingGlass size={17} aria-hidden="true" />
            <span className="sr-only">{ui.search}</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ui.search} />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={ui.close}>
                <X size={14} />
              </button>
            )}
          </label>

          <div className="system-filter" role="list" aria-label={ui.filterBySystem}>
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
                {label}
              </button>
            ))}
          </div>

          <button type="button" className={`favorites-filter ${favoritesOnly ? "active" : ""}`} onClick={() => setFavoritesOnly((value) => !value)}>
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
                  <strong>{organ.name}</strong>
                  <small>{systems[organ.system]}</small>
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

        <section className="viewer-panel" aria-label={ui.modelStage} ref={viewerPanelRef}>
          <div className="viewer-titlebar">
            <div>
              <span>{ui.modelStage} / {systems[activeOrgan.system]}</span>
              <h1>{activeOrgan.name}</h1>
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
            <AnatomyViewer
              organ={activeOrgan}
              nextModel={nextModel}
              autoRotate={autoRotate}
              showLabels={showLabels}
              sectionMode={sectionMode}
              sectionAxis={sectionAxis}
              sectionDepth={sectionDepth}
              explode={explodeMode ? explode : 0}
              materialMode={materialMode}
              selectedStructure={selectedStructure}
              hiddenStructures={hiddenStructures}
              onSelectStructure={setSelectedStructure}
              onSelectHotspot={selectHotspot}
              onStructuresLoaded={handleStructuresLoaded}
              resetSignal={resetSignal}
              captureRef={captureRef}
              loadingLabel={ui.loading}
              errorLabel={ui.modelError}
              webglFallbackLabel={ui.webglFallback}
              contextLostTitle={ui.contextLostTitle}
              contextLostDetail={ui.contextLostDetail}
              contextLostAction={ui.contextLostAction}
            />

            <div className="viewer-instructions"><Info size={14} /> {ui.dragHint}</div>
            <div className="viewer-readout">
              <span>{ui.currentOrgan}</span>
              <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
              <small>/ {String(organs.length).padStart(2, "0")}</small>
            </div>
            {snapshotNotice && <div className="viewer-toast" role="status"><Camera size={14} /> {ui.snapshotDone}</div>}
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
            <button type="button" className={explodeMode ? "active" : ""} onClick={() => setExplodeMode((value) => !value)}>
              <ArrowsOut size={16} />
              {ui.explode}
            </button>
            <button
              type="button"
              className={materialMode === "schematic" ? "active" : ""}
              onClick={() => setMaterialMode((value) => value === "realistic" ? "schematic" : "realistic")}
              title={ui.materialHint}
            >
              {materialMode === "realistic" ? <Sparkle size={16} /> : <Palette size={16} />}
              {materialMode === "realistic" ? ui.materialRealistic : ui.materialSchematic}
            </button>
            <button type="button" onClick={() => setResetSignal((value) => value + 1)}>
              <Cube size={16} />
              {ui.reset}
            </button>
            <button type="button" onClick={saveSnapshot}>
              <Camera size={16} />
              {ui.snapshot}
            </button>
            <button type="button" onClick={toggleFullscreen}>
              {isFullscreen ? <ArrowsIn size={16} /> : <ArrowsOut size={16} weight="bold" />}
              {isFullscreen ? ui.exitFullscreen : ui.fullscreen}
            </button>
            {(selectedStructure || hiddenStructures.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedStructure(null);
                  setHiddenStructures([]);
                }}
              >
                <X size={16} />
                {ui.clearFocus}
              </button>
            )}
          </div>

          {sectionMode && (
            <div className="section-slider">
              <span>{ui.sectionDepth}</span>
              <button type="button" onClick={() => updateSectionDepth(Math.max(-1, Number((sectionDepth - 0.1).toFixed(2))))} aria-label={ui.sectionDecrease}>
                <Minus size={14} />
              </button>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.02"
                value={sectionDepth}
                aria-label={ui.sectionDepth}
                onInput={(event) => updateSectionDepth(Number(event.currentTarget.value))}
              />
              <button type="button" onClick={() => updateSectionDepth(Math.min(1, Number((sectionDepth + 0.1).toFixed(2))))} aria-label={ui.sectionIncrease}>
                <Plus size={14} />
              </button>
              <output>{sectionDepth.toFixed(2)}</output>
              <div className="axis-toggle" role="group" aria-label={ui.sectionAxis}>
                {(["x", "y", "z"] as SectionAxis[]).map((axis) => (
                  <button
                    key={axis}
                    type="button"
                    className={sectionAxis === axis ? "active" : ""}
                    onClick={() => setSectionAxis(axis)}
                    title={axis === "x" ? ui.axisX : axis === "y" ? ui.axisY : ui.axisZ}
                  >
                    {axis.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {explodeMode && (
            <div className="section-slider explode-slider">
              <span>{ui.explodeAmount}</span>
              <button type="button" onClick={() => updateExplode(Math.max(0, Number((explode - 0.1).toFixed(2))))} aria-label={ui.explodeDecrease}>
                <Minus size={14} />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={explode}
                aria-label={ui.explodeAmount}
                onInput={(event) => updateExplode(Number(event.currentTarget.value))}
              />
              <button type="button" onClick={() => updateExplode(Math.min(1, Number((explode + 0.1).toFixed(2))))} aria-label={ui.explodeIncrease}>
                <Plus size={14} />
              </button>
              <output>{explode.toFixed(2)}</output>
            </div>
          )}
        </section>

        <aside className="info-panel" aria-label={ui.overview}>
          <div className="info-status">
            <span style={{ background: activeOrgan.accent }} aria-hidden="true" />
            {systems[activeOrgan.system]}
            <small>{activeOrgan.modelSource === "local" ? ui.localModel : activeOrgan.modelSource === "bp3d" ? "BodyParts3D · CC BY 4.0" : "HRA · CC BY 4.0"}</small>
          </div>

          <section className="ai-reference" aria-labelledby="ai-reference-title">
            <div className="section-label">
              <span>{ui.aiReference}</span>
              <ImageSquare size={15} />
            </div>
            <div className="ai-reference-heading">
              <div>
                <small>{ui.aiReferenceKicker}</small>
                <h3 id="ai-reference-title">{aiTarget ? `${activeOrgan.name}: ${aiTarget}` : activeOrgan.name}</h3>
              </div>
              {aiReference?.status === "ready" && (
                <button type="button" onClick={() => requestReference(aiTarget ? selectedStructure : null, true)} aria-label={ui.aiReferenceRegenerate} title={ui.aiReferenceRegenerate}>
                  <ArrowClockwise size={15} />
                </button>
              )}
            </div>
            {aiReference?.status === "ready" ? (
              <figure className="ai-reference-figure">
                <a href={aiReference.url} target="_blank" rel="noreferrer" title={ui.aiReferenceOpen}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- served by the EASI API, not a static asset */}
                  <img src={aiReference.url} alt={`${ui.aiReferenceAlt} ${aiTarget ? `${aiTarget} of the ${activeOrgan.name.toLowerCase()}` : `the ${activeOrgan.name.toLowerCase()}`}`} loading="lazy" />
                </a>
                <figcaption>
                  <span>{aiReference.cached ? ui.aiReferenceCached : ui.aiReferenceFresh} · {aiReference.model || aiReference.provider}{aiReference.promptSource === "text-model" ? " · prompt by gpt-oss" : ""}</span>
                  {aiReference.prompt && (
                    <details>
                      <summary>{ui.aiReferencePrompt}</summary>
                      <p>{aiReference.prompt}</p>
                    </details>
                  )}
                </figcaption>
              </figure>
            ) : aiReference?.status === "loading" ? (
              <div className="ai-reference-state loading" role="status">
                <CircleNotch size={18} />
                <p>{ui.aiReferenceLoading}</p>
              </div>
            ) : aiReference?.status === "signin" ? (
              <div className="ai-reference-state"><p>{ui.aiReferenceSignin}</p></div>
            ) : aiReference?.status === "unavailable" ? (
              <div className="ai-reference-state"><p>{aiReference.reason}</p></div>
            ) : (
              <p className="muted-copy">{ui.aiReferenceLead}</p>
            )}
            <div className="ai-reference-actions">
              {(!aiReference || aiReference.status === "unavailable" || (aiReference.status === "ready" && aiTarget)) && (
                <button type="button" onClick={() => requestReference(null)} disabled={aiBusy}>
                  <Sparkle size={15} />
                  {ui.aiReferenceGenerate}
                </button>
              )}
              {selectedStructure && selectedInfo && aiTarget !== selectedInfo.label && (
                <button type="button" onClick={() => requestReference(selectedStructure)} disabled={aiBusy}>
                  <Target size={15} />
                  {ui.aiReferenceStructure}
                </button>
              )}
            </div>
            {aiReference && aiReference.status !== "loading" && <p className="ai-reference-note">{ui.aiReferenceLead}</p>}
          </section>

          <div className="info-intro">
            <small>{ui.overview}</small>
            <p>{activeOrgan.summary}</p>
            <blockquote>{activeOrgan.role}</blockquote>
            {activeOrgan.modelScope && (
              <div className="model-scope-note">
                <strong>{ui.modelScope}</strong>
                <span>{activeOrgan.modelScope}</span>
              </div>
            )}
          </div>

          {activeLesson && (
            <section className="guided-lesson" aria-labelledby="guided-lesson-title">
              <div className="section-label">
                <span>{ui.guidedLesson}</span>
                <BookOpenText size={15} />
              </div>
              <div className="guided-lesson-heading">
                <div>
                  <small>{activeLesson.durationMinutes} minute {ui.guidedLessonKicker.toLowerCase()}</small>
                  <h3 id="guided-lesson-title">{activeLesson.title}</h3>
                </div>
                <output aria-live="polite">{lessonCompletedCount}/{activeLesson.activities.length}</output>
              </div>
              <p>{activeLesson.objective}</p>
              <div
                className="guided-progress"
                role="progressbar"
                aria-label={ui.lessonProgress}
                aria-valuemin={0}
                aria-valuemax={activeLesson.activities.length}
                aria-valuenow={lessonCompletedCount}
              >
                <span style={{ width: `${(lessonCompletedCount / activeLesson.activities.length) * 100}%` }} />
              </div>
              <ol className="guided-steps">
                {activeLesson.activities.map((activity, index) => {
                  const done = completedActivityIds.includes(activity.id);
                  const current = nextActivityId === activity.id;
                  return (
                    <li key={activity.id} className={done ? "done" : current ? "current" : ""}>
                      <span className="guided-step-index" aria-hidden="true">
                        {done ? <CheckCircle size={15} weight="fill" /> : index + 1}
                      </span>
                      <div>
                        <strong>{activity.title}</strong>
                        <p>{done ? activity.success : activity.instruction}</p>
                      </div>
                      {!done && (
                        <button type="button" onClick={() => activateGuidedActivity(activity)}>{ui.lessonAction}</button>
                      )}
                    </li>
                  );
                })}
              </ol>
              {lessonCompletedCount === activeLesson.activities.length && (
                <p className="guided-complete" role="status">
                  <CheckCircle size={16} weight="fill" /> {ui.lessonComplete}
                </p>
              )}
            </section>
          )}

          <section className="focus-card">
            <div className="section-label">
              <span>{ui.selectedStructure}</span>
              <Target size={15} />
            </div>
            {selectedStructure && selectedInfo ? (
              <div className="model-structure">
                <strong>{hotspotForStructure?.name ?? selectedInfo.label}</strong>
                <p>{hotspotForStructure?.detail ?? selectedInfo.meaning ?? ui.structureMeaningFallback}</p>
                {hotspotForStructure && selectedInfo.meaning && hotspotForStructure.detail !== selectedInfo.meaning && (
                  <p className="structure-extra">{selectedInfo.meaning}</p>
                )}
                <small>{ui.semanticName}: <code>{selectedStructure}</code></small>
              </div>
            ) : selectedHotspot ? (
              <div className="hotspot-detail">
                <strong>{selectedHotspot.name}</strong>
                <p>{selectedHotspot.detail}</p>
              </div>
            ) : (
              <p className="muted-copy">{ui.selectStructure}</p>
            )}
            <div className="hotspot-tabs" aria-label={ui.labels}>
              {activeOrgan.hotspots.map((hotspot, index) => (
                <button
                  key={hotspot.id}
                  type="button"
                  className={selectedHotspotId === hotspot.id && (!selectedStructure || hotspotForStructure?.id === hotspot.id) ? "active" : ""}
                  onClick={() => selectHotspot(hotspot.id)}
                  aria-label={hotspot.name}
                  title={hotspot.name}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>

          {structures.length > 0 && (
            <section className="structure-section">
              <div className="section-label">
                <span>{ui.structures}</span>
                <ListBullets size={15} />
              </div>
              <div className="structure-toolbar">
                <label className="structure-filter">
                  <MagnifyingGlass size={14} aria-hidden="true" />
                  <span className="sr-only">{ui.structureFilter}</span>
                  <input type="search" value={structureFilter} onChange={(event) => setStructureFilter(event.target.value)} placeholder={ui.structureFilter} />
                </label>
                <small>{structures.length} {ui.structureCount}{hiddenStructures.length ? ` · ${hiddenStructures.length} ${ui.hidden}` : ""}</small>
                {hiddenStructures.length > 0 && (
                  <button type="button" onClick={() => setHiddenStructures([])}>{ui.showAll}</button>
                )}
              </div>
              <ul className="structure-list">
                {structureGroups.map((group) => {
                  const hidden = group.names.every((name) => hiddenStructures.includes(name));
                  const active = Boolean(selectedStructure && group.names.includes(selectedStructure));
                  return (
                    <li key={group.key} className={`${hidden ? "hidden" : ""} ${active ? "active" : ""}`}>
                      <button
                        type="button"
                        className="structure-name"
                        onClick={() => setSelectedStructure(active ? null : group.names[0])}
                        title={group.meaning ?? group.label}
                      >
                        <strong>{group.label}</strong>
                        {group.names.length > 1 && <span>{group.names.length}</span>}
                      </button>
                      <button type="button" className="structure-action" onClick={() => isolateGroup(group)} aria-label={`${ui.isolate} ${group.label}`} title={ui.isolate}>
                        <Target size={14} />
                      </button>
                      <button type="button" className="structure-action" onClick={() => toggleGroupVisibility(group)} aria-label={`${hidden ? ui.show : ui.hide} ${group.label}`} title={hidden ? ui.show : ui.hide}>
                        {hidden ? <EyeSlash size={14} /> : <Eye size={14} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section className="fact-section">
            <div className="section-label"><span>{ui.keyFacts}</span><Flask size={15} /></div>
            <dl>
              {activeOrgan.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    <span>{fact.value}</span>
                    {fact.sourceIds?.map((sourceId) => (
                      <button
                        key={sourceId}
                        type="button"
                        className="fact-source"
                        onClick={() => setSourcesOpen(true)}
                        aria-label={`${ui.factSource}: ${sourceId}`}
                        title={ui.factSource}
                      >
                        {sourceId === "openstax" ? "OpenStax" : sourceId}
                      </button>
                    ))}
                    {fact.reviewStatus === "draft" && <small className="fact-review-status">{ui.factDraft}</small>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="terms-section">
            <div className="section-label"><span>{ui.terms}</span><TextAa size={15} /></div>
            <dl>
              {activeOrgan.terms.map((term) => (
                <div key={term.term}>
                  <dt>{term.term}</dt>
                  <dd>{term.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="function-section">
            <div className="section-label"><span>{ui.functions}</span><CheckCircle size={15} /></div>
            <ul>
              {activeOrgan.functions.map((item, index) => (
                <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
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
          <aside className="source-drawer" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={(event) => event.stopPropagation()}>
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
              <div><small>{ui.contentLicense}</small><strong>{ui.contentLicenseLabel}</strong><p>{ui.contentLicenseText}</p></div>
            </div>

            <div className="source-list">
              {anatomySources.map((source, index) => (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{source.title}</strong><p>{source.detail}</p></div>
                  <ArrowSquareOut size={18} />
                </a>
              ))}
            </div>
          </aside>
        </div>
      )}

      {quizOpen && (
        <div className="modal-backdrop centered" role="presentation" onMouseDown={() => setQuizOpen(false)}>
          <section className="quiz-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <small>{activeOrgan.name} / {ui.quiz}</small>
                <h2 id="quiz-title">{activeOrgan.quiz.question}</h2>
                <p>{ui.quizHint}</p>
              </div>
              <button type="button" onClick={() => setQuizOpen(false)} aria-label={ui.close}><X size={20} /></button>
            </div>
            <div className="quiz-options">
              {activeOrgan.quiz.options.map((option, index) => {
                const isCorrect = index === activeOrgan.quiz.answer;
                const state = checked && isCorrect ? "correct" : checked && answer === index ? "wrong" : answer === index ? "selected" : "";
                return (
                  <button key={option} type="button" className={state} onClick={() => !checked && setAnswer(index)}>
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                    {checked && isCorrect && <CheckCircle size={18} weight="fill" />}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div className={`quiz-feedback ${answer === activeOrgan.quiz.answer ? "correct" : "wrong"}`}>
                <strong>{answer === activeOrgan.quiz.answer ? ui.correct : ui.incorrect}</strong>
                <p>{activeOrgan.quiz.explanation}</p>
              </div>
            )}
            <div className="quiz-actions">
              {!checked ? (
                <button
                  type="button"
                  className="primary"
                  disabled={answer === null}
                  onClick={() => {
                    setChecked(true);
                    if (activeLesson && answer === activeOrgan.quiz.answer) {
                      activeLesson.activities.forEach((activity) => {
                        if (activity.kind === "quiz") completeActivity(activity.id);
                      });
                    }
                  }}
                >
                  {ui.check}
                </button>
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
