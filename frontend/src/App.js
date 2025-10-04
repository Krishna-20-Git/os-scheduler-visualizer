import React, { useState, useEffect, useRef } from "react";

// --- ICONS ---
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

// --- GLOBAL STYLES COMPONENT for HOVER & TRANSITION EFFECTS ---
const GlobalStyles = ({ theme }) => {
  const isDark = theme === "dark";
  const styles = `
    body {
        overflow: hidden; /* Prevent scrollbars from ever appearing */
    }
    .btn {
      transition: all 0.2s ease-in-out;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    }
    .btn:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }
    .input-field:focus {
      outline: none;
      border-color: ${isDark ? "#818cf8" : "#4f46e5"};
      box-shadow: 0 0 0 3px ${
        isDark ? "rgba(129, 140, 248, 0.4)" : "rgba(79, 70, 229, 0.4)"
      };
    }
    .card, .process-item-interactive {
        transition: all 0.2s ease-in-out;
    }
    .card:hover, .process-item-interactive:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }
    .app-container { transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out; }
    .app-hidden { opacity: 0; transform: scale(1.2); }
    .app-visible { opacity: 1; transform: scale(1); }
    
    .landing-container { transition: all 0.5s ease-in-out; }
    .landing-hidden { transform: scale(0.8); opacity: 0; }
    .landing-visible { transform: scale(1); opacity: 1; }

    .spotlight-text-top {
      background-image: radial-gradient(
        circle 250px at var(--mouse-x) var(--mouse-y),
        #facc15,
        #f59e0b,
        transparent 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  `;
  return <style>{styles}</style>;
};

