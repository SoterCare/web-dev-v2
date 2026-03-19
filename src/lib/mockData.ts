import { VitalSigns, GaitMetrics, DashboardAlert, TimelineEvent, ActivityDataPoint } from "@/types/dashboard";

// Generate realistic mock temperature data with slight variations around a baseline
export const generateMockTemperatureData = (hours: number): ActivityDataPoint[] => {
  const data: ActivityDataPoint[] = [];
  const now = new Date();
  
  for (let i = hours * 6; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60000); // Every 10 mins
    const baseTemp = 36.5;
    const variant = (Math.random() - 0.5) * 0.8;
    data.push({
      timestamp: time.toISOString(),
      value: Number((baseTemp + variant).toFixed(1)),
    });
  }
  return data;
};

// Generate timeline events for the day
export const generateMockTimeline = (): TimelineEvent[] => {
  const now = new Date();
  return [
    {
      id: "ev-1",
      timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
      type: "Movement",
      description: "Walking in hallway",
      duration: 5,
    },
    {
      id: "ev-2",
      timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
      type: "Resting",
      description: "Resting in living room",
      duration: 40,
    },
    {
      id: "ev-3",
      timestamp: new Date(now.getTime() - 120 * 60000).toISOString(),
      type: "Alert",
      description: "Irregular gait detected during movement",
      duration: 0,
    },
    {
      id: "ev-4",
      timestamp: new Date(now.getTime() - 240 * 60000).toISOString(),
      type: "Movement",
      description: "Morning activity",
      duration: 30,
    },
  ];
};

export const getMockVitals = (): VitalSigns => ({
  temperature: 36.6,
  moistureDetected: false,
  heartRate: 72,
  spO2: 98,
});

export const getMockGaitMetrics = (): GaitMetrics => ({
  stepCount: 3450,
  cadence: 95,
  strideLength: 0.65,
  symmetry: 92,
  status: "Normal",
});

export const getMockAlerts = (): DashboardAlert[] => {
  const now = new Date();
  return [
    {
      id: "al-1",
      type: "Abnormal Temperature",
      severity: "Warning",
      timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      resolved: false,
      message: "Body temperature dropped to 35.8°C",
    },
    {
      id: "al-2",
      type: "Moisture Detected",
      severity: "Info",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      resolved: true,
      message: "Moisture event detected",
    },
    {
      id: "al-3",
      type: "Fall Detected",
      severity: "Critical",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      resolved: true,
      message: "Hard fall detected in bedroom",
    },
  ];
};
