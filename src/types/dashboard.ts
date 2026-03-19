export interface VitalSigns {
  temperature: number;
  moistureDetected: boolean;
  heartRate?: number;
  spO2?: number;
}

export interface GaitMetrics {
  stepCount: number;
  cadence: number;
  strideLength: number;
  symmetry: number; // percentage
  status: "Normal" | "Irregular" | "High Risk";
}

export interface DashboardAlert {
  id: string;
  type: "Fall Detected" | "Abnormal Temperature" | "Moisture Detected" | "Irregular Gait";
  severity: "Critical" | "Warning" | "Info";
  timestamp: string;
  resolved: boolean;
  message?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "Movement" | "Resting" | "Alert";
  description: string;
  duration?: number; // in minutes
}

export interface ActivityDataPoint {
  timestamp: string;
  value: number; // e.g. activity intensity or temperature reading
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}
