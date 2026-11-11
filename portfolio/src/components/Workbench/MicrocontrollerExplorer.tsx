import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Box3, Vector3, Mesh, MeshPhysicalMaterial } from "three";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Cpu,
  Radio,
  CircuitBoard,
  Info,
  Layers,
  Gauge,
  Rotate3D,
  MousePointer2,
  X,
  ArrowUpRight,
} from "lucide-react";

type BoardId = "esp32" | "arduino" | "stm32";
type ViewMode = "3d" | "details";

interface BoardComponent {
  id: string;
  name: string;
  category: string;
  purpose: string;
  details: string[];
}
interface BoardConfig {
  id: BoardId;
  name: string;
  model: string;
  processor: string;
  architecture: string;
  clock: string;
  flash: string;
  ram: string;
  voltage: string;
  connectivity: string[];
  description: string;
  components: BoardComponent[];
}

const boards: BoardConfig[] = [
  {
    id: "esp32",
    name: "ESP32",
    model: "ESP32-WROOM Development Board",
    processor: "Xtensa LX6",
    architecture: "32-bit dual-core",
    clock: "Up to 240 MHz",
    flash: "4 MB",
    ram: "520 KB SRAM",
    voltage: "3.3 V logic",
    connectivity: ["2.4 GHz Wi-Fi", "Bluetooth 4.2", "BLE"],
    description:
      "A wireless microcontroller module designed for connected devices, IoT applications, sensor networks and edge computing.",
    components: [
      {
        id: "shield",
        name: "RF Shield Can",
        category: "Visible module component",
        purpose:
          "Metal shield covering the ESP32 SoC, flash and RF circuitry. The processor and flash are not exposed as separate top-side packages on the assembled WROOM module.",
        details: [
          "Metal RF enclosure",
          "Covers the main electronics area",
          "Click the shield to inspect the enclosed electronics",
        ],
      },
      {
        id: "antenna",
        name: "On-board PCB Antenna",
        category: "RF component",
        purpose:
          "Printed antenna at the antenna end of the ESP32-WROOM-32D module for its 2.4 GHz radio.",
        details: [
          "Integrated PCB antenna",
          "Keep the antenna end clear of nearby metal",
          "WROOM-32D uses PCB antenna; WROOM-32U uses an external antenna connector",
        ],
      },
      {
        id: "pads",
        name: "Castellated Edge Pads",
        category: "Electrical interface",
        purpose:
          "Plated half-hole pads along the module edges used to solder the module onto a carrier PCB.",
        details: [
          "38 module pins",
          "Includes power, ground, enable and GPIO signals",
          "Not the same as a development-board pin header",
        ],
      },
      {
        id: "cpu",
        name: "ESP32-D0WD SoC",
        category: "Internal silicon",
        purpose:
          "The dual-core Xtensa LX6 microcontroller inside the shielded module.",
        details: [
          "32-bit dual-core Xtensa LX6",
          "Up to 240 MHz",
          "520 KB SRAM and 448 KB ROM",
        ],
      },
      {
        id: "flash",
        name: "4 MB SPI Flash",
        category: "Internal module component",
        purpose:
          "External SPI flash fitted inside the shielded module and connected to the ESP32 SoC.",
        details: [
          "4 MB flash for this module variant",
          "Stores firmware and data",
          "Not visible without removing the RF shield",
        ],
      },
      {
        id: "crystal",
        name: "40 MHz Crystal",
        category: "Clock source",
        purpose: "Provides the main reference clock for the ESP32 module.",
        details: [
          "40 MHz crystal oscillator",
          "Mounted inside the RF-shielded area",
        ],
      },
      {
        id: "gpio",
        name: "GPIO / Peripheral Signals",
        category: "I/O",
        purpose:
          "Routes the ESP32 peripheral signals to the castellated edge pads.",
        details: [
          "Up to 32 GPIOs",
          "UART, SPI, I2C, PWM and other peripherals",
          "Some pins are reserved for module flash or boot strapping",
        ],
      },
      {
        id: "adc",
        name: "ADC Inputs",
        category: "Analog",
        purpose:
          "Converts supported analog input signals inside the ESP32 SoC.",
        details: [
          "12-bit ADC architecture",
          "ADC1 and ADC2 channels",
          "Input availability depends on GPIO and radio use",
        ],
      },
    ],
  },
  {
    id: "arduino",
    name: "Arduino",
    model: "Arduino Uno R3",
    processor: "ATmega328P",
    architecture: "8-bit AVR",
    clock: "16 MHz",
    flash: "32 KB",
    ram: "2 KB SRAM",
    voltage: "5 V logic",
    connectivity: ["UART", "SPI", "I2C"],
    description:
      "A beginner-friendly development board for embedded programming, electronics experiments and rapid hardware prototyping.",
    components: [
      {
        id: "cpu",
        name: "ATmega328P-PU",
        category: "Main microcontroller",
        purpose:
          "The 28-pin DIP microcontroller that executes the Arduino sketch.",
        details: [
          "8-bit AVR",
          "16 MHz clock source",
          "32 KB Flash, 2 KB SRAM, 1 KB EEPROM",
        ],
      },
      {
        id: "usbBridge",
        name: "ATmega16U2-MU",
        category: "USB interface",
        purpose:
          "USB-to-serial bridge between the USB-B connector and the ATmega328P UART.",
        details: [
          "ATmega16U2 USB interface MCU",
          "Handles USB communication and serial programming",
        ],
      },
      {
        id: "usb",
        name: "USB Type-B Connector",
        category: "Power & programming",
        purpose:
          "Connects the Uno to a host computer for USB serial communication and bus power.",
        details: ["USB-B receptacle", "Connected to the ATmega16U2 USB bridge"],
      },
      {
        id: "barrel",
        name: "DC Barrel Jack",
        category: "Power input",
        purpose: "External DC input connection for powering the board.",
        details: [
          "Centre-positive input",
          "Input passes through the board's power-selection and regulation circuitry",
        ],
      },
      {
        id: "regulators",
        name: "Voltage Regulators",
        category: "Power management",
        purpose:
          "Regulates the incoming supply to the board's 5 V and 3.3 V rails.",
        details: ["NCP1117 5 V regulator", "LP2985 3.3 V regulator"],
      },
      {
        id: "crystal",
        name: "16 MHz Resonator",
        category: "Clock source",
        purpose: "Provides the clock reference for the ATmega328P.",
        details: ["16 MHz ceramic resonator (X1)"],
      },
      {
        id: "gpio",
        name: "Digital I/O Headers",
        category: "I/O",
        purpose: "Provide access to digital pins and serial/SPI signals.",
        details: ["14 digital I/O pins", "6 PWM-capable outputs"],
      },
      {
        id: "adc",
        name: "Analog Input Header",
        category: "Analog",
        purpose: "Routes analog input pins to the ATmega328P ADC.",
        details: ["A0–A5", "10-bit ADC"],
      },
      {
        id: "interfaces",
        name: "Power & ICSP Headers",
        category: "Expansion",
        purpose: "Expose power, reset, SPI and programming connections.",
        details: [
          "Power header",
          "6-pin ICSP headers",
          "UART, SPI and I2C signals",
        ],
      },
      {
        id: "reset",
        name: "Reset Button & LEDs",
        category: "User controls",
        purpose: "Provides manual reset and board status indication.",
        details: ["RESET push button", "ON, TX, RX and pin 13 LED indicators"],
      },
    ],
  },
  {
    id: "stm32",
    name: "STM32",
    model: "NUCLEO-F446RE",
    processor: "STM32F446RE",
    architecture: "32-bit ARM Cortex-M4",
    clock: "Up to 180 MHz",
    flash: "512 KB",
    ram: "128 KB SRAM",
    voltage: "3.3 V logic",
    connectivity: ["UART", "SPI", "I2C", "USB"],
    description:
      "An ARM Cortex-M4 development platform for real-time embedded applications, advanced peripherals and professional firmware development.",
    components: [
      {
        id: "cpu",
        name: "STM32F446RET6 MCU",
        category: "Main microcontroller",
        purpose:
          "The LQFP64 STM32 MCU at the centre of the NUCLEO-F446RE application area.",
        details: [
          "ARM Cortex-M4 with FPU and DSP",
          "Up to 180 MHz",
          "512 KB Flash and 128 KB SRAM",
        ],
      },
      {
        id: "stlink",
        name: "ST-LINK/V2-1",
        category: "Debugger & programmer",
        purpose:
          "On-board debugger/programmer used to flash and debug the target STM32 over SWD.",
        details: [
          "Integrated ST-LINK/V2-1 section",
          "USB connection to host computer",
          "Virtual COM port and debug interface",
        ],
      },
      {
        id: "usb",
        name: "ST-LINK USB Connector",
        category: "USB interface",
        purpose: "Connects the on-board ST-LINK interface to a host PC.",
        details: [
          "USB connector on the ST-LINK end of the board",
          "Used for programming, debugging and virtual COM port",
        ],
      },
      {
        id: "gpio",
        name: "Arduino & Morpho Headers",
        category: "I/O expansion",
        purpose: "Expose MCU signals for shields, sensors and custom circuits.",
        details: [
          "Arduino Uno V3-compatible headers",
          "ST Morpho expansion headers",
          "Alternate-function pin mapping",
        ],
      },
      {
        id: "adc",
        name: "12-bit ADC",
        category: "Analog",
        purpose:
          "Converts analog sensor signals into digital values in the STM32 MCU.",
        details: [
          "12-bit resolution",
          "Multiple ADC channels",
          "Input access through board headers",
        ],
      },
      {
        id: "interfaces",
        name: "Power & Communication",
        category: "Connectivity",
        purpose:
          "Provides power selection and access to serial and peripheral interfaces.",
        details: ["USART/UART", "SPI and I2C", "USB through ST-LINK interface"],
      },
      {
        id: "buttons",
        name: "User & Reset Buttons",
        category: "User controls",
        purpose: "Provides a user input and hardware reset for development.",
        details: ["B1 user push button", "B2 reset push button"],
      },
      {
        id: "leds",
        name: "User LEDs",
        category: "Indicators",
        purpose:
          "Provides visual status indicators for firmware and board activity.",
        details: ["User LED LD2", "ST-LINK communication/status LEDs"],
      },
      {
        id: "clock",
        name: "Clock Source",
        category: "Clock circuit",
        purpose:
          "Provides the external clock reference used by the MCU where configured.",
        details: [
          "Board clock circuitry; exact fitted source depends on board revision",
        ],
      },
    ],
  },
];

