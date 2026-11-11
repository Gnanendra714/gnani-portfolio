import bcrypt from "bcryptjs";

import { HeroModel } from "../models/Hero.js";
import { AboutModel } from "../models/About.js";
import { SkillModel } from "../models/Skill.js";
import { ProjectModel } from "../models/Project.js";
import { JourneyModel } from "../models/Journey.js";
import { ConnectModel } from "../models/Connect.js";
import { AdminModel } from "../models/Admin.js";
import { SkillsSectionModel } from "../models/SkillsSection.js";
import { ProjectsSectionModel } from "../models/ProjectsSection.js";
import { TimelineSectionModel } from "../models/TimelineSection.js";

import { isDbConnected } from "../config/db.js";

export const INITIAL_HERO = {
  name: "Gnani",
  fullName: "Gnanendra",
  roleTag: "ELECTRONICS & EMBEDDED SYSTEMS ENGINEER",
  roles: [
    "Arduino & ESP32 Developer",
    "Full Stack Web Engineer",
    "IoT Solutions Creator",
    "AI Integration Enthusiast",
  ],
  shortBio:
    "B.Tech Final Year Electronics and Communication Engineering student with a strong passion for Embedded Systems, IoT, Artificial Intelligence, and Full Stack Development. I enjoy creating technology that solves real-world problems and continuously learning to become a better engineer.",
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
  ],
};

export const INITIAL_ABOUT = {
  kicker: "ABOUT ME",
  headline: "The Mind Behind the Machine",
  workflowTitle: "The Cyber-Physical Workflow",
  workflowSubtitle:
    "How Gnani bridges the gap between raw hardware signals and cloud software",
  workflowSteps: [
    {
      step: "01. Physical Layer",
      title: "Sensors & Microcontrollers",
      desc: "Analog/digital reading from temperature, current (ACS712), and light sensors into ESP32 ADC & GPIOs.",
    },
    {
      step: "02. Firmware & Processing",
      title: "Deterministic C++ Architecture",
      desc: "Non-blocking loop architectures, ADC calibration, interrupt servicing, and calibration filters.",
    },
    {
      step: "03. Connectivity & Edge",
      title: "Protocols & Wireless Pipelines",
      desc: "Publishing sensor payloads over Wi-Fi, MQTT, or serial UART streams to cloud brokers.",
    },
    {
      step: "04. Cloud & Interface",
      title: "Full-Stack Web Dashboards",
      desc: "React 19 interfaces displaying real-time telemetry, historical charts, and digital controls.",
    },
  ],
  pillars: [
    {
      id: "embedded",
      title: "Embedded Systems & IoT",
      icon: "Cpu",
      summary:
        "Developing smart embedded solutions using Arduino, ESP32, sensors, and microcontrollers.",
      details: [
        "Hardware-level firmware development in C/C++ with Arduino & PlatformIO.",
        "Sensor integration: DHT11, Ultrasonic, ACS712 Current, LDR, OLED SSD1306.",
        "Serial protocols: I2C, SPI, UART, and Wi-Fi/BLE communication on ESP32.",
        "Circuit prototyping, voltage regulation, and relay-driven high-voltage actuation.",
      ],
    },
    {
      id: "fullstack",
      title: "Full Stack Development",
      icon: "Code2",
      summary:
        "Building responsive web applications using React, Node.js, Express, and modern styling.",
      details: [
        "Clean component architectures with React 19, TypeScript, and modern state management.",
        "Scalable backend services with Express.js, RESTful endpoints, and JWT authentication.",
        "Database modeling with MongoDB & relational schema considerations.",
        "Pixel-perfect responsive design systems using Tailwind CSS and ergonomic layouts.",
      ],
    },
  ],
  education: {
    degree: "Bachelor of Technology (B.Tech)",
    institution: "Electronics & Communication Engineering",
    specialization: "Embedded Systems & IoT Specialization",
    year: "2023 - 2026",
    status: "Final Year Active",
    highlights: [
      "Core focus on Embedded Microcontrollers, Digital Circuit Design, and Microprocessors.",
      "Active developer at NxtWave intensive training program for full-stack engineering.",
      "Designed and prototyped automated solar, agricultural, and telemetry hardware platforms.",
    ],
  },
};

export const INITIAL_SKILLS_SECTION = {
  kicker: "TECHNICAL ARSENAL",
  headline: "Engineering Competencies & Protocols",
  description:
    "Proficiency spanning low-level bare-metal firmware, communications buses, and modern full-stack web platforms.",
};

export const INITIAL_SKILLS = [
  {
    id: "embedded",
    name: "Embedded Systems",
    iconName: "Cpu",
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
];

export const INITIAL_PROJECTS_SECTION = {
  kicker: "PORTFOLIO OF WORK",
  headline: "Signature Engineering Deliverables",
  description:
    "Production-ready embedded hardware prototypes, IoT monitoring hubs, and high-performance software applications.",
};

export const INITIAL_PROJECTS = [
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
    featured: true,
    published: true,
    order: 1,
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
    featured: true,
    published: true,
    order: 2,
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
    featured: true,
    published: true,
    order: 3,
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
    featured: true,
    published: true,
    order: 4,
  },
];

