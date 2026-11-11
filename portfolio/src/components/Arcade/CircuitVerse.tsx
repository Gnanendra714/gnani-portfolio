import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";

type Entity = {
  lane: number;
  y: number;
  type: "obstacle" | "orb";
  size: number;
};

type GameStatus = "ready" | "running" | "over";

const WIDTH = 600;
const HEIGHT = 360;
const LANES = [150, 300, 450];
const PLAYER_Y = 290;

export function CircuitVerse() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const statusRef = useRef<GameStatus>("ready");
  const laneRef = useRef(1);
  const entitiesRef = useRef<Entity[]>([]);
  const scoreRef = useRef(0);
  const speedRef = useRef(190);
  const spawnTimerRef = useRef(0);
  const orbTimerRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastScoreUpdateRef = useRef(0);

  const [status, setStatus] = useState<GameStatus>("ready");
  const [lane, setLane] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [orbsCollected, setOrbsCollected] = useState(0);

  // Load saved high score
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("circuitdash-highscore"));

      if (Number.isFinite(saved)) {
        setHighScore(saved);
      }
    } catch {
      // Game works without local storage.
    }
  }, []);

  // Lane movement
  const changeLane = useCallback((direction: number) => {
    if (statusRef.current !== "running") return;

    const next = Math.max(0, Math.min(2, laneRef.current + direction));

    laneRef.current = next;
    setLane(next);
  }, []);

  // Start or restart game
  const startGame = useCallback(() => {
    laneRef.current = 1;
    entitiesRef.current = [];
    scoreRef.current = 0;
    speedRef.current = 190;
    spawnTimerRef.current = 0;
    orbTimerRef.current = 0;
    lastTimeRef.current = 0;
    lastScoreUpdateRef.current = 0;

    setLane(1);
    setScore(0);
    setOrbsCollected(0);

    statusRef.current = "running";
    setStatus("running");
  }, []);

  // End game
  const endGame = useCallback(() => {
    statusRef.current = "over";
    setStatus("over");

    const finalScore = Math.floor(scoreRef.current);
    setScore(finalScore);

    setHighScore((previous) => {
      const next = Math.max(previous, finalScore);

      try {
        localStorage.setItem("circuitdash-highscore", String(next));
      } catch {
        // Ignore storage failures.
      }

      return next;
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (["arrowleft", "arrowright", "a", "d"].includes(key)) {
        event.preventDefault();
      }

      if (key === "arrowleft" || key === "a") {
        changeLane(-1);
      }

      if (key === "arrowright" || key === "d") {
        changeLane(1);
      }

      if (
        (event.key === " " || key === "enter") &&
        statusRef.current !== "running"
      ) {
        event.preventDefault();
        startGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeLane, startGame]);

  // Game engine and canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationId = 0;

    // Draw background
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);

      gradient.addColorStop(0, "#071329");
      gradient.addColorStop(1, "#020817");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      LANES.forEach((x, index) => {
        ctx.strokeStyle =
          index === laneRef.current
            ? "rgba(34,211,238,0.28)"
            : "rgba(59,130,246,0.12)";

        ctx.lineWidth = 2;
        ctx.setLineDash([12, 12]);

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
      });

      ctx.setLineDash([]);

      const offset = (scoreRef.current * 3) % 42;

      for (let y = -42 + offset; y < HEIGHT; y += 42) {
        ctx.fillStyle = "rgba(34,211,238,0.12)";
        ctx.fillRect(25, y, 550, 1);
      }

      ctx.fillStyle = "rgba(34,211,238,0.15)";
      ctx.fillRect(12, 0, 2, HEIGHT);
      ctx.fillRect(WIDTH - 14, 0, 2, HEIGHT);
    };

    // Draw player
    const drawPlayer = () => {
      const x = LANES[laneRef.current];

      ctx.save();

      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 22;

      const glow = ctx.createRadialGradient(x, PLAYER_Y, 2, x, PLAYER_Y, 36);

      glow.addColorStop(0, "rgba(34,211,238,0.45)");
      glow.addColorStop(1, "rgba(34,211,238,0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, PLAYER_Y, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#22d3ee";

      ctx.beginPath();
      ctx.moveTo(x, PLAYER_Y - 19);
      ctx.lineTo(x + 18, PLAYER_Y);
      ctx.lineTo(x, PLAYER_Y + 19);
      ctx.lineTo(x - 18, PLAYER_Y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffffff";

      ctx.beginPath();
      ctx.arc(x, PLAYER_Y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw obstacles and power orbs
    const drawEntity = (entity: Entity) => {
      const x = LANES[entity.lane];

      ctx.save();

      if (entity.type === "orb") {
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 18;

        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(x, entity.y, entity.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff7cc";
        ctx.beginPath();
        ctx.arc(x, entity.y, entity.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowColor = "#fb7185";
        ctx.shadowBlur = 15;

        ctx.fillStyle = "#be123c";
        ctx.fillRect(x - 25, entity.y - 18, 50, 36);

        ctx.strokeStyle = "#fb7185";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 25, entity.y - 18, 50, 36);

        ctx.fillStyle = "#fecdd3";
        ctx.fillRect(x - 15, entity.y - 3, 30, 6);
      }

      ctx.restore();
    };

    // Main animation loop
    const render = (time: number) => {
      const delta = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.04)
        : 0;

      lastTimeRef.current = time;

      drawBackground();

      if (statusRef.current === "running") {
        scoreRef.current += delta * 10;

        speedRef.current = Math.min(440, 190 + scoreRef.current * 0.55);

        spawnTimerRef.current += delta;
        orbTimerRef.current += delta;

        // Spawn obstacles
        if (
          spawnTimerRef.current > Math.max(0.48, 1.05 - scoreRef.current / 1200)
        ) {
          const randomLane = Math.floor(Math.random() * 3);

          entitiesRef.current.push({
            lane: randomLane,
            y: -30,
            type: "obstacle",
            size: 18,
          });

          spawnTimerRef.current = 0;
        }

        // Spawn power orbs
        if (orbTimerRef.current > 1.25) {
          entitiesRef.current.push({
            lane: Math.floor(Math.random() * 3),
            y: -20,
            type: "orb",
            size: 10,
          });

          orbTimerRef.current = 0;
        }

        const nextEntities: Entity[] = [];

        for (const entity of entitiesRef.current) {
          entity.y += speedRef.current * delta;

          const sameLane = entity.lane === laneRef.current;
          const nearPlayer = Math.abs(entity.y - PLAYER_Y) < 25;

          if (sameLane && nearPlayer) {
            if (entity.type === "obstacle") {
              endGame();
              break;
            }

            if (entity.type === "orb") {
              scoreRef.current += 50;
              setOrbsCollected((previous) => previous + 1);
              continue;
            }
          }

          if (entity.y < HEIGHT + 40) {
            nextEntities.push(entity);
          }
        }

        entitiesRef.current = nextEntities;

        if (time - lastScoreUpdateRef.current > 100) {
          setScore(Math.floor(scoreRef.current));
          lastScoreUpdateRef.current = time;
        }
      }

      entitiesRef.current.forEach(drawEntity);
      drawPlayer();

      if (statusRef.current !== "running") {
        ctx.fillStyle = "rgba(2,8,23,0.3)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [endGame]);

  return (
    <section
      className="
        relative mx-auto w-full max-w-[560px]
        overflow-hidden rounded-2xl
        border border-blue-400/20
        bg-[#071329]
        p-2.5 sm:p-3.5
        shadow-[0_24px_70px_-35px_rgba(37,99,235,.5)]
        sm:rounded-3xl
      "
    >
      {/* Game Header */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-[8px] tracking-[.2em] text-cyan-300 sm:text-[9px]">
            CIRCUITVERSE // ARCADE
          </p>

          <h3 className="mt-0.5 text-lg font-bold text-white sm:text-xl">
            Circuit Dash
          </h3>

          <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
            Dodge. Collect. Survive. Beat your high score.
          </p>
        </div>

        {/* Best Score */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5">
          <Trophy className="h-3 w-3 text-amber-300" />

          <div>
            <p className="font-mono text-[7px] text-slate-500">BEST SCORE</p>

            <p className="font-mono text-xs font-bold text-amber-200">
              {highScore}
            </p>
          </div>
        </div>
      </div>

      {/* Score Dashboard */}
      <div className="mb-2 grid grid-cols-3 gap-1.5">
        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5 sm:p-2">
          <p className="font-mono text-[7px] text-slate-500">SCORE</p>
          <p className="text-sm font-bold text-white sm:text-base">{score}</p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5 sm:p-2">
          <p className="font-mono text-[7px] text-slate-500">POWER ORBS</p>
          <p className="text-sm font-bold text-amber-300 sm:text-base">
            {orbsCollected}
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-1.5 sm:p-2">
          <p className="font-mono text-[7px] text-slate-500">SPEED</p>
          <p className="text-sm font-bold text-cyan-300 sm:text-base">
            {status === "running" ? `${Math.round(speedRef.current)}` : "—"}
          </p>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-400/20 bg-[#020817]">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block h-auto w-full"
          aria-label="Circuit Dash game canvas"
        />

        {/* Game Overlay */}
        {status !== "running" && (
          <div
            className="
              absolute inset-0 flex flex-col
              items-center justify-center
              bg-[#020817]/75
              px-3 text-center backdrop-blur-sm
            "
          >
            <div
              className="
                mb-2 flex h-10 w-10 items-center justify-center
                rounded-xl border border-cyan-400/40
                bg-cyan-400/10 text-cyan-300
                sm:h-11 sm:w-11
              "
            >
              {status === "ready" ? (
                <Zap className="h-5 w-5" />
              ) : (
                <Trophy className="h-5 w-5 text-amber-300" />
              )}
            </div>

            <h4 className="text-lg font-bold text-white sm:text-xl">
              {status === "ready" ? "Ready to Dash?" : "Game Over"}
            </h4>

            <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-slate-300 sm:text-[11px]">
              {status === "ready"
                ? "Control the energy core. Avoid red barriers and collect golden power orbs."
                : `You scored ${score} points and collected ${orbsCollected} power orbs. Can you beat your best?`}
            </p>

            <button
              type="button"
              onClick={startGame}
              className="
                mt-3 inline-flex items-center gap-2
                rounded-lg bg-cyan-400
                px-4 py-2
                text-[11px] font-bold text-slate-950
                transition hover:bg-cyan-300
                sm:text-xs
              "
            >
              {status === "ready" ? (
                <Play className="h-3 w-3" />
              ) : (
                <RotateCcw className="h-3 w-3" />
              )}

              {status === "ready" ? "Start Game" : "Play Again"}
            </button>
          </div>
        )}
      </div>

      {/* Control Instructions */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[8px] text-slate-500 sm:text-[9px]">
          Desktop: ← → or A / D
        </p>

        <p className="text-[8px] text-slate-500 sm:text-[9px]">
          Mobile: Use the controls below
        </p>
      </div>

      {/* Mobile Controls */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={status !== "running"}
          onClick={() => changeLane(-1)}
          className="
            flex min-h-9 items-center justify-center gap-1.5
            rounded-lg border border-slate-700
            bg-slate-900 text-white
            transition hover:border-cyan-400/50
            hover:bg-slate-800 disabled:opacity-40
          "
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="text-[10px] font-semibold">LEFT</span>
        </button>

        <button
          type="button"
          disabled={status !== "running"}
          onClick={() => changeLane(1)}
          className="
            flex min-h-9 items-center justify-center gap-1.5
            rounded-lg border border-slate-700
            bg-slate-900 text-white
            transition hover:border-cyan-400/50
            hover:bg-slate-800 disabled:opacity-40
          "
        >
          <span className="text-[10px] font-semibold">RIGHT</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Footer */}
      <div
        className="
          mt-2.5 flex flex-wrap items-center justify-between
          gap-2 border-t border-slate-800 pt-2
        "
      >
        <span className="flex items-center gap-1 font-mono text-[7px] text-slate-500">
          <Zap className="h-2.5 w-2.5 text-cyan-300" />
          CIRCUIT DASH
        </span>

        <span className="font-mono text-[7px] text-slate-600">
          HIGH SCORE SAVED ON THIS DEVICE
        </span>
      </div>
    </section>
  );
}