function Esp32({ pick }: { pick: (id: string) => void }) {
  const { scene } = useGLTF("/models/esp32-development-board-converted.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);

    // Clone each mesh material so this board can be recoloured safely
    // without mutating the cached GLTF scene used by Drei.
    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const sourceMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const materials = sourceMaterials.map((sourceMaterial) => {
        const material = sourceMaterial.clone() as MeshPhysicalMaterial;

        // In this GLB, mesh_0 is the PCB substrate (originally #0a0a0a).
        // Keep every other component material and texture unchanged.
        if (child.name === "mesh_0") {
          material.color.set("#1769AA");
          material.emissive.set("#06264A");
          material.emissiveIntensity = 0.16;
          material.roughness = 0.72;
          material.metalness = 0.08;
          material.needsUpdate = true;
        }

        return material;
      });

      child.material = Array.isArray(child.material) ? materials : materials[0];
    });

    clone.updateWorldMatrix(true, true);

    const bounds = new Box3().setFromObject(clone);
    if (bounds.isEmpty()) {
      console.error("ESP32 GLB: No visible mesh geometry found.");
      return null;
    }

    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const longestDimension = Math.max(size.x, size.y, size.z);

    if (!longestDimension) {
      console.error("ESP32 GLB: Invalid model dimensions.");
      return null;
    }

    // Fit the complete development board inside the viewer.
    const scale = 3.8 / longestDimension;

    return {
      scene: clone,
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale] as [
        number,
        number,
        number,
      ],
    };
  }, [scene]);

  if (!model) return null;

  return (
    <group position={model.position} scale={model.scale}>
      <primitive
        object={model.scene}
        dispose={null}
        onClick={(event: { stopPropagation: () => void }) => {
          event.stopPropagation();
          pick("cpu");
        }}
      />
    </group>
  );
}

