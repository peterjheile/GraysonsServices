import type { QuickStat, MarqueeServices, ValueCard } from "./types";
import {
  FiAward,
  FiCheckSquare,
  FiShield,
} from "react-icons/fi";

export const QUICK_STATS: [QuickStat, QuickStat, QuickStat] = [
    {
    value: "100+",
    label: "Projects Completed",
    },
    {
        value: "98%",
        label: "Client Satisfaction",
    },
    {
        value: "5",
        label: "Years Experience",
    },
]

export const MARQUEE_SERVICES: MarqueeServices = [
  "Patios",
  "Retaining Walls",
  "Outdoor Kitchens",
  "Fire Features",
  "Walkways",
  "Driveways",
];



export const ABOUT_VALUES: [ValueCard, ValueCard, ValueCard, ValueCard] = [
    {
        icon: "award",
        title: "Value One Here",
        body: "A short description of the first value goes here.",
    },
    {
        icon: "check",
        title: "Value Two Here",
        body: "A short description of the second value goes here.",
    },
    {
        icon: "shield",
        title: "Value Three Here",
        body: "A short description of the third value goes here.",
    },
    {
        icon: "shield",
        title: "Value Four Here",
        body: "A short description of the third value goes here.",
    },
];