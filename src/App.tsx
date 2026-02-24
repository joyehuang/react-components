import { useMemo, useState } from "react";
import "./App.css";
import { CreditCard } from "@/components/ui/credit-card";
import { NeonNetwork } from "@/components/ui/neon-network";
import { SimpleGraph } from "@/components/ui/simple-graph";
import { CylindricalTextReveal } from "@/components/ui/cylindrical-text-reveal";
import { TextScatter } from "@/components/ui/text-scatter";
import { TextScatterBurst } from "@/components/ui/text-scatter-burst";

type DemoTab =
  | "network"
  | "simplegraph"
  | "scroll3d"
  | "textscatter"
  | "textscatterburst"
  | "creditcard";

function App() {
  const [activeTab, setActiveTab] = useState<DemoTab>("simplegraph");

  const tabs = useMemo(
    () => [
      { id: "network" as const, label: "Neon Network" },
      { id: "simplegraph" as const, label: "Simple Graph" },
      { id: "scroll3d" as const, label: "Scroll 3D Text" },
      { id: "textscatter" as const, label: "Text Scatter" },
      { id: "textscatterburst" as const, label: "Text Scatter Burst" },
      { id: "creditcard" as const, label: "Credit Card" },
    ],
    [],
  );

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1 className="app-header__title">Component Playground</h1>
        <nav className="app-header__tabs" aria-label="Component switcher">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`app-header__tab ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <section
        className={`app-content ${
          activeTab === "network"
            ? "is-network"
            : activeTab === "simplegraph"
              ? "is-simplegraph"
              : activeTab === "scroll3d"
                ? "is-scroll3d"
                : activeTab === "textscatter"
                  ? "is-textscatter"
                  : activeTab === "textscatterburst"
                    ? "is-textscatter-burst"
                    : "is-credit-card"
        }`}
      >
        {activeTab === "network" ? (
          <NeonNetwork
            startLabel="开始"
            restartLabel="重新开始"
            fillDurationMs={2100}
            colors={{
              lineCore: "#ca47ff",
              lineGlow: "rgba(196, 94, 255, 0.42)",
              nodeDotHighlight: "#dc6bff",
            }}
          />
        ) : activeTab === "simplegraph" ? (
          <SimpleGraph
            points={[
              { id: "jan", label: "Jan", value: 48.5 },
              { id: "feb", label: "Feb", value: -42.8, displayValue: "-42.8%" },
              { id: "mar", label: "Mar", value: 67.2 },
              { id: "apr", label: "Apr", value: 29.6 },
              { id: "may", label: "May", value: 73.4 },
              { id: "jun", label: "Jun", value: 90.1 },
            ]}
            maxWidth={860}
            height={392}
            animationDurationMs={1550}
            colors={{
              line: "#b49fff",
              lineGlow: "rgba(180, 159, 255, 0.44)",
              pointActive: "#bcaeff",
              tooltipNegative: "#ff6a6a",
            }}
          />
        ) : activeTab === "scroll3d" ? (
          <CylindricalTextReveal
            stickyTopOffset="var(--app-header-height, 72px)"
            sectionMinHeight="calc((100vh - var(--app-header-height, 72px)) * 2.4)"
          />
        ) : activeTab === "textscatter" ? (
          <TextScatter />
        ) : activeTab === "textscatterburst" ? (
          <TextScatterBurst />
        ) : (
          <CreditCard />
        )}
      </section>
    </main>
  );
}

export default App;