useGLTF.preload("/models/esp32-development-board-converted.glb");

useGLTF.preload("/models/arduino-uno-r3.glb");

function Arduino({ pick }: { pick: (id: string) => void }) {
  const { scene } = useGLTF("/models/arduino-uno-r3.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);

    // Preserve the original Sketchfab materials and textures.
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    clone.updateWorldMatrix(true, true);

    // Calculate the complete model bounds.
    const bounds = new Box3().setFromObject(clone);

    if (bounds.isEmpty()) {
      console.error("Arduino Uno GLB: No visible geometry found.");
      return null;
    }

    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());

    const longestDimension = Math.max(size.x, size.y, size.z);

    if (longestDimension === 0) {
      console.error("Arduino Uno GLB: Invalid model dimensions.");
      return null;
    }

    // Normalize the model so it fits the 3D viewer.
    const scale = 4.2 / longestDimension;

    console.log("Arduino Uno model diagnostics:", {
      center: center.toArray(),
      size: size.toArray(),
      longestDimension,
      scale,
    });

    return {
      scene: clone,
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale] as [
        number,
        number,
        number,
      ],
    };
  }, [scene]);

  if (!model) return null;

  return (
    <group position={model.position} scale={model.scale}>
      <primitive
        object={model.scene}
        dispose={null}
        onClick={(event: { stopPropagation: () => void }) => {
          event.stopPropagation();
          pick("cpu");
        }}
      />
    </group>
  );
}

