import heroWorkspaceImg from "../assets/images/hero_embedded_workspace_1791651006673.jpg";
import mediscanAiImg from "../assets/images/mediscan_ai_preview_1791651022577.jpg";
import iotSolarImg from "../assets/images/iot_solar_monitor_1791651036487.jpg";
import webInternshipImg from "../assets/images/web_internship_showcase_1791651048405.jpg";

export { heroWorkspaceImg, mediscanAiImg, iotSolarImg, webInternshipImg };

export interface Project {
  id: string;
  title: string;
  category: "All" | "Embedded & IoT" | "AI & Web" | "Internships";
  badge: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  highlights: string[];
  architecture?: string[];
  metrics?: { label: string; value: string }[];
}

export interface TimelineMilestone {
  year: string;
  title: string;
  subtitle: string;
  summary: string;
  story: string;
  technologies: string[];
  achievements: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  description?: string;
  skills: {
    name: string;
    highlight?: boolean;
    level: string;
    desc?: string;
  }[];
}

export interface PortfolioStat {
  label: string;
  value: string;
  note: string;
}

export interface AboutPillar {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  description: string;
  summary: string;
  details: string[];
}

export interface ConnectChannel {
  id: string;
  name: string;
  icon: string;
  handle: string;
  description: string;
  url: string;
  actionLabel: string;
  order: number;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Gnani",
    fullName: "Gnanendra",
    roleTag: "",
    roles: [
      "Arduino & ESP32 Developer",
      "Full Stack Web Engineer",
      "IoT Solutions Creator",
      "AI Integration Enthusiast",
    ],
    shortBio:
      "Passionate about Embedded Systems, AI, IoT, and Full Stack Development. I enjoy creating technology that solves real-world problems and continuously learning to become a better engineer.",
    extendedBio:
      "I'm Gnani, a B.Tech Final Year Electronics and Communication Engineering student with a strong passion for Embedded Systems, IoT, Artificial Intelligence, and Full Stack Development. I enjoy turning ideas into practical engineering solutions by combining hardware and software. Every project I build is an opportunity to learn, improve, and move one step closer to becoming a skilled engineer.",
    email: "gnanendra714@gmail.com",
    location: "India",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    availableForHire: true,
    mcuBoard: "ESP32-WROOM-32D",
    mcuClock: "240MHz",
    mcuBaud: "UART 115200",
  },

  stats: [
    {
      label: "Microcontroller Platforms",
      value: "4+",
      note: "ESP32, ESP8266, Arduino, ATmega",
    },
    {
      label: "Completed Projects",
      value: "12+",
      note: "Hardware firmware & web applications",
    },
    {
      label: "Internship Tasks Shipped",
      value: "6/6",
      note: "SaiKet Systems production deliverables",
    },
    {
      label: "Academic Standing",
      value: "Final Year",
      note: "B.Tech Electronics & Communication",
    },
  ] as PortfolioStat[],

  aboutPillars: [
    {
      id: "academic-foundation",
      title: "Academic Foundation",
      icon: "Cpu",
      subtitle: "B.Tech in ECE",
      description:
        "Exploring core electronics, circuit design, and microcontroller-based systems.",
      summary:
        "Building a foundation in electronics, circuit design, microprocessors and communication systems.",
      details: [],
    },
    {
      id: "hardware-focus",
      title: "Hardware Focus",
      icon: "Cpu",
      subtitle: "Embedded Systems & IoT",
      description:
        "Developing smart embedded solutions using Arduino, ESP32, sensors, and microcontrollers.",
      summary:
        "Developing embedded applications using microcontrollers, Embedded C, sensor interfacing, communication protocols and hardware-software integration.",
      details: [],
    },
    {
      id: "software-focus",
      title: "Software Focus",
      icon: "Cpu",
      subtitle: "Full-Stack Development",
      description:
        "Building responsive web applications using React, Node.js, Express, and MongoDB.",
      summary:
        "Building responsive web applications, backend services, REST APIs and database-driven applications.",
      details: [],
    },
  ] as AboutPillar[],

  skills: [
    {
      id: "embedded",
      name: "Embedded Systems",
      iconName: "Cpu",
      skills: [
        {
          name: "ESP32 & ESP-IDF",
          level: "Advanced",
          highlight: true,
          desc: "Dual-core Xtensa LX6, Wi-Fi, BLE, FreeRTOS tasks & ADC calibration",
        },
        {
          name: "Arduino IDE & PlatformIO",
          level: "Advanced",
          highlight: true,
          desc: "Modular C/C++ firmware architectures and board managers",
        },
        {
          name: "ESP8266 & ATmega328P",
          level: "Proficient",
          highlight: false,
          desc: "Lightweight IoT microcontrollers and AVR core registers",
        },
        {
          name: "Peripherals & Timers",
          level: "Advanced",
          highlight: true,
          desc: "Hardware timers, external interrupts, PWM pulse control, DAC",
        },
        {
          name: "FreeRTOS Basics",
          level: "Proficient",
          highlight: false,
          desc: "Multitasking, queues, semaphores and task priority management",
        },
      ],
    },
    {
      id: "hardware",
      name: "Electronics & Hardware",
      iconName: "Zap",
      skills: [
        {
          name: "Circuit Design & Prototyping",
          level: "Advanced",
          highlight: true,
          desc: "Breadboard prototyping, schematic capture, signal routing",
        },
        {
          name: "Sensor & Actuator Interfacing",
          level: "Advanced",
          highlight: true,
          desc: "DHT22, ultrasonic, ACS712 current, INA219, LDR, soil capacitive",
        },
        {
          name: "Power Management & Solar",
          level: "Proficient",
          highlight: true,
          desc: "LDO & Buck converters, TP4056 lithium charging, solar harvesting",
        },
        {
          name: "Switching Circuits",
          level: "Advanced",
          highlight: true,
          desc: "Optocoupler isolated relays, N-channel MOSFETs, bipolar transistors",
        },
        {
          name: "Displays & Readouts",
          level: "Advanced",
          highlight: false,
          desc: "SSD1306 monochrome OLED (I2C/SPI), LCD 16x2, 7-segment displays",
        },
      ],
    },
    {
      id: "iot",
      name: "Communication & IoT",
      iconName: "Radio",
      skills: [
        {
          name: "Hardware Protocols",
          level: "Advanced",
          highlight: true,
          desc: "I2C multi-device buses, high-speed SPI, and UART serial communication",
        },
        {
          name: "Wireless Standards",
          level: "Advanced",
          highlight: true,
          desc: "Wi-Fi 802.11 b/g/n station/AP modes, BLE advertisement, ESP-NOW",
        },
        {
          name: "IoT Network Protocols",
          level: "Proficient",
          highlight: true,
          desc: "MQTT pub/sub architecture, lightweight JSON telemetry, HTTP/REST",
        },
        {
          name: "Cloud IoT Platforms",
          level: "Proficient",
          highlight: false,
          desc: "ThingSpeak analytics, Adafruit IO feeds, custom MQTT brokers",
        },
      ],
    },
    {
      id: "fullstack",
      name: "Full-Stack Development",
      iconName: "Layout",
      skills: [
        {
          name: "React 19 & Next.js",
          level: "Proficient",
          highlight: true,
          desc: "Modular functional components, custom hooks, and modern client state",
        },
        {
          name: "Node.js & Express.js",
          level: "Proficient",
          highlight: true,
          desc: "RESTful API architectures, custom middleware, async routing",
        },
        {
          name: "Database Systems",
          level: "Proficient",
          highlight: true,
          desc: "MongoDB document models, CRUD operations, PostgreSQL schemas",
        },
        {
          name: "Tailwind CSS & Modern UI",
          level: "Advanced",
          highlight: true,
          desc: "Design systems, glassmorphism, responsive breakpoints & dark themes",
        },
        {
          name: "HTML5, CSS3 & JavaScript",
          level: "Advanced",
          highlight: false,
          desc: "Semantic layout, CSS Grid/Flexbox, ES6+ asynchronous syntax",
        },
      ],
    },
    {
      id: "tools",
      name: "Programming & Tools",
      iconName: "Wrench",
      skills: [
        {
          name: "C & Embedded C++",
          level: "Advanced",
          highlight: true,
          desc: "Memory efficiency, pointers, bitwise manipulation, hardware registers",
        },
        {
          name: "Python & TypeScript",
          level: "Proficient",
          highlight: true,
          desc: "Data parsing, backend scripts, strictly typed client systems",
        },
        {
          name: "Git & GitHub Workflows",
          level: "Proficient",
          highlight: true,
          desc: "Branching strategies, commit history, releases, and open source",
        },
        {
          name: "Diagnostic Instruments",
          level: "Proficient",
          highlight: false,
          desc: "Digital multimeters, logic analyzers, serial monitors, Postman",
        },
        {
          name: "VS Code & Toolchains",
          level: "Advanced",
          highlight: false,
          desc: "Primary development hub with PlatformIO, Vite, and npm toolchains",
        },
      ],
    },
  ] as SkillCategory[],

  projects: [
    {
      id: "sbdcs-battery-diagnostic",
      title: "Smart Battery Diagnostic & Charging System (SBDCS)",
      category: "Embedded & IoT",
      badge: "Hardware Engineering Showcase",
      shortDescription:
        "Intelligent lithium-ion battery health analyzer featuring real-time internal impedance calculation, Coulomb counting, state-of-health (SoH) algorithms, and automated thermal protection.",
      fullDescription:
        "Lithium-ion cells in electric mobility and energy storage systems suffer from unpredictable thermal runaway and undetected internal degradation. SBDCS was engineered as a hardware-firmware solution: utilizing an ESP32 microcontroller, INA219 high-side current/voltage sensor, calibrated precision load resistor, and thermal thermistors.",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      tags: [
        "ESP32",
        "Embedded C++",
        "INA219",
        "OLED SSD1306",
        "Relay Protection",
        "IoT Telemetry",
        "MQTT",
      ],
      githubUrl: "https://github.com",
      liveUrl: "#",
      highlights: [
        "Dynamic internal impedance measurement using pulsed-load voltage drop analysis.",
        "Continuous Coulomb counting for accurate State-of-Charge (SoC) and State-of-Health (SoH) tracking.",
        "Dual-stage relay isolation for over-voltage (>4.25V) and over-temperature (>50°C) cutoff.",
        "Local OLED dashboard with rolling battery health percentage and charge cycle metrics.",
      ],
      architecture: [
        "High-side precision current & bus voltage sensing via INA219 (I2C address 0x40)",
        "Calibrated test load switching using high-efficiency N-channel power MOSFET",
        "ESP32 firmware written in C++ with non-blocking state machine scheduler",
      ],
      metrics: [
        { label: "Voltage Precision", value: "±4 mV" },
        { label: "Current Sampling", value: "1 kHz" },
        { label: "Cutoff Latency", value: "< 12 ms" },
      ],
    },
    {
      id: "smart-agri-iot",
      title: "IoT Smart Agriculture Monitoring & Automation",
      category: "Embedded & IoT",
      badge: "Agricultural IoT Solution",
      shortDescription:
        "Autonomous agro-climatic telemetry station monitoring soil moisture, ambient humidity, and temperature with automated closed-loop irrigation actuation.",
      fullDescription:
        "Engineered to reduce water wastage in precision agriculture. The system integrates capacitive soil moisture sensors, a DHT22 high-accuracy temperature/humidity sensor, and an ambient light sensor connected to an ESP32.",
      image:
        "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80",
      tags: [
        "ESP32",
        "C++",
        "Capacitive Sensors",
        "DHT22",
        "Optocoupler Relay",
        "Wi-Fi Telemetry",
      ],
      githubUrl: "https://github.com",
      liveUrl: "#",
      highlights: [
        "Capacitive soil moisture sensing with corrosion-resistant analog probes.",
        "Closed-loop automated irrigation logic with hysteresis to prevent relay flutter.",
        "Wi-Fi telemetry dispatching sensor payloads every 30 seconds.",
      ],
      architecture: [
        "Multi-sensor probe array (Soil moisture, DHT22, LDR photodiode)",
        "ESP32 ADC calibration with 11dB attenuation and moving average noise smoothing",
        "Active-low relay driver circuit driving 12V DC water pump/solenoid",
      ],
      metrics: [
        { label: "Water Conservation", value: "38%" },
        { label: "Telemetry Interval", value: "30s" },
        { label: "Sensor Lifespan", value: "2.5x vs Resistive" },
      ],
    },
    {
      id: "iot-solar-monitor",
      title: "Solar Power & Energy Telemetry System",
      category: "Embedded & IoT",
      badge: "Renewable Energy Telemetry",
      shortDescription:
        "Autonomous photovoltaic power monitoring station measuring real-time solar cell voltage, current, and wattage with local OLED readout and ESP32 telemetry.",
      fullDescription:
        "A custom hardware project developed to monitor green energy yield. Utilizing an ESP32 microcontroller, ACS712 Hall-effect current sensor, and calibrated voltage divider circuit, the system computes real-time power generation (Watts), cumulative energy, and system operating temperature.",
      image:
        "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
      tags: [
        "ESP32",
        "C++",
        "IoT",
        "Sensors",
        "OLED SSD1306",
        "ACS712",
        "Relay Modules",
      ],
      githubUrl: "https://github.com",
      liveUrl: "#",
      highlights: [
        "Direct analog sensor acquisition with moving average noise filtration.",
        "High-contrast 128x64 OLED dashboard updated at 10Hz without blocking delays.",
        "Over-voltage and thermal safety trigger linked to an automated 5V cooling fan relay.",
      ],
      architecture: [
        "Solar photovoltaic panel (12V rated) with load resistor bank",
        "Analog signal conditioner: Voltage divider & ACS712 5A current sensor",
        "ESP32 firmware written in C++ using non-blocking millis() scheduler",
      ],
      metrics: [
        { label: "Sampling Rate", value: "10 Hz" },
        { label: "Voltage Range", value: "0 - 25V" },
        { label: "Current Accuracy", value: "±66 mA" },
      ],
    },
    {
      id: "mediscan-ai",
      title: "MediScan AI — Medical Diagnostic Report Analyzer",
      category: "AI & Web",
      badge: "AI Diagnostic Application",
      shortDescription:
        "Intelligent full-stack web application converting clinical lab reports and biomarker values into plain-English health summaries with high-speed Groq inference.",
      fullDescription:
        "Engineered as a responsive medical assistance portal. Patients can upload or input diagnostic test values, which are parsed and correlated with reference ranges.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      tags: [
        "React.js",
        "Python",
        "Flask",
        "Groq AI",
        "Tailwind CSS",
        "Biomarkers",
      ],
      githubUrl: "https://github.com",
      liveUrl: "#",
      highlights: [
        "High-speed structured medical inference using Groq Llama 3 70B.",
        "Automated biomarker extraction and reference-range deviation highlighting.",
        "Zero-storage privacy architecture: report text processed ephemerally.",
      ],
      architecture: [
        "React frontend with custom validation and biomarker table inputs",
        "Python/Flask backend proxying requests to Groq inference engine",
      ],
      metrics: [
        { label: "Inference Speed", value: "< 650 ms" },
        { label: "Supported Panels", value: "18+" },
        { label: "Data Retention", value: "0 sec (Zero-Trace)" },
      ],
    },
    {
      id: "efhjnbvc-7399",
      title: "efhjnbvc",
      category: "Embedded & IoT",
      badge: "Engineering Showcase",
      shortDescription:
        "Engineering ShowcaseEngineering ShowcaseEngineering ShowcaseEngineering Showcase",
      fullDescription:
        "Engineering ShowcaseEngineering ShowcaseEngineering ShowcaseEngineering ShowcaseEngineering ShowcaseEngineering ShowcaseEngineering Showcase",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      tags: ["ESP32", "C++"],
      githubUrl: "https://github.com",
      liveUrl: "#",
      highlights: ["Autonomous firmware state machine"],
      architecture: [],
      metrics: [],
    },
  ] as Project[],

  timeline: [
    {
      year: "2023",
      title: "The Beginning",
      subtitle: "Initiation into Electronics & Coding",
      summary:
        "Started my B.Tech journey and took my first steps into the world of technology.",
      story:
        "2023 marked the beginning of my engineering journey as I started my B.Tech in Electronics and Communication Engineering while joining the NxtWave program. Learning HTML and CSS gave me my first experience in creating websites and sparked my curiosity to explore programming.",
      technologies: ["HTML", "CSS", "C Programming", "Basic Arduino"],
      achievements: [
        "Started B.Tech in Electronics & Communication Engineering",
        "Joined the NxtWave intensive training program",
        "Learned HTML and CSS fundamentals & responsive layouts",
        "Built my first basic Arduino project and circuit experiments",
      ],
    },
    {
      year: "2024",
      title: "Building Strong Foundations",
      subtitle: "Hardware Protocols Meets Full Stack Web",
      summary:
        "Expanded my skills in programming, electronics, and real-world project development.",
      story:
        "2024 was a pivotal phase of deepening practical engineering competence. I mastered JavaScript, Node.js, and Express while diving deep into microcontrollers—working with ESP8266 and ESP32 chips, writing firmware in the Arduino IDE, and mastering serial protocols like UART and I2C.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Node.js",
        "Git & GitHub",
        "VS Code",
        "Arduino IDE",
        "ESP8266",
        "ESP32",
      ],
      achievements: [
        "Deepened JavaScript proficiency and modern asynchronous workflows",
        "Transitioned to ESP32 dual-core microcontrollers with Wi-Fi & Bluetooth",
        "Built multi-sensor acquisition systems with OLED screens",
        "Adopted Git version control and collaborative GitHub workflows",
      ],
    },
    {
      year: "2025",
      title: "Turning Knowledge into Real Projects",
      subtitle: "Applied AI, Internships & Solar Telemetry",
      summary:
        "Applied my skills to develop real-world software and smart embedded systems.",
      story:
        "In 2025, theory transformed into production-ready software and tangible hardware prototypes. Completed a 6-task Front-End Development Internship at SaiKet Systems. Developed MediScan AI and designed an end-to-end IoT solar energy telemetry system.",
      technologies: [
        "React.js",
        "Python",
        "Flask",
        "Groq AI",
        "MongoDB",
        "IoT Sensors",
        "Solar Telemetry",
        "Tailwind CSS",
      ],
      achievements: [
        "Completed 6-task Front-End Development Internship at SaiKet Systems",
        "Engineered MediScan AI medical report intelligence application",
        "Prototyped IoT Solar Energy and Real-Time Power Monitoring system",
        "Mastered responsive component architectures and modern dark UI systems",
      ],
    },
    {
      year: "2026",
      title: "Final Year Innovation & Horizon",
      subtitle: "Hardware-Software Synergy & Professional Growth",
      summary:
        "Engineering advanced cyber-physical solutions and launching into the tech industry.",
      story:
        "Currently in the final year of B.Tech Electronics & Communication Engineering. Focused on architecting robust systems that bridge low-level physical microcontrollers with high-level web platforms, cloud databases, and intelligent AI models.",
      technologies: [
        "ESP32",
        "React 19",
        "TypeScript",
        "Embedded Systems",
        "IoT Architectures",
        "Edge Computing",
      ],
      achievements: [
        "Approaching B.Tech Electronics & Communication Engineering graduation",
        "Refining portfolio and engineering case studies with high-fidelity polish",
        "Prepared for roles in Embedded Systems, IoT, and Full Stack Web Development",
      ],
    },
  ] as TimelineMilestone[],

  connectChannels: [
    {
      id: "email",
      name: "Email",
      icon: "Mail",
      handle: "gnanendra714@gmail.com",
      description:
        "Reach out for internships, projects, collaborations, or technical discussions.",
      url: "mailto:gnanendra714@gmail.com",
      actionLabel: "Send an Email",
      order: 1,
    },
    {
      id: "github",
      name: "GitHub",
      icon: "Github",
      handle: "https://github.com/Gnanendra714/",
      description: "Explore my projects, source code, and development journey.",
      url: "https://github.com",
      actionLabel: "View Repositories",
      order: 2,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "Linkedin",
      handle: "https://www.linkedin.com/in/gnanendra-ganne-859858346",
      description:
        "Connect professionally and explore career & internship opportunities.",
      url: "https://linkedin.com",
      actionLabel: "Connect on LinkedIn",
      order: 3,
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "Youtube",
      handle: "@CircuitForge7149",
      description: "Arduino tutorials, engineering projects, and tech content.",
      url: "https://youtube.com/@circuitforge7149?si=POMXpq7IWUPgk3R8",
      actionLabel: "Watch Tutorials",
      order: 4,
    },
  ] as ConnectChannel[],
};
