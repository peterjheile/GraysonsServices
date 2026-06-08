"use client";

import { useEffect, useRef } from "react";

type ParallaxHeroProps = {
    imageUrl: string;
    className?: string;
    imageClassName?: string;
    backgroundPosition?: string;
    speed?: number;
}

export default function ParallaxHero({imageUrl, className="", imageClassName="", backgroundPosition="center", speed=0.35}: ParallaxHeroProps){
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => {
            if (!imgRef.current) return;

            const y = window.scrollY * speed;
            imgRef.current.style.transform = `translateY(${y}px)`;
        }

        onScroll();

        window.addEventListener("scroll", onScroll, {
            passive: true,
        })

        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [speed])

    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            <div
                ref={imgRef}
                className={`
                absolute inset-0 top-[-15%] bottom-[-15%]
                bg-cover bg-no-repeat will-change-transform
                ${imageClassName}
                `}
                style={{
                backgroundImage: `url('${imageUrl}')`,
                backgroundPosition,
                }}
            />
        </div>
    )
}