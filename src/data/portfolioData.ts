import heroWorkspaceImg from '../assets/images/hero_embedded_workspace_1791651006673.jpg';
import mediscanAiImg from '../assets/images/mediscan_ai_preview_1791651022577.jpg';
import iotSolarImg from '../assets/images/iot_solar_monitor_1791651036487.jpg';
import webInternshipImg from '../assets/images/web_internship_showcase_1791651048405.jpg';

export { heroWorkspaceImg, mediscanAiImg, iotSolarImg, webInternshipImg };

export interface Project {
  id: string;
  title: string;
  category: 'All' | 'Embedded & IoT' | 'AI & Web' | 'Internships';
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
  skills: { name: string; highlight?: boolean; level: string; desc?: string }[];
}

export const PORTFOLIO_DATA = {
  personal: {
    name: 'Gnani',
    fullName: 'Gnanendra',
    roleTag: 'ELECTRONICS & EMBEDDED SYSTEMS ENGINEER',
    roles: [
      'Arduino & ESP32 Developer',
      'Full Stack Web Engineer',
      'IoT Solutions Creator',
      'AI Integration Enthusiast'
    ],
    shortBio: 'B.Tech Final Year Electronics and Communication Engineering student with a strong passion for Embedded Systems, IoT, Artificial Intelligence, and Full Stack Development. I enjoy creating technology that solves real-world problems and continuously learning to become a better engineer.',
    extendedBio: "I'm Gnani, a B.Tech Final Year Electronics and Communication Engineering student with a strong passion for Embedded Systems, IoT, Artificial Intelligence, and Full Stack Development. I enjoy turning ideas into practical engineering solutions by combining hardware and software. Every project I build is an opportunity to learn, improve, and move one step closer to becoming a skilled engineer.",
    email: 'gnanendra714@gmail.com',
    location: 'India',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    availableForHire: true
  },

  stats: [
    { label: 'Microcontroller Platforms', value: '4+', note: 'ESP32, ESP8266, Arduino, ATmega' },
    { label: 'Completed Projects', value: '12+', note: 'Hardware firmware & web applications' },
    { label: 'Internship Tasks Shipped', value: '6/6', note: 'SaiKet Systems production deliverables' },
    { label: 'Academic Standing', value: 'Final Year', note: 'B.Tech Electronics & Communication' },
  ],

  aboutPillars: [
    {
      id: 'embedded',
      title: 'Embedded Systems & IoT',
      icon: 'Cpu',
      summary: 'Developing smart embedded solutions using Arduino, ESP32, sensors, and microcontrollers.',
      details: [
        'Hardware-level firmware development in C/C++ with Arduino & PlatformIO.',
        'Sensor integration: DHT11, Ultrasonic, ACS712 Current, LDR, OLED SSD1306.',
        'Serial protocols: I2C, SPI, UART, and Wi-Fi/BLE communication on ESP32.',
        'Circuit prototyping, voltage regulation, and relay-driven high-voltage actuation.'
      ]
    },
    {
      id: 'fullstack',
      title: 'Full Stack Development',
      icon: 'Code2',
      summary: 'Building responsive web applications using React, Node.js, Express, and modern styling.',
      details: [
        'Clean component architectures with React 19, TypeScript, and modern state management.',
        'Scalable backend services with Express.js, RESTful endpoints, and JWT authentication.',
        'Database modeling with MongoDB & relational schema considerations.',
        'Pixel-perfect responsive design systems using Tailwind CSS and ergonomic layouts.'
      ]
    }
  ],

  skills: [
    {
      id: 'embedded',
      name: 'Embedded Systems',
      iconName: 'Cpu',
      skills: [
        { name: 'ESP32 & ESP-IDF', level: 'Advanced', highlight: true, desc: 'Dual-core Xtensa LX6, Wi-Fi, BLE, FreeRTOS tasks & ADC calibration' },
        { name: 'Arduino IDE & PlatformIO', level: 'Advanced', highlight: true, desc: 'Modular C/C++ firmware architectures and board managers' },
        { name: 'ESP8266 & ATmega328P', level: 'Proficient', highlight: false, desc: 'Lightweight IoT microcontrollers and AVR core registers' },
        { name: 'Peripherals & Timers', level: 'Advanced', highlight: true, desc: 'Hardware timers, external interrupts, PWM pulse control, DAC' },
        { name: 'FreeRTOS Basics', level: 'Proficient', highlight: false, desc: 'Multitasking, queues, semaphores and task priority management' },
      ]
    },
    {
      id: 'hardware',
      name: 'Electronics & Hardware',
      iconName: 'Zap',
      skills: [
        { name: 'Circuit Design & Prototyping', level: 'Advanced', highlight: true, desc: 'Breadboard prototyping, schematic capture, signal routing' },
        { name: 'Sensor & Actuator Interfacing', level: 'Advanced', highlight: true, desc: 'DHT22, ultrasonic, ACS712 current, INA219, LDR, soil capacitive' },
        { name: 'Power Management & Solar', level: 'Proficient', highlight: true, desc: 'LDO & Buck converters, TP4056 lithium charging, solar harvesting' },
        { name: 'Switching Circuits', level: 'Advanced', highlight: true, desc: 'Optocoupler isolated relays, N-channel MOSFETs, bipolar transistors' },
        { name: 'Displays & Readouts', level: 'Advanced', highlight: false, desc: 'SSD1306 monochrome OLED (I2C/SPI), LCD 16x2, 7-segment displays' },
      ]
    },
    {
      id: 'iot',
      name: 'Communication & IoT',
      iconName: 'Radio',
      skills: [
        { name: 'Hardware Protocols', level: 'Advanced', highlight: true, desc: 'I2C multi-device buses, high-speed SPI, and UART serial communication' },
        { name: 'Wireless Standards', level: 'Advanced', highlight: true, desc: 'Wi-Fi 802.11 b/g/n station/AP modes, BLE advertisement, ESP-NOW' },
        { name: 'IoT Network Protocols', level: 'Proficient', highlight: true, desc: 'MQTT pub/sub architecture, lightweight JSON telemetry, HTTP/REST' },
        { name: 'Cloud IoT Platforms', level: 'Proficient', highlight: false, desc: 'ThingSpeak analytics, Adafruit IO feeds, custom MQTT brokers' },
      ]
    },
    {
      id: 'fullstack',
      name: 'Full-Stack Development',
      iconName: 'Layout',
      skills: [
        { name: 'React 19 & Next.js', level: 'Proficient', highlight: true, desc: 'Modular functional components, custom hooks, and modern client state' },
        { name: 'Node.js & Express.js', level: 'Proficient', highlight: true, desc: 'RESTful API architectures, custom middleware, async routing' },
        { name: 'Database Systems', level: 'Proficient', highlight: true, desc: 'MongoDB document models, CRUD operations, PostgreSQL schemas' },
        { name: 'Tailwind CSS & Modern UI', level: 'Advanced', highlight: true, desc: 'Design systems, glassmorphism, responsive breakpoints & dark themes' },
        { name: 'HTML5, CSS3 & JavaScript', level: 'Advanced', highlight: false, desc: 'Semantic layout, CSS Grid/Flexbox, ES6+ asynchronous syntax' },
      ]
    },
    {
      id: 'tools',
      name: 'Programming & Tools',
      iconName: 'Wrench',
      skills: [
        { name: 'C & Embedded C++', level: 'Advanced', highlight: true, desc: 'Memory efficiency, pointers, bitwise manipulation, hardware registers' },
        { name: 'Python & TypeScript', level: 'Proficient', highlight: true, desc: 'Data parsing, backend scripts, strictly typed client systems' },
        { name: 'Git & GitHub Workflows', level: 'Proficient', highlight: true, desc: 'Branching strategies, commit history, releases, and open source' },
        { name: 'Diagnostic Instruments', level: 'Proficient', highlight: false, desc: 'Digital multimeters, logic analyzers, serial monitors, Postman' },
        { name: 'VS Code & Toolchains', level: 'Advanced', highlight: false, desc: 'Primary development hub with PlatformIO, Vite, and npm toolchains' },
      ]
    },
    {
      id: 'ai',
      name: 'Generative AI & Automation',
      iconName: 'Sparkles',
      skills: [
        { name: 'Gemini API & LLM Integration', level: 'Proficient', highlight: true, desc: 'Google GenAI SDK, structured JSON output generation, system prompts' },
        { name: 'Groq AI High-Speed Inference', level: 'Proficient', highlight: true, desc: 'Sub-second optical text parsing and diagnosis extraction' },
        { name: 'Prompt Engineering & Tools', level: 'Proficient', highlight: false, desc: 'Few-shot templating, structured schemas, zero-shot classification' },
        { name: 'Intelligent Telemetry', level: 'Familiar', highlight: false, desc: 'AI-assisted sensor anomaly detection and predictive maintenance alerts' },
      ]
    }
  ],

  projects: [
    {
      id: 'sbdcs-battery-diagnostic',
      title: 'Smart Battery Diagnostic & Charging System (SBDCS)',
      category: 'Embedded & IoT',
      badge: 'Hardware Engineering Showcase',
      shortDescription: 'Intelligent lithium-ion battery health analyzer featuring real-time internal impedance calculation, Coulomb counting, state-of-health (SoH) algorithms, and automated thermal protection.',
      fullDescription: 'Lithium-ion cells in electric mobility and energy storage systems suffer from unpredictable thermal runaway and undetected internal degradation. SBDCS was engineered as a hardware-firmware solution: utilizing an ESP32 microcontroller, INA219 high-side current/voltage sensor, calibrated precision load resistor, and thermal thermistors. The system computes dynamic internal resistance, tracks charging efficiency through Coulomb counting, and triggers automated cutoff relays upon voltage or thermal threshold violations. Live metrics are rendered on a 0.96" I2C OLED and transmitted over MQTT.',
      image: heroWorkspaceImg,
      tags: ['ESP32', 'Embedded C++', 'INA219', 'OLED SSD1306', 'Relay Protection', 'IoT Telemetry', 'MQTT'],
      githubUrl: 'https://github.com',
      liveUrl: '#',
      highlights: [
        'Dynamic internal impedance measurement using pulsed-load voltage drop analysis.',
        'Continuous Coulomb counting for accurate State-of-Charge (SoC) and State-of-Health (SoH) tracking.',
        'Dual-stage relay isolation for over-voltage (>4.25V) and over-temperature (>50°C) cutoff.',
        'Local OLED dashboard with rolling battery health percentage and charge cycle metrics.'
      ],
      architecture: [
        'High-side precision current & bus voltage sensing via INA219 (I2C address 0x40)',
        'Calibrated test load switching using high-efficiency N-channel power MOSFET',
        'ESP32 firmware written in C++ with non-blocking state machine scheduler',
        'Opto-isolated safety relay linked to emergency hardware interrupt line',
        'SSD1306 monochrome graphical display with custom battery graphic widgets'
      ],
      metrics: [
        { label: 'Voltage Precision', value: '±4 mV' },
        { label: 'Current Sampling', value: '1 kHz' },
        { label: 'Cutoff Latency', value: '< 12 ms' }
      ]
    },
    {
      id: 'smart-agri-iot',
      title: 'IoT Smart Agriculture Monitoring & Automation',
      category: 'Embedded & IoT',
      badge: 'Agricultural IoT Solution',
      shortDescription: 'Autonomous agro-climatic telemetry station monitoring soil moisture, ambient humidity, and temperature with automated closed-loop irrigation actuation.',
      fullDescription: 'Engineered to reduce water wastage in precision agriculture. The system integrates capacitive soil moisture sensors, a DHT22 high-accuracy temperature/humidity sensor, and an ambient light sensor connected to an ESP32. When soil moisture drops below calibrated plant hydration thresholds, an opto-isolated 5V relay automatically activates an irrigation solenoid valve while logging telemetry packets over Wi-Fi to a cloud dashboard.',
      image: iotSolarImg,
      tags: ['ESP32', 'C++', 'Capacitive Sensors', 'DHT22', 'Optocoupler Relay', 'Wi-Fi Telemetry'],
      githubUrl: 'https://github.com',
      liveUrl: '#',
      highlights: [
        'Capacitive soil moisture sensing with corrosion-resistant analog probes.',
        'Closed-loop automated irrigation logic with hysteresis to prevent relay flutter.',
        'Wi-Fi telemetry dispatching sensor payloads every 30 seconds.',
        'On-device emergency override switch with visual LED diagnostic feedback.'
      ],
      architecture: [
        'Multi-sensor probe array (Soil moisture, DHT22, LDR photodiode)',
        'ESP32 ADC calibration with 11dB attenuation and moving average noise smoothing',
        'Active-low relay driver circuit driving 12V DC water pump/solenoid',
        'Lightweight JSON MQTT payload serialization over 802.11 b/g/n Wi-Fi'
      ],
      metrics: [
        { label: 'Water Conservation', value: '38%' },
        { label: 'Telemetry Interval', value: '30s' },
        { label: 'Sensor Lifespan', value: '2.5x vs Resistive' }
      ]
    },
    {
      id: 'iot-solar-monitor',
      title: 'Solar Power & Energy Telemetry System',
      category: 'Embedded & IoT',
      badge: 'Renewable Energy Telemetry',
      shortDescription: 'Autonomous photovoltaic power monitoring station measuring real-time solar cell voltage, current, and wattage with local OLED readout and ESP32 telemetry.',
      fullDescription: 'A custom hardware project developed to monitor green energy yield. Utilizing an ESP32 microcontroller, ACS712 Hall-effect current sensor, and calibrated voltage divider circuit, the system computes real-time power generation (Watts), cumulative energy, and system operating temperature. Data is rendered live on an SSD1306 OLED screen while broadcasting metrics over Wi-Fi.',
      image: iotSolarImg,
      tags: ['ESP32', 'C++', 'IoT', 'Sensors', 'OLED SSD1306', 'ACS712', 'Relay Modules'],
      githubUrl: 'https://github.com',
      liveUrl: '#',
      highlights: [
        'Direct analog sensor acquisition with moving average noise filtration.',
        'High-contrast 128x64 OLED dashboard updated at 10Hz without blocking delays.',
        'Over-voltage and thermal safety trigger linked to an automated 5V cooling fan relay.',
        'Built with production breadboard layout and clean terminal wire management.'
      ],
      architecture: [
        'Solar photovoltaic panel (12V rated) with load resistor bank',
        'Analog signal conditioner: Voltage divider & ACS712 5A current sensor',
        'ESP32 firmware written in C++ using non-blocking millis() scheduler',
        'I2C SSD1306 monochrome graphical display interface'
      ],
      metrics: [
        { label: 'Sensor Sampling', value: '100 Hz' },
        { label: 'Telemetry Jitter', value: '< 2ms' },
        { label: 'OLED Refresh', value: '60 fps' }
      ]
    },
    {
      id: 'esp32-smart-station',
      title: 'Autonomous ESP32 Smart Gateway',
      category: 'Embedded & IoT',
      badge: 'Microcontroller Automation System',
      shortDescription: 'Multi-channel microcontroller control unit integrating ultrasonic, temperature, and light sensors with opto-isolated relay switching circuits.',
      fullDescription: 'Designed as a modular hardware node for industrial automation and smart environments. The ESP32 handles concurrent sensor monitoring, evaluates logic rules on-chip, and reliably switches high-current alternating current loads through relay channels with optical isolation.',
      image: heroWorkspaceImg,
      tags: ['ESP32', 'Arduino IDE', 'Serial Comm', 'Relay Modules', 'Hardware Debugging'],
      githubUrl: 'https://github.com',
      liveUrl: '#',
      highlights: [
        'Simultaneous telemetry polling across multiple sensor pins.',
        'Robust relay debounce and failsafe logic preventing chatter.',
        'Bi-directional serial CLI console for on-the-fly calibration.'
      ],
      architecture: [
        'ESP32 NodeMCU development board',
        '4-Channel optocoupler isolated relay board',
        'Serial diagnostic logging at 115200 baud',
        'Modular sensor breakout sockets for rapid reconfiguration'
      ],
      metrics: [
        { label: 'Relay Channels', value: '4 Opto-Isolated' },
        { label: 'Switch Latency', value: '< 15ms' },
        { label: 'Serial Baud', value: '115200' }
      ]
    },
    {
      id: 'mediscan-ai',
      title: 'MediScan AI — Clinical Report Analysis Platform',
      category: 'AI & Web',
      badge: 'AI Diagnostic Application',
      shortDescription: 'AI-powered medical report analysis application that extracts diagnoses, laboratory biomarkers, and vital ranges with sub-second clinical insights.',
      fullDescription: 'MediScan AI revolutionizes how patients and medical practitioners parse dense diagnostic laboratory reports. Users upload scan results (PDF/images), and the system leverages high-speed Groq AI LLM inference alongside intelligent optical data parsing to extract vital metrics, flag out-of-range clinical indicators, and produce an easily understandable health summary.',
      image: mediscanAiImg,
      tags: ['Python', 'Flask', 'Groq AI', 'HTML5', 'CSS3', 'JavaScript', 'REST API'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://mediscan-ai-demo.vercel.app',
      highlights: [
        'Integrated Groq AI for sub-second report synthesis and diagnosis extraction.',
        'Automated biomarker recognition with color-coded safety indicators (Normal, Elevated, Critical).',
        'Built with Python Flask backend and responsive modern dark-mode frontend.',
        'Privacy-first architecture ensuring uploaded medical data is ephemeral.'
      ],
      architecture: [
        'Client-side drag-and-drop report ingestion module',
        'Flask REST API endpoint with multipart payload handling',
        'Groq AI Llama inference engine with custom medical schema prompt',
        'Structured JSON response renderer with interactive biometric charts'
      ],
      metrics: [
        { label: 'Extraction Time', value: '< 1.8s' },
        { label: 'Biomarkers Detected', value: '25+' },
        { label: 'UI Responsiveness', value: '100%' }
      ]
    },
    {
      id: 'notemind-ai',
      title: 'NoteMind — AI Smart Notes & Knowledge Graph',
      category: 'AI & Web',
      badge: 'Intelligent Knowledge Management',
      shortDescription: 'Full-stack smart note-taking web application with automated semantic concept tagging, AI summarization, and an interactive knowledge graph.',
      fullDescription: 'NoteMind solves information overload by automatically organizing notes into an interconnected semantic graph. Engineered with React 19, Node.js, Express, and MongoDB, the platform analyzes user notes in real-time, extracts key technical topics, and links related thoughts together with an interactive force-directed graph.',
      image: webInternshipImg,
      tags: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Tailwind CSS'],
      githubUrl: 'https://github.com',
      liveUrl: '#',
      highlights: [
        'Automatic topic extraction and bullet summarization powered by LLMs.',
        'Interactive SVG knowledge graph visualizing connections between notes.',
        'Full-text fuzzy search with keyword highlighting and tags.',
        'JWT-authenticated user sessions with end-to-end data validation.'
      ],
      architecture: [
        'React frontend with stateful canvas force-directed graph renderer',
        'Express REST backend with token authentication and rate limiting',
        'MongoDB Atlas database storing note documents and relation edges',
        'Google Gemini API for real-time concept tag synthesis'
      ],
      metrics: [
        { label: 'Search Latency', value: '< 45ms' },
        { label: 'Graph Render', value: '60 fps' },
        { label: 'Summarization Time', value: '1.2s' }
      ]
    },
    {
      id: 'attend75-predictor',
      title: 'Attend75 — Attendance Prediction & Tracking',
      category: 'AI & Web',
      badge: 'Academic Productivity Tool',
      shortDescription: 'Intelligent academic attendance tracker and what-if simulation engine that calculates exact safe bunk allowances and required class recovery targets.',
      fullDescription: 'Engineered for college students to track attendance across course subjects with precision. Features an algorithmic simulation engine that calculates: "How many consecutive classes can I safely miss?" and "How many classes must I attend consecutively to recover from 68% to 75%?" with visual status rings and timetable sync.',
      image: heroWorkspaceImg,
      tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'PWA'],
      githubUrl: 'https://github.com',
      liveUrl: '#',
      highlights: [
        'Mathematical predictive engine calculating bunk thresholds and recovery schedules.',
        'Visual circular progress meters with color-coded safety margins.',
        'Persistent offline local caching and cloud sync capability.',
        'Custom subject weightings and lecture duration multiplier.'
      ],
      architecture: [
        'React single-page application with responsive mobile-first drawer navigation',
        'Client-side state machine with persistent localStorage hydration',
        'Predictive arithmetic calculation engine handling edge cases',
        'Exportable attendance reports in PDF/CSV formats'
      ],
      metrics: [
        { label: 'Calculation Accuracy', value: '100%' },
        { label: 'Offline Support', value: 'Full PWA' },
        { label: 'Target Compliance', value: '≥ 75%' }
      ]
    },
    {
      id: 'saiket-internship',
      title: 'SaiKet Systems Front-End Internship',
      category: 'Internships',
      badge: 'Production Engineering Internship',
      shortDescription: 'Completed a six-task Front-End Development Internship at SaiKet Systems building responsive web interfaces, complex layouts, and dynamic web components.',
      fullDescription: 'During my Front-End Development Internship at SaiKet Systems, I was tasked with engineering six real-world frontend modules. These covered advanced responsive layout design, accessible navigation architectures, dynamic interactive stateful forms, and cross-browser testing to meet stringent corporate standards.',
      image: webInternshipImg,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Flexbox', 'Web Standards'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://saiket-systems-internship.vercel.app',
      highlights: [
        'Successfully completed and verified all 6 corporate milestone tasks ahead of deadline.',
        'Architected clean, semantic HTML5 structure with zero accessibility violations.',
        'Engineered responsive layouts with CSS Flexbox & Grid without external heavy libraries.',
        'Received mentor commendation for meticulous attention to visual polish.'
      ],
      architecture: [
        'Task 1 & 2: Responsive corporate landing showcase and interactive hero components',
        'Task 3 & 4: Stateful client-side forms with input validation feedback',
        'Task 5 & 6: Dynamic data tables and interactive product gallery views'
      ],
      metrics: [
        { label: 'Tasks Completed', value: '6 / 6' },
        { label: 'Lighthouse Score', value: '98+' },
        { label: 'Cross-Device Coverage', value: 'Mobile to 4K' }
      ]
    }
  ] as Project[],

  timeline: [
    {
      year: '2023',
      title: 'The Beginning',
      subtitle: 'Initiation into Electronics & Coding',
      summary: 'Started my B.Tech journey and took my first steps into the world of technology.',
      story: '2023 marked the beginning of my engineering journey as I started my B.Tech in Electronics and Communication Engineering while joining the NxtWave program. During this phase, I was introduced to the fundamentals of web development and discovered my passion for technology. Learning HTML and CSS gave me my first experience in creating websites and sparked my curiosity to explore programming, software development, and modern engineering.',
      technologies: ['HTML', 'CSS', 'C Programming', 'Basic Arduino'],
      achievements: [
        'Started B.Tech in Electronics & Communication Engineering',
        'Joined the NxtWave intensive training program',
        'Learned HTML and CSS fundamentals & responsive layouts',
        'Built my first responsive web pages and personal portfolio',
        'Built my first basic Arduino project and circuit experiments'
      ]
    },
    {
      year: '2024',
      title: 'Building Strong Foundations',
      subtitle: 'Hardware Protocols Meets Full Stack Web',
      summary: 'Expanded my skills in programming, electronics, and real-world project development.',
      story: '2024 was a pivotal phase of deepening practical engineering competence. I mastered JavaScript, Node.js, and Express to build complete client-server architectures, while simultaneously diving deep into microcontrollers—working with ESP8266 and ESP32 chips, writing firmware in the Arduino IDE, and mastering serial protocols like UART and I2C.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Git & GitHub', 'VS Code', 'Arduino IDE', 'ESP8266', 'ESP32'],
      achievements: [
        'Deepened JavaScript proficiency and modern asynchronous workflows',
        'Transitioned to ESP32 dual-core microcontrollers with Wi-Fi & Bluetooth',
        'Built multi-sensor acquisition systems with OLED screens',
        'Adopted Git version control and collaborative GitHub workflows',
        'Designed backend REST endpoints using Express.js and middleware'
      ]
    },
    {
      year: '2025',
      title: 'Turning Knowledge into Real Projects',
      subtitle: 'Applied AI, Internships & Solar Telemetry',
      summary: 'Applied my skills to develop real-world software and smart embedded systems.',
      story: 'In 2025, theory transformed into production-ready software and tangible hardware prototypes. Completed a rigorous 6-task Front-End Development Internship at SaiKet Systems. Developed MediScan AI leveraging Groq AI for medical diagnostic report analysis, and designed an end-to-end IoT solar energy telemetry system combining physical current/voltage sensors with an OLED dashboard.',
      technologies: ['React.js', 'Python', 'Flask', 'Groq AI', 'MongoDB', 'IoT Sensors', 'Solar Telemetry', 'Tailwind CSS'],
      achievements: [
        'Completed 6-task Front-End Development Internship at SaiKet Systems',
        'Engineered MediScan AI medical report intelligence application',
        'Prototyped IoT Solar Energy and Real-Time Power Monitoring system',
        'Mastered responsive component architectures and modern dark UI systems',
        'Created high-impact technical demonstrations and open-source repositories'
      ]
    },
    {
      year: '2026',
      title: 'Final Year Innovation & Horizon',
      subtitle: 'Hardware-Software Synergy & Professional Growth',
      summary: 'Engineering advanced cyber-physical solutions and launching into the tech industry.',
      story: 'Currently in the final year of B.Tech Electronics & Communication Engineering. Focused on architecting robust systems that bridge low-level physical microcontrollers with high-level web platforms, cloud databases, and intelligent AI models. Actively seeking opportunities to build impactful real-world engineering solutions.',
      technologies: ['ESP32', 'React 19', 'TypeScript', 'Embedded Systems', 'IoT Architectures', 'Edge Computing'],
      achievements: [
        'Approaching B.Tech Electronics & Communication Engineering graduation',
        'Refining portfolio and engineering case studies with high-fidelity polish',
        'Prepared for roles in Embedded Systems, IoT, and Full Stack Web Development',
        'Active mentor and open-source contributor'
      ]
    }
  ],

  connectChannels: [
    {
      id: 'email',
      name: 'Email',
      icon: 'Mail',
      description: 'Reach out for internships, projects, collaborations, or technical discussions.',
      handle: 'gnanendra714@gmail.com',
      actionLabel: 'Send an Email',
      url: 'mailto:gnanendra714@gmail.com'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      description: 'Explore my projects, source code, and development journey.',
      handle: 'github.com/gnani',
      actionLabel: 'View Repositories',
      url: 'https://github.com'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'Linkedin',
      description: 'Connect professionally and explore career & internship opportunities.',
      handle: 'linkedin.com/in/gnani',
      actionLabel: 'Connect on LinkedIn',
      url: 'https://linkedin.com'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: 'Youtube',
      description: 'Arduino tutorials, engineering projects, and tech content.',
      handle: '@GnaniTechEngineering',
      actionLabel: 'Watch Tutorials',
      url: 'https://youtube.com'
    }
  ]
};