export const INITIAL_TIMELINE_SECTION = {
  kicker: "CAREER & EDUCATION",
  headline: "Engineering Journey & Milestones",
  description:
    "The progressive path from first circuit prototypes to enterprise web platforms and IoT systems.",
};

export const INITIAL_JOURNEY = [
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
    order: 1,
    published: true,
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
    order: 2,
    published: true,
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
    order: 3,
    published: true,
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
    order: 4,
    published: true,
  },
];

export const INITIAL_CONNECT = {
  kicker: "GET IN TOUCH",
  headline: "Let's Connect and Build Together",
  description:
    "Always open to discussing embedded systems, IoT architecture, or full-stack opportunities.",
  formTitle: "Send a Direct Message",
  formSubtitle:
    "Reach out directly for internships, collaborations, or hardware discussions.",
  email: "gnanendra714@gmail.com",
  location: "India",
  channels: [
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
      handle: "github.com/gnani",
      description: "Explore my projects, source code, and development journey.",
      url: "https://github.com",
      actionLabel: "View Repositories",
      order: 2,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "Linkedin",
      handle: "linkedin.com/in/gnani",
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
      handle: "@GnaniTechEngineering",
      description: "Arduino tutorials, engineering projects, and tech content.",
      url: "https://youtube.com",
      actionLabel: "Watch Tutorials",
      order: 4,
    },
  ],
};

/**
 * Initializes collections with seed data if they are empty,
 * and ensures an initial Admin account exists.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  if (!isDbConnected()) {
    return;
  }

  try {
    // 1. Seed Hero
    const heroCount = await HeroModel.countDocuments();
    if (heroCount === 0) {
      await HeroModel.create(INITIAL_HERO);
      console.log("🌱 [Seed] Seeded initial Hero record into MongoDB Atlas.");
    }

    // 2. Seed About
    const aboutCount = await AboutModel.countDocuments();
    if (aboutCount === 0) {
      await AboutModel.create(INITIAL_ABOUT);
      console.log("🌱 [Seed] Seeded initial About record into MongoDB Atlas.");
    }

    // 3. Seed Skills
    const skillCount = await SkillModel.countDocuments();
    if (skillCount === 0) {
      await SkillModel.insertMany(INITIAL_SKILLS);
      console.log(
        "🌱 [Seed] Seeded initial Skills categories into MongoDB Atlas.",
      );
    }

    // 3A. Seed Skills Section heading content
    const skillsSectionCount = await SkillsSectionModel.countDocuments();

    if (skillsSectionCount === 0) {
      await SkillsSectionModel.create(INITIAL_SKILLS_SECTION);
      console.log(
        "🌱 [Seed] Seeded initial Skills Section content into MongoDB Atlas.",
      );
    }

    // 3B. Seed Projects Section heading content
    const projectsSectionCount = await ProjectsSectionModel.countDocuments();

    if (projectsSectionCount === 0) {
      await ProjectsSectionModel.create(INITIAL_PROJECTS_SECTION);
      console.log(
        "🌱 [Seed] Seeded initial Projects Section content into MongoDB Atlas.",
      );
    }

    // 3C. Seed Timeline Section heading content
    const timelineSectionCount = await TimelineSectionModel.countDocuments();

    if (timelineSectionCount === 0) {
      await TimelineSectionModel.create(INITIAL_TIMELINE_SECTION);
      console.log(
        "🌱 [Seed] Seeded initial Timeline Section content into MongoDB Atlas.",
      );
    }

    // 4. Seed Projects
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      await ProjectModel.insertMany(INITIAL_PROJECTS);
      console.log("🌱 [Seed] Seeded initial Projects into MongoDB Atlas.");
    }

    // 5. Seed Journey
    const journeyCount = await JourneyModel.countDocuments();
    if (journeyCount === 0) {
      await JourneyModel.insertMany(INITIAL_JOURNEY);
      console.log(
        "🌱 [Seed] Seeded initial Journey records into MongoDB Atlas.",
      );
    }

    // 6. Seed Connect
    const connectCount = await ConnectModel.countDocuments();
    if (connectCount === 0) {
      await ConnectModel.create(INITIAL_CONNECT);
      console.log(
        "🌱 [Seed] Seeded initial Connect record into MongoDB Atlas.",
      );
    }

    // 7. Ensure Default Admin User exists
    const adminCount = await AdminModel.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = "admin@gnani.dev";
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("Admin@123", salt);

      await AdminModel.create({
        email: defaultEmail,
        passwordHash,
        name: "Gnani (Administrator)",
        role: "superadmin",
      });
      console.log(
        `🔐 [Seed] Initial Admin user seeded: ${defaultEmail} / Admin@123`,
      );
    }
  } catch (seedErr: any) {
    console.error(
      "⚠️ [Seed] Seed check completed with notice:",
      seedErr.message || seedErr,
    );
  }
}
