import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI | null {
  const rawKey = process.env.GEMINI_API_KEY || '';
  const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '');
  if (!cleanKey) return null;

  return new GoogleGenAI({
    apiKey: cleanKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
        'x-goog-api-key': cleanKey,
      },
    },
  });
}

const GNANI_PROFILE = `
Candidate Name: Gnani (Gnanendra)
Role: Embedded Systems Engineer, IoT Architect & Full-Stack Developer
Education: Bachelor of Technology (B.Tech) in Electronics & Communication Engineering (ECE)
Key Hardware Competencies:
- ESP32, ESP8266, Arduino Uno/Nano, Raspberry Pi, ARM Cortex-M
- Communication Protocols: I2C, SPI, UART, BLE, Wi-Fi (802.11 b/g/n), MQTT, Modbus
- Sensor/Actuator Integration: Soil moisture, DHT22, DHT11, Relays, Solenoid valves, OLED SSD1306, Ultrasonic HC-SR04, ADS1115 ADC
- Circuit Schematics, PCB Design (KiCad/EasyEDA), Breadboard Prototyping, Oscilloscope telemetry, PlatformIO, C/C++
Key Software & Full-Stack Competencies:
- Frontend: React 19, TypeScript, Tailwind CSS, Motion, Canvas API, Web Audio API
- Backend & Cloud: Node.js, Express, MongoDB, RESTful APIs, WebSockets, MQTT Broker
Location: Available for on-site, hybrid, and remote roles.
`;

export async function chatCopilot(req: Request, res: Response): Promise<void> {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message string is required' });
      return;
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const systemPrompt = `You are Gnani's official AI Portfolio Copilot.
You represent Gnani (Gnanendra), a high-caliber B.Tech Electronics & Communication Engineer specializing in Embedded Systems, IoT hardware, microcontrollers (ESP32/Arduino), and Full-Stack Web Development.
Candidate profile:
${GNANI_PROFILE}
Guidelines:
- Answer recruiter and visitor questions accurately, professionally, and concisely.
- Highlight his technical depth across both hardware and software.
- Format code or pinouts with markdown when relevant.
- Be polite, confident, and recruiter-focused.`;

        const contents = [
          ...conversationHistory.map((item: { sender: string; text: string }) => ({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: { systemInstruction: systemPrompt },
        });

        res.json({ reply: response.text || "Hello! I am Gnani's Portfolio Copilot. How can I help you learn about his engineering projects?" });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using fallback:', geminiError?.message || geminiError);
      }
    }

    const lower = message.toLowerCase();
    let fallbackReply = `Thanks for reaching out! I'm Gnani's AI Copilot. Gnani holds a B.Tech in Electronics & Communication Engineering (ECE) with deep expertise bridging hardware (ESP32, Arduino, C++, I2C/SPI/UART) and modern software (React, Node.js, Express, MongoDB).`;

    if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio')) {
      fallbackReply = `Gnani's signature projects include the **Smart Battery Diagnostic & Charging System**, the **Smart Agricultural Irrigation System** (reducing water use by 38%), and the **IoT Solar Telemetry Station**. Check out the interactive Workbench and Projects sections!`;
    } else if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack') || lower.includes('hardware')) {
      fallbackReply = `Gnani's stack spans:\n• **Hardware & Firmware**: ESP32, Arduino, C/C++, PlatformIO, I2C, SPI, UART, BLE, MQTT, Soil/Moisture/Current sensors, Relay drivers.\n• **Software**: React 19, TypeScript, Tailwind CSS, Node.js, Express, MongoDB.\n• **Tools**: KiCad, Git, Linux CLI, Oscilloscopes.`;
    } else if (lower.includes('hire') || lower.includes('contact') || lower.includes('email') || lower.includes('resume')) {
      fallbackReply = `Gnani is actively open for engineering roles and internships. You can send a direct message via the Connect section below or click **Resume** in the top navigation bar.`;
    } else if (lower.includes('education') || lower.includes('degree') || lower.includes('college')) {
      fallbackReply = `Gnani is a Final Year student pursuing a **Bachelor of Technology (B.Tech) in Electronics & Communication Engineering (ECE)**.`;
    }

    res.json({ reply: fallbackReply });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}