// --- DYNAMIC STYLES ---
const getStyles = (theme, isMobile) => {
  const isDark = theme === "dark";

  const colors = {
    light: {
      bg: "#f9fafb",
      sidebarBg: "#ffffff",
      mainContentBg: "#f9fafb",
      textPrimary: "#1f2937",
      textSecondary: "#374151",
      border: "#d1d5db",
      inputBg: "#ffffff",
      buttonPrimaryBg: "#4f46e5",
      buttonCompareBg: "#7c3aed",
      buttonMutedBg: "#6b7280",
      processItemBg: "#f3f4f6",
      ganttBg: "#e5e7eb",
      cardBg: "#ffffff",
      heading: "#4338ca",
      activeToggleBg: "#4f46e5",
    },
    dark: {
      bg: "#111827",
      sidebarBg: "#1f2937",
      mainContentBg: "#111827",
      textPrimary: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#374151",
      inputBg: "#374151",
      buttonPrimaryBg: "#6366f1",
      buttonCompareBg: "#8b5cf6",
      buttonMutedBg: "#4b5563",
      processItemBg: "#374151",
      ganttBg: "#374151",
      cardBg: "#1f2937",
      heading: "#818cf8",
      activeToggleBg: "#6366f1",
    },
  };

  const themeColors = isDark ? colors.dark : colors.light;

  return {
    container: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      fontFamily:
        'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: themeColors.textPrimary,
      height: "100vh",
      backgroundColor: themeColors.bg,
    },
    sidebar: {
      width: isMobile ? "100%" : "300px",
      padding: "20px",
      backgroundColor: themeColors.sidebarBg,
      borderRight: isMobile ? "none" : `1px solid ${themeColors.border}`,
      borderBottom: isMobile ? `1px solid ${themeColors.border}` : "none",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      backgroundColor: themeColors.mainContentBg,
    },
    h2: {
      margin: 0,
      marginBottom: "15px",
      color: themeColors.heading,
      textAlign: "center",
    },
    h3: {
      marginTop: 0,
      marginBottom: "10px",
      color: themeColors.textSecondary,
    },
    formSection: { marginBottom: "20px" },
    inputGroup: { display: "flex", marginBottom: "10px", gap: "10px" },
    input: {
      flex: 1,
      padding: "8px",
      border: `1px solid ${themeColors.border}`,
      borderRadius: "4px",
      minWidth: 0,
      backgroundColor: themeColors.inputBg,
      color: themeColors.textPrimary,
    },
    button: {
      padding: "10px 15px",
      border: "none",
      borderRadius: "4px",
      backgroundColor: themeColors.buttonPrimaryBg,
      color: "white",
      cursor: "pointer",
      width: "100%",
      marginBottom: "10px",
      fontWeight: "500",
    },
    buttonMuted: { backgroundColor: themeColors.buttonMutedBg },
    buttonCompare: { backgroundColor: themeColors.buttonCompareBg },
    processList: {
      flex: 1,
      overflowY: "auto",
      maxHeight: isMobile ? "150px" : "none",
    },
    processItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px",
      backgroundColor: themeColors.processItemBg,
      borderRadius: "4px",
      marginBottom: "5px",
    },
    removeButton: {
      border: "none",
      backgroundColor: "transparent",
      color: "#ef4444",
      cursor: "pointer",
      fontWeight: "bold",
    },
    ganttChartContainer: {
      marginTop: "20px",
      width: "100%",
      overflowX: "auto",
      paddingBottom: "25px",
    },
    ganttChart: {
      display: "flex",
      height: "40px",
      position: "relative",
      border: `1px solid ${themeColors.border}`,
      borderRadius: "4px",
      backgroundColor: themeColors.ganttBg,
    },
    ganttBlock: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "12px",
      borderRight: "1px solid rgba(255,255,255,0.3)",
      boxSizing: "border-box",
    },
    timeline: { display: "flex", position: "relative", marginTop: "5px" },
    timeMarker: {
      fontSize: "12px",
      color: "#6b7280",
      textAlign: "center",
      position: "absolute",
      bottom: "-20px",
    },
    metricsContainer: {
      marginTop: "30px",
      padding: "15px",
      backgroundColor: themeColors.cardBg,
      borderRadius: "8px",
      border: `1px solid ${themeColors.border}`,
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    },
    animationContainer: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "20px",
      marginTop: "20px",
      height: isMobile ? "auto" : "100px",
    },
    cpuBox: {
      flex: 1,
      border: `2px solid ${themeColors.buttonPrimaryBg}`,
      borderRadius: "8px",
      padding: "10px",
      textAlign: "center",
    },
    readyQueueBox: {
      flex: 1,
      border: `2px dashed ${themeColors.textSecondary}`,
      borderRadius: "8px",
      padding: "10px",
    },
    processInQueue: {
      backgroundColor: themeColors.ganttBg,
      padding: "5px 10px",
      borderRadius: "4px",
      marginRight: "5px",
      display: "inline-block",
    },
    metricsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    metricsTh: {
      border: `1px solid ${themeColors.border}`,
      padding: "8px",
      backgroundColor: themeColors.processItemBg,
      textAlign: "center",
    },
    metricsTd: {
      border: `1px solid ${themeColors.border}`,
      padding: "8px",
      textAlign: "center",
    },
    priorityToggle: { display: "flex", gap: "5px", marginTop: "10px" },
    toggleButton: {
      flex: 1,
      padding: "8px",
      border: `1px solid ${themeColors.border}`,
      borderRadius: "4px",
      cursor: "pointer",
      textAlign: "center",
      fontSize: "12px",
    },
    activeToggle: {
      backgroundColor: themeColors.activeToggleBg,
      color: "white",
      borderColor: themeColors.activeToggleBg,
    },
    animationControls: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginTop: "10px",
      borderTop: `1px solid ${themeColors.border}`,
      paddingTop: "10px",
      flexWrap: "wrap",
    },
    compareContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "20px",
    },
    compareCard: {
      padding: "15px",
      backgroundColor: themeColors.cardBg,
      borderRadius: "8px",
      border: `1px solid ${themeColors.border}`,
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    },
    themeToggleButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: themeColors.textSecondary,
      position: "absolute",
      top: "20px",
      right: "20px",
    },
    homeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: themeColors.textSecondary,
      position: "absolute",
      top: "20px",
      left: "20px",
    },
  };
};

