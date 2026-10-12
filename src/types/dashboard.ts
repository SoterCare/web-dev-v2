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
  type: "Fall Detected" | "Abnormal Temperature" | "Moisture Detected";
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

export type AlertSeverity = "critical" | "high" | "normal";

export interface RecentAlert {
  id: string;
  // contracts/v1/alert_new.schema.json `type` enum, plus the legacy "sos".
  type:
    | "movement" | "fall" | "urine" | "sos" | "help_call" | "moisture"
    | "temperature" | "spo2" | "heart_rate";
  title: string;
  timestamp: number; // epoch ms of detection
  attendedAt?: number;
  deviceId?: string;
  severity?: AlertSeverity; // from alert.new; derived from type when absent
  late?: boolean; // detected while offline, persisted late
  receivedAt?: number; // client clock when a live (socket) copy arrived
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}