export async function circuitArchitect(req: Request, res: Response): Promise<void> {
  try {
    const { requirement, mcu = 'ESP32' } = req.body;

    if (!requirement || typeof requirement !== 'string') {
      res.status(400).json({ error: 'Hardware requirement is required' });
      return;
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are an elite Embedded Systems Firmware and Circuit Architect.
The user wants to build a project with ${mcu}: "${requirement}".
Generate a production-ready engineering specification including:
1. Short architectural overview (2 sentences)
2. Hardware Pinout & Wiring Table (Component, Pin on Component, Pin on ${mcu}, Protocol/Notes)
3. Production C++ firmware code (PlatformIO / Arduino framework) with setup() and loop()
4. Bill of Materials (BOM) quick list
Keep it concise, production-ready, and beautifully formatted in markdown.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        res.json({ architecture: response.text });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API failed for architect, using template:', geminiError?.message || geminiError);
      }
    }

    const fallback = `### 🚀 System Architecture Overview
The **${requirement}** built on the **${mcu}** uses non-blocking polling timers with telemetry serialization over Wi-Fi/MQTT. Real-time sensor readings trigger digital GPIO interrupts and update connected peripherals.

### 🔌 Hardware Wiring & Pinout Table
| Component | Component Pin | ${mcu} GPIO | Protocol / Function |
| :--- | :--- | :--- | :--- |
| Sensor VCC | VCC | 3V3 / 5V | Regulated Power Rail |
| Sensor GND | GND | GND | Common Ground |
| Sensor Analog Output | AOUT | GPIO 34 (ADC1_CH6) | 12-bit ADC Reading |
| I2C OLED Display | SDA | GPIO 21 | I2C Data Bus |
| I2C OLED Display | SCL | GPIO 22 | I2C Clock Bus |
| Status Relay Module | IN1 | GPIO 18 | Digital Output (Active LOW) |

### 💻 Production C++ Firmware (PlatformIO / Arduino)
\`\`\`cpp
#include <Arduino.h>
#include <Wire.h>

#define SENSOR_PIN 34
#define RELAY_PIN 18

unsigned long lastTelemetryMs = 0;
const unsigned long TELEMETRY_INTERVAL = 2000;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  analogReadResolution(12);
  Serial.println(F("[SYSTEM] ${mcu} Node Initialized."));
}

void loop() {
  unsigned long now = millis();
  if (now - lastTelemetryMs >= TELEMETRY_INTERVAL) {
    lastTelemetryMs = now;
    int rawVal = analogRead(SENSOR_PIN);
    float voltage = (rawVal / 4095.0) * 3.3;
    Serial.printf("[TELEMETRY] Sensor: %d (%.2fV)\\n", rawVal, voltage);
  }
}
\`\`\``;

    res.json({ architecture: fallback });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}

export async function evaluateJobDescription(req: Request, res: Response): Promise<void> {
  try {
    const { jobDescription, targetRole = 'Software / Hardware Engineer' } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string') {
      res.status(400).json({ error: 'Job description is required' });
      return;
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Evaluate candidate Gnani for this position (${targetRole}) against this Job Description:
"""
${jobDescription}
"""
Candidate Profile:
${GNANI_PROFILE}
Return JSON with:
- matchScore (int 60-98)
- summary (2-3 sentences)
- matchingStrengths (array of 4 bullet points)
- eceAdvantage (1 sentence)
- recommendedPitch (2 sentences)`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        res.json(parsed);
        return;
      } catch (geminiError: any) {
        console.warn('Gemini JD match failed, using fallback:', geminiError?.message || geminiError);
      }
    }

    const jdLower = jobDescription.toLowerCase();
    let matchScore = 88;
    if (jdLower.includes('hardware') || jdLower.includes('iot') || jdLower.includes('embedded')) {
      matchScore = 95;
    } else if (jdLower.includes('react') || jdLower.includes('node') || jdLower.includes('full stack')) {
      matchScore = 92;
    }

    res.json({
      matchScore,
      summary: `Gnani brings an exceptional combination of physical electronics discipline and modern full-stack web software skills, ideally matched for this role.`,
      matchingStrengths: [
        'Microcontroller & Physical Computing proficiency with ESP32, Arduino, and C/C++',
        'Modern Full-Stack web architecture (React, TypeScript, Node.js, Express, REST APIs)',
        'Protocol literacy spanning hardware buses (I2C/SPI/UART) and network layers (MQTT/HTTP)',
        'Proven track record delivering working hardware prototypes and cloud telemetry dashboards',
      ],
      eceAdvantage: `His B.Tech in Electronics & Communication provides a rigorous foundation in circuit theory, signal processing, and low-level firmware optimization.`,
      recommendedPitch: `Gnani is capable of prototyping physical hardware sensors and immediately delivering the web dashboard to visualize and control them.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
