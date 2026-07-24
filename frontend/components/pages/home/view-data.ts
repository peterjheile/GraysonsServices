import type { ValueCard, AboutUs, CredCard, Testimonial } from "./view-types";



export const ABOUT_US: AboutUs = {
    eyebrow: "Who We Are",
    imageAlt: "Imagealt",
    titleLineNormal: "Your Outdoor Vision,",
    titleLineHighlight: "We Make It Happen",
    paragraphs: [
      `At Grayson's Services, we turn outdoor ideas into thoughtfully built spaces that feel like a natural extension of your home. Every project begins by listening to your goals, understanding your property, and creating a plan shaped around how you want to use the space.`,

      `We believe great work comes from quality craftsmanship, honest communication, and careful attention to detail. From the first conversation to the final walkthrough, we keep expectations clear, respect your property, and never cut corners where lasting quality matters.`,

      `As we continue to grow, our commitment remains the same: dependable service, durable results, and a finished project you can enjoy with confidence for years to come.`,
    ],
    url: `/images/defaults/home/about.jpg`
}








export const ABOUT_VALUES: [ValueCard, ValueCard, ValueCard, ValueCard] = [
    {
        icon: "craftsmanship",
        title: "Quality Craftsmanship",
        body: "We take pride in every detail and build each project to provide lasting beauty, strength, and function.",
    },
    {
        icon: "communication",
        title: "Honest Communication",
        body: "We provide straightforward guidance, clear expectations, and dependable updates throughout every project.",
    },
    {
        icon: "commitment",
        title: "Customer Commitment",
        body: "We listen carefully, respect each property, and treat every customer’s vision as if it were our own.",
    },
    {
        icon: "dependable",
        title: "Dependable Service",
        body: "We show up prepared, follow through on our promises, and work hard to deliver results our customers can trust.",
    },
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