const PROCESS_COLORS = [
  "#6366f1",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#d946ef",
];
const API_BASE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL) ||
  "http://127.0.0.1:5000";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

const StaticGanttChart = ({ log, styles }) => {
  const getProcessColor = (name) =>
    !name
      ? "#9ca3af"
      : PROCESS_COLORS[
          (parseInt(name.replace("P", "")) - 1) % PROCESS_COLORS.length
        ];
  if (!log || log.length === 0) return <p>No execution log.</p>;
  return (
    <div style={styles.ganttChartContainer}>
      <div style={{ ...styles.ganttChart, width: `${log.length * 30}px` }}>
        {log.map((event, index) => (
          <div
            key={index}
            style={{
              ...styles.ganttBlock,
              width: "30px",
              backgroundColor: getProcessColor(event.process),
            }}
            title={`Time: ${event.time}`}
          >
            {event.process}
          </div>
        ))}
      </div>
      <div style={{ ...styles.timeline, width: `${log.length * 30}px` }}>
        {log.map(
          (_, index) =>
            index % 5 === 0 && (
              <div
                key={index}
                style={{
                  ...styles.timeMarker,
                  left: `${index * 30}px`,
                  width: "30px",
                }}
              >
                {index}
              </div>
            )
        )}
        <div
          style={{
            ...styles.timeMarker,
            left: `${log.length * 30}px`,
            width: "30px",
          }}
        >
          {log.length}
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onEnter, styles, isMobile }) => {
  const containerRef = useRef(null);

  const landingStyles = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#000000",
    padding: "20px",
  };

  const titleBaseStyle = {
    ...styles.h2,
    fontSize: isMobile ? "2.5rem" : "4rem",
    fontWeight: "bold",
    lineHeight: "1.2",
    color: "#4b5563",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  };

  const titleTopStyle = {
    ...titleBaseStyle,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    color: "transparent",
  };

  return (
    <div
      style={landingStyles}
      onMouseMove={(e) => {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          container.style.setProperty("--mouse-x", `${x}px`);
          container.style.setProperty("--mouse-y", `${y}px`);
        }
      }}
    >
      <div ref={containerRef} style={{ position: "relative" }}>
        <h1 style={titleBaseStyle}>
          OPERATING SYSTEM
          <br />
          SCHEDULING VISUALIZER
        </h1>
        <h1 style={titleTopStyle} className="spotlight-text-top">
          OPERATING SYSTEM
          <br />
          SCHEDULING VISUALIZER
        </h1>
      </div>
      <p
        style={{
          ...styles.h3,
          fontSize: "1.2rem",
          maxWidth: "600px",
          margin: "30px 0",
          color: "#e5e7eb",
        }}
      >
        An interactive tool to explore, animate, and compare various CPU
        scheduling algorithms. Bring operating system concepts to life.
      </p>
      <button
        onClick={onEnter}
        className="btn"
        style={{
          ...styles.button,
          width: "200px",
          fontSize: "1.1rem",
          padding: "15px 20px",
        }}
      >
        Enter Simulation
      </button>
    </div>
  );
};

