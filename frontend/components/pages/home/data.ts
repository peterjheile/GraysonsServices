import type { QuickStat, MarqueeServices, ValueCard, OurStory, CredCard } from "./types";
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

export const CRENTIAL_VALUES: [CredCard, CredCard, CredCard, CredCard] = [
    {
        title: "Cred 1",
        body: "Liscense of Some sort"
    },
    {
        title: "Cred 2",
        body: "Maybe a warranty"
    },
    {
        title: "Cred 3",
        body: "Another Gov Cred"
    },
    {
        title: "Cred 4",
        body: "Soft Cred"
    }
]



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


export const OUR_STORY: OurStory = {
    eyebrow: "Our Story",
    titleLineNormal: "Our Story Header,",
    titleLineHighlight: "Goes Right Here",
    paragraphs: [
        `Grayson's Services about us paragraph one will go right here.
         It will talk about the start of the company and the 'core values' derived 
         from that beginning. Should be a tiny bit longer but any length works.`,
         `This paragraph will talk about what these values mean and what they do for 
         the company. No cutting corners, prioritizing client, etc. Should also be a 
         tiny bit longer.`,
         `A small gauruntee of quality and unchanging services likely should go here. 
         Especially as you scale.`
    ],
    url: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80`
}