function Nucleo({ pick }: { pick: (id: string) => void }) {
  const { scene } = useGLTF("/models/NUCLEO-60-F401.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Preserve the GLB's original materials, textures and board colours.
        // Clone materials to avoid modifying Drei's cached scene.
        const sourceMaterials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        const materials = sourceMaterials.map((material) => material.clone());
        child.material = Array.isArray(child.material)
          ? materials
          : materials[0];
      }
    });

    clone.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(clone);

    if (bounds.isEmpty()) {
      console.error("NUCLEO GLB: No visible mesh geometry found.");
      return null;
    }

    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const longestDimension = Math.max(size.x, size.y, size.z);

    if (!longestDimension) {
      console.error("NUCLEO GLB: Invalid model dimensions.");
      return null;
    }

    // Normalize the complete board so it fits the same viewer as the other models.
    const scale = 4.2 / longestDimension;

    return {
      scene: clone,
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale] as [
        number,
        number,
        number,
      ],
    };
  }, [scene]);

  if (!model) return null;

  return (
    <group position={model.position} scale={model.scale}>
      <primitive
        object={model.scene}
        dispose={null}
        onClick={(event: { stopPropagation: () => void }) => {
          event.stopPropagation();
          pick("cpu");
        }}
      />
    </group>
  );
}

useGLTF.preload("/models/NUCLEO-60-F401.glb");

function BoardScene({
  boardId,
  selected,
  onSelect,
}: {
  boardId: BoardId;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <color attach="background" args={["#030b1a"]} />

      <ambientLight intensity={1.1} />

      <hemisphereLight args={["#ffffff", "#253047", 1.2]} />

      <directionalLight position={[5, 8, 6]} intensity={2} />

      <directionalLight
        position={[-5, 4, -5]}
        intensity={0.8}
        color="#9bbcff"
      />

      <pointLight position={[0, 4, 3]} intensity={0.5} color="#22d3ee" />

      {boardId === "esp32" && <Esp32 pick={onSelect} />}

      {boardId === "arduino" && <Arduino pick={onSelect} />}

      {boardId === "stm32" && <Nucleo pick={onSelect} />}

      <OrbitControls
        makeDefault
        enableRotate
        enableZoom
        enablePan
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        zoomSpeed={1.2}
        panSpeed={0.8}
        minDistance={2}
        maxDistance={14}
        target={[0, 0, 0]}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  );
}