const Scheduler = ({ theme, toggleTheme, onBack, isMobile }) => {
  const styles = getStyles(theme, isMobile);
  const [processes, setProcesses] = useState([]);
  const [newProcess, setNewProcess] = useState({
    name: "",
    arrival: "",
    burst: "",
    priority: "0",
  });
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(4);
  const [priorityOrder, setPriorityOrder] = useState("lowIsHigh");

  const [view, setView] = useState("single");

  const [singleResult, setSingleResult] = useState(null);
  const [compareResults, setCompareResults] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const nextProcessId = useRef(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const animationInterval = useRef(null);

  useEffect(() => {
    if (isPlaying && singleResult && singleResult.log) {
      animationInterval.current = setInterval(() => {
        setAnimationTime((prevTime) => {
          if (prevTime >= singleResult.log.length - 1) {
            clearInterval(animationInterval.current);
            setIsPlaying(false);
            return prevTime;
          }
          return prevTime + 1;
        });
      }, animationSpeed);
    } else {
      clearInterval(animationInterval.current);
    }
    return () => clearInterval(animationInterval.current);
  }, [isPlaying, singleResult, animationSpeed]);

  const handleInputChange = (e) =>
    setNewProcess({ ...newProcess, [e.target.name]: e.target.value });

  const addProcess = () => {
    if (newProcess.burst && newProcess.arrival) {
      const p = {
        name: `P${nextProcessId.current}`,
        arrival: parseInt(newProcess.arrival),
        burst: parseInt(newProcess.burst),
        priority: parseInt(newProcess.priority),
      };
      setProcesses([...processes, p]);
      nextProcessId.current += 1;
      setNewProcess({ name: "", arrival: "", burst: "", priority: "0" });
    } else {
      alert("Please fill in Arrival and Burst times.");
    }
  };

  const removeProcess = (name) =>
    setProcesses(processes.filter((p) => p.name !== name));

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setSingleResult(null);
    setCompareResults(null);
    setAnimationTime(0);
    setIsPlaying(false);
    setView("single");
    try {
      const payload = {
        processes,
        algorithm,
        timeQuantum: parseInt(timeQuantum),
        priorityOrder,
      };
      const response = await fetch(`${API_BASE_URL}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setSingleResult(data);
      if (data.log && data.log.length > 0) setIsPlaying(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to connect to backend.");
    }
    setIsLoading(false);
  };

  const handleCompare = async () => {
    setIsLoading(true);
    setSingleResult(null);
    setCompareResults(null);
    setView("compare");
    try {
      const payload = {
        processes,
        timeQuantum: parseInt(timeQuantum),
        priorityOrder,
      };
      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setCompareResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to connect to backend.");
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setAnimationTime(0);
    setSingleResult(null);
  };

  const getProcessColor = (name) =>
    !name
      ? "#9ca3af"
      : PROCESS_COLORS[
          (parseInt(name.replace("P", "")) - 1) % PROCESS_COLORS.length
        ];
  const currentEvent =
    view === "single" && singleResult && singleResult.log
      ? singleResult.log[animationTime]
      : null;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={onBack}
            style={styles.homeButton}
            title="Back to Home"
          >
            <HomeIcon />
          </button>
          <h2 style={{ ...styles.h2, flex: 1 }}>Process Scheduler</h2>
          <button
            onClick={toggleTheme}
            style={styles.themeToggleButton}
            title="Toggle Theme"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
        <div style={styles.formSection}>
          <h3 style={styles.h3}>Add Process</h3>
          <div style={styles.inputGroup}>
            <input
              className="input-field"
              type="number"
              name="arrival"
              value={newProcess.arrival}
              onChange={handleInputChange}
              placeholder="Arrival"
              style={styles.input}
            />
            <input
              className="input-field"
              type="number"
              name="burst"
              value={newProcess.burst}
              onChange={handleInputChange}
              placeholder="Burst"
              style={styles.input}
            />
            {algorithm.includes("priority") && (
              <input
                className="input-field"
                type="number"
                name="priority"
                value={newProcess.priority}
                onChange={handleInputChange}
                placeholder="Priority"
                style={styles.input}
              />
            )}
          </div>
          <button onClick={addProcess} style={styles.button} className="btn">
            Add Process
          </button>
        </div>
        <div style={styles.formSection}>
          <h3 style={styles.h3}>Single Simulation</h3>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            style={{ ...styles.input, width: "100%", padding: "10px" }}
          >
            <option value="fcfs">First-Come, First-Served</option>
            <option value="sjf_non_preemptive">
              Shortest Job First (Non-P)
            </option>
            <option value="sjf_preemptive">
              Shortest Job First (Preemptive)
            </option>
            <option value="priority_non_preemptive">Priority (Non-P)</option>
            <option value="priority_preemptive">Priority (Preemptive)</option>
            <option value="roundrobin">Round Robin</option>
          </select>
          {algorithm === "roundrobin" && (
            <div style={{ marginTop: "10px" }}>
              {" "}
              <label>Time Quantum:</label>{" "}
              <input
                type="number"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(e.target.value)}
                style={{ ...styles.input, width: "100%", marginTop: "5px" }}
                className="input-field"
              />{" "}
            </div>
          )}
          {algorithm.includes("priority") && (
            <div style={{ marginTop: "10px" }}>
              {" "}
              <label>Priority Rule:</label>{" "}
              <div style={styles.priorityToggle}>
                {" "}
                <div
                  onClick={() => setPriorityOrder("lowIsHigh")}
                  style={{
                    ...styles.toggleButton,
                    ...(priorityOrder === "lowIsHigh"
                      ? styles.activeToggle
                      : {}),
                  }}
                >
                  Low # = High Prio
                </div>{" "}
                <div
                  onClick={() => setPriorityOrder("highIsHigh")}
                  style={{
                    ...styles.toggleButton,
                    ...(priorityOrder === "highIsHigh"
                      ? styles.activeToggle
                      : {}),
                  }}
                >
                  High # = High Prio
                </div>{" "}
              </div>{" "}
            </div>
          )}
          <button
            onClick={handleRunSimulation}
            style={{ ...styles.button, marginTop: "20px" }}
            disabled={isLoading || processes.length === 0}
            className="btn"
          >
            {isLoading ? "Simulating..." : "Run Single Simulation"}
          </button>
        </div>
        <div
          style={{
            ...styles.formSection,
            marginTop: "auto",
            borderTop: `1px solid ${styles.border}`,
            paddingTop: "15px",
          }}
        >
          <h3 style={styles.h3}>Compare Algorithms</h3>
          <button
            onClick={handleCompare}
            style={{ ...styles.button, ...styles.buttonCompare }}
            disabled={isLoading || processes.length === 0}
            className="btn"
          >
            {isLoading ? "Comparing..." : "Compare All"}
          </button>
        </div>
        <h3 style={styles.h3}>Process List</h3>
        <div style={styles.processList}>
          {processes.map((p) => (
            <div
              key={p.name}
              style={styles.processItem}
              className="process-item-interactive"
            >
              <span>{`${p.name} (A:${p.arrival}, B:${p.burst}, P:${p.priority})`}</span>
              <button
                onClick={() => removeProcess(p.name)}
                style={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main style={styles.mainContent}>
        {view === "single" && (
          <>
            <h2 style={styles.h2}>Simulation Results</h2>
            {singleResult ? (
              <div>
                <div style={styles.animationControls}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={
                      !singleResult.log ||
                      animationTime >= singleResult.log.length - 1
                    }
                    style={{ ...styles.button, width: "100px" }}
                    className="btn"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={handleReset}
                    style={{
                      ...styles.button,
                      ...styles.buttonMuted,
                      width: "100px",
                    }}
                    className="btn"
                  >
                    Reset
                  </button>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label>Speed:</label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="100"
                      value={1100 - animationSpeed}
                      onChange={(e) => setAnimationSpeed(1100 - e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.animationContainer}>
                  <div style={styles.cpuBox}>
                    <h3 style={styles.h3}>CPU</h3>
                    <div
                      style={{
                        ...styles.processInQueue,
                        backgroundColor: getProcessColor(currentEvent?.process),
                        color: "white",
                        padding: "15px 25px",
                        fontSize: "18px",
                      }}
                    >
                      {currentEvent?.process || "IDLE"}
                    </div>
                  </div>
                  <div style={styles.readyQueueBox}>
                    <h3 style={styles.h3}>Ready Queue</h3>
                    <div>
                      {currentEvent?.ready_queue.map((p) => (
                        <span
                          key={p}
                          style={{
                            ...styles.processInQueue,
                            color: theme === "dark" ? "#f9fafb" : "#1f2937",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={styles.ganttChartContainer}>
                  <h3 style={styles.h3}>Gantt Chart (Time: {animationTime})</h3>
                  {singleResult.log && (
                    <StaticGanttChart
                      log={singleResult.log.slice(0, animationTime + 1)}
                      styles={styles}
                    />
                  )}
                </div>
                <div style={styles.metricsContainer} className="card">
                  <h3 style={{ ...styles.h3, textAlign: "center" }}>
                    Final Performance Metrics
                  </h3>
                  <p>
                    <strong>Average Waiting Time:</strong>{" "}
                    {singleResult.metrics.avg_waiting_time} units
                  </p>
                  <p>
                    <strong>Average Turnaround Time:</strong>{" "}
                    {singleResult.metrics.avg_turnaround_time} units
                  </p>
                  <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
                    Detailed Calculations
                  </h4>
                  <table style={styles.metricsTable}>
                    <thead>
                      <tr>
                        <th style={styles.metricsTh}>Process</th>
                        <th style={styles.metricsTh}>Arrival</th>
                        <th style={styles.metricsTh}>Burst</th>
                        {algorithm.includes("priority") && (
                          <th style={styles.metricsTh}>Priority</th>
                        )}
                        <th style={styles.metricsTh}>Completion</th>
                        <th style={styles.metricsTh}>Turnaround Time</th>
                        <th style={styles.metricsTh}>Waiting Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleResult.metrics.details &&
                        singleResult.metrics.details.map((d) => (
                          <tr key={d.name}>
                            <td style={styles.metricsTd}>{d.name}</td>
                            <td style={styles.metricsTd}>{d.arrival}</td>
                            <td style={styles.metricsTd}>{d.burst}</td>
                            {algorithm.includes("priority") && (
                              <td style={styles.metricsTd}>{d.priority}</td>
                            )}
                            <td style={styles.metricsTd}>{d.ct}</td>
                            <td style={styles.metricsTd}>{d.tat}</td>
                            <td style={styles.metricsTd}>{d.wt}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>Add processes and run a simulation or comparison.</p>
            )}
          </>
        )}

        {view === "compare" && (
          <>
            <h2 style={styles.h2}>Algorithm Comparison</h2>
            {isLoading && <p>Loading comparison...</p>}
            {compareResults ? (
              <div style={styles.compareContainer}>
                {Object.entries(compareResults)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([name, data]) => (
                    <div key={name} style={styles.compareCard} className="card">
                      <h3 style={styles.h3}>{name}</h3>
                      <p>
                        <strong>Avg. Waiting Time:</strong>{" "}
                        {data.metrics.avg_waiting_time}
                      </p>
                      <p>
                        <strong>Avg. Turnaround Time:</strong>{" "}
                        {data.metrics.avg_turnaround_time}
                      </p>
                      <StaticGanttChart log={data.log} styles={styles} />
                    </div>
                  ))}
              </div>
            ) : (
              !isLoading && <p>Run comparison to see results.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  const [showScheduler, setShowScheduler] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const styles = getStyles(theme, isMobile);

  useEffect(() => {
    const savedTheme = localStorage.getItem("schedulerTheme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("schedulerTheme", newTheme);
  };

  const handleEnter = () => {
    setShowScheduler(true);
  };

  const handleBack = () => {
    setShowScheduler(false);
  };

  return (
    <>
      <GlobalStyles theme={theme} />
      <div
        className={`landing-container ${
          !showScheduler ? "landing-visible" : "landing-hidden"
        }`}
        style={{
          width: "100vw",
          height: "100vh",
          pointerEvents: !showScheduler ? "auto" : "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <LandingPage
          onEnter={handleEnter}
          styles={styles}
          theme={theme}
          isMobile={isMobile}
        />
      </div>
      <div
        className={`app-container ${
          showScheduler ? "app-visible" : "app-hidden"
        }`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: showScheduler ? "auto" : "none",
        }}
      >
        {showScheduler && (
          <Scheduler
            theme={theme}
            toggleTheme={toggleTheme}
            onBack={handleBack}
            isMobile={isMobile}
          />
        )}
      </div>
    </>
  );
}

export default App;
