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
  timestamp: number;
  attendedAt?: number;
  resolved: boolean;
  message?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  type: "Movement" | "Resting" | "Alert";
  description: string;
  duration?: number; // in minutes
}

export interface ActivityDataPoint {
  timestamp: number;
  value: number;
}

export interface RecentAlert {
  id: string;
  type: "movement" | "fall" | "urine" | "sos" | "help_call" | "moisture";
  title: string;
  timestamp: number;
  attendedAt?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}