function ComponentCarousel({
  components,
  selectedId,
  onSelect,
}: {
  components: BoardComponent[];
  selectedId: string;
  onSelect: (component: BoardComponent) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = () => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    const cardStep = firstCard.getBoundingClientRect().width + 12;
    setActiveIndex(
      Math.max(
        0,
        Math.min(
          components.length - 1,
          Math.round(track.scrollLeft / cardStep),
        ),
      ),
    );
  };

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardStep =
      (firstCard?.getBoundingClientRect().width ?? track.clientWidth) + 12;
    track.scrollBy({ left: direction * cardStep, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono text-slate-500">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(components.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous component"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowUpRight className="h-4 w-4 rotate-[225deg]" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={activeIndex >= components.length - 1}
            aria-label="Next component"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowUpRight className="h-4 w-4 rotate-45" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateActiveIndex}
        className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] [scrollbar-color:#164e63_transparent]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {components.map((item, index) => {
          const isSelected = selectedId === item.id;

          return (
            <button
              type="button"
              key={`${item.id}-${index}`}
              onClick={() => onSelect(item)}
              aria-haspopup="dialog"
              aria-label={`View ${item.name} details`}
              aria-pressed={isSelected}
              className={`group min-h-[150px] w-[84%] max-w-[320px] shrink-0 snap-start rounded-xl border p-3.5 text-left transition-all duration-200 sm:min-h-[170px] sm:w-[48%] sm:p-4 ${
                isSelected
                  ? "border-cyan-400/70 bg-cyan-500/10 shadow-lg shadow-cyan-950/30"
                  : "border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 hover:bg-slate-900"
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-2">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    isSelected
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 bg-slate-900 text-slate-400 group-hover:text-cyan-300"
                  }`}
                >
                  <CircuitBoard className="h-5 w-5" />
                </span>
                <Info
                  className={`h-4 w-4 ${isSelected ? "text-cyan-300" : "text-slate-600"}`}
                />
              </div>
              <span className="block text-sm font-semibold leading-snug text-slate-100">
                {item.name}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-slate-500">
                {item.category}
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                View details <ArrowUpRight className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        {components.map((item, index) => (
          <button
            type="button"
            key={`dot-${item.id}-${index}`}
            onClick={() => {
              const track = trackRef.current;
              const card = track?.children[index] as HTMLElement | undefined;
              if (track && card) {
                track.scrollTo({
                  left: card.offsetLeft - track.offsetLeft,
                  behavior: "smooth",
                });
              }
            }}
            aria-label={`Go to component ${index + 1}: ${item.name}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index
                ? "w-6 bg-cyan-400"
                : "w-1.5 bg-slate-700 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function MicrocontrollerExplorer() {
  const [activeBoard, setActiveBoard] = useState<BoardId>("esp32");
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [selectedComponent, setSelectedComponent] = useState("cpu");
  const [openComponent, setOpenComponent] = useState<BoardComponent | null>(
    null,
  );
  const board = boards.find((item) => item.id === activeBoard)!;
  const component =
    board.components.find((item) => item.id === selectedComponent) ??
    board.components[0];

  const selectBoard = (id: BoardId) => {
    setActiveBoard(id);
    setSelectedComponent("cpu");
    setOpenComponent(null);
  };

  useEffect(() => {
    if (!openComponent) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenComponent(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openComponent]);

  return (
    <div className="min-w-0 space-y-4 text-left sm:space-y-6">
      <div className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <Cpu className="h-4 w-4" />
            Multi-Microcontroller Explorer
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
            Explore the Hardware
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Explore board specifications, processing architecture and hardware
            components.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:py-2 ${viewMode === "3d" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            3D Explorer
          </button>
          <button
            type="button"
            onClick={() => setViewMode("details")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${viewMode === "details" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Specifications
          </button>
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin] [scrollbar-color:#164e63_transparent] sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible">
        {boards.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => selectBoard(item.id)}
            aria-pressed={activeBoard === item.id}
            className={`w-[42%] min-w-[132px] shrink-0 snap-start rounded-xl border p-3 text-left transition-all sm:w-auto sm:min-w-0 sm:p-4 ${activeBoard === item.id ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/5" : "border-slate-800 bg-slate-900/60 hover:border-slate-600"}`}
          >
            <Cpu
              className={`mb-2 h-5 w-5 ${activeBoard === item.id ? "text-cyan-400" : "text-slate-500"}`}
            />
            <span className="block text-sm font-bold text-white">
              {item.name}
            </span>
            <span className="mt-1 block text-[10px] font-mono text-slate-400">
              {item.model}
            </span>
          </button>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#030b1a] p-3 sm:min-h-[390px] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-cyan-400">
                {board.model}
              </span>
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono text-emerald-400">
                {viewMode === "3d"
                  ? "INTERACTIVE 3D MODEL"
                  : "BOARD SPECIFICATIONS"}
              </span>
            </div>
            {viewMode === "3d" ? (
              <>
                <div
                  className="mt-2 h-[230px] w-full overflow-hidden rounded-xl sm:h-[300px]"
                  style={{ touchAction: "pan-y pinch-zoom" }}
                >
                  <Canvas
                    camera={{
                      position: [0, 2.5, 6.5],
                      fov: 38,
                      near: 0.01,
                      far: 100,
                    }}
                    dpr={[1, 1.5]}
                    gl={{
                      antialias: true,
                      alpha: false,
                      powerPreference: "high-performance",
                    }}
                  >
                    <Suspense fallback={null}>
                      <BoardScene
                        boardId={activeBoard}
                        selected={component.id}
                        onSelect={setSelectedComponent}
                      />
                    </Suspense>
                  </Canvas>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Rotate3D className="h-3.5 w-3.5 text-cyan-400" />
                    Drag to rotate
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointer2 className="h-3.5 w-3.5 text-cyan-400" />
                    Click components to inspect
                  </span>
                  <span>Scroll or pinch to zoom</span>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col justify-center py-8">
                <h4 className="text-2xl font-bold text-white">{board.model}</h4>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                  {board.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Processor", value: board.processor },
                    { label: "Architecture", value: board.architecture },
                    { label: "Clock", value: board.clock },
                    { label: "Logic", value: board.voltage },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs font-mono font-semibold text-cyan-300">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 sm:mt-auto sm:grid-cols-4 sm:pt-4">
              {[
                { label: "Clock", value: board.clock },
                { label: "Flash", value: board.flash },
                { label: "RAM", value: board.ram },
                { label: "Logic", value: board.voltage },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs font-mono font-semibold text-cyan-300">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4 lg:col-span-5">
          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  {board.name} Components
                </h4>
              </div>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-mono text-cyan-300">
                {board.components.length} PARTS
              </span>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              Select an individual component card to inspect its role and
              technical details.
            </p>

            <ComponentCarousel
              components={board.components}
              selectedId={component.id}
              onSelect={(item) => {
                setSelectedComponent(item.id);
                setOpenComponent(item);
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Radio className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Communication Interfaces
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {board.connectivity.map((item) => (
            <span
              key={item}
              className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-[11px] font-mono text-cyan-200"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <p className="flex items-center gap-2 text-[10px] leading-relaxed text-slate-500">
        <Gauge className="h-3.5 w-3.5 shrink-0" />
        Component identities are based on manufacturer documentation. 3D
        geometry and placement are visual approximations, not
        manufacturing-accurate CAD; verify the exact board revision before
        hardware design.
      </p>

      {openComponent && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/90 px-3 py-4 backdrop-blur-md sm:items-center sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpenComponent(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="component-detail-title"
            className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-cyan-400/30 bg-[#071323] shadow-2xl shadow-cyan-950/40 sm:max-h-[90dvh]"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-300" />
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                  <CircuitBoard className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300">
                    {board.name} · Component details
                  </p>
                  <h3
                    id="component-detail-title"
                    className="mt-1 text-xl font-bold text-white sm:text-2xl"
                  >
                    {openComponent.name}
                  </h3>
                  <span className="mt-2 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-mono text-cyan-200">
                    {openComponent.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenComponent(null)}
                aria-label="Close component details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-cyan-400/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
              <div>
                <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Component overview
                </p>
                <p className="text-sm leading-7 text-slate-200">
                  {openComponent.purpose}
                </p>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Technical details
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {openComponent.details.map((detail, detailIndex) => (
                    <div
                      key={`${openComponent.id}-${detailIndex}`}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/65 p-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                      <span className="text-xs leading-6 text-slate-300">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/60 px-4 py-3 sm:px-6 sm:py-4">
              <span className="text-[10px] font-mono text-slate-500">
                {board.model}
              </span>
              <button
                type="button"
                onClick={() => setOpenComponent(null)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Got it
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
