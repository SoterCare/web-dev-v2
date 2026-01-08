import Link from 'next/link';
import { Smartphone, MapPin, HeartPulse, FileText, Bell, Activity } from 'lucide-react';

const icons = {
  Smartphone: Smartphone,
  MapPin: MapPin,
  HeartPulse: HeartPulse,
  FileText: FileText,
  Bell: Bell,
  Activity: Activity
};

const features = [
  {
    title: "Remote Monitoring",
    description: "Keep track of your loved ones' health and status from anywhere in the world tailored to your needs.",
    icon: "Smartphone",
    className: "lg:col-span-2"
  },
  {
    title: "Real-time Location",
    description: "GPS tracking ensures you always know where they are, providing safety and quick response.",
    icon: "MapPin",
  },
  {
    title: "Health Monitoring",
    description: "Continuous monitoring of vital signs like heart rate, blood pressure, and sleep patterns.",
    icon: "HeartPulse",
  },
  {
    title: "Activity Logs",
    description: "Detailed daily, weekly, and monthly reports of physical activity and health trends.",
    icon: "FileText",
    className: "lg:col-span-2"
  },
  {
    title: "Instant Alerts",
    description: "Receive immediate notifications for falls, abnormal vitals, or if they leave safe zones.",
    icon: "Bell",
  },
  {
    title: "Medication Reminders",
    description: "Smart alerts to ensure medication is taken on time, improving adherence and health outcomes.",
    icon: "Activity",
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block mb-4">
             <span className="bg-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/60 shadow-clay-inset">
               Benefits
             </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-muted text-lg font-normal leading-relaxed">
            Comprehensive tools designed to provide safety, health insights, and peace of mind for families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-foreground">
          {features.map((feature, index) => {
            const Icon = icons[feature.icon as keyof typeof icons];
            return (
              <div 
                key={index} 
                className={`bg-white rounded-[40px] p-10 shadow-clay hover:shadow-clay-floating transition-all duration-300 border border-white/60 relative overflow-hidden group ${feature.className || ''}`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                   <Icon size={120} />
                </div>

                <div className="w-20 h-20 bg-[#F5F5F7] rounded-[24px] flex items-center justify-center mb-8 shadow-clay-inset border border-white/50">
                  <Icon size={32} className="text-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
