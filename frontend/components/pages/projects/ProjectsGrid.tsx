"use client";

import { useEffect, useRef, useState } from "react";

import FeaturedProject from "@/components/pages/projects/FeaturedProject";
import ProjectCard from "@/components/pages/projects/ProjectCard";

import { categories, projects } from "./projectsData";

export default function ProjectsGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projects.filter(
    (project) =>
      activeCategory === "All" || project.category === activeCategory,
  );

  const featuredProjects = filteredProjects.filter(
    (project) => project.featured,
  );

  const remainingProjects = filteredProjects.filter(
    (project) => !project.featured,
  );

  const projectCount = filteredProjects.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
      },
    );

    const elements = containerRef.current?.querySelectorAll(
      ".reveal, .reveal-scale",
    );

    elements?.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [activeCategory]);

  return (
    <div
      ref={containerRef}
      className="
        mx-auto w-full max-w-(--max-content-width)
        px-5 py-12
        sm:px-6 sm:py-16
        md:px-8
        lg:px-12 lg:py-24
      "
    >
      {/* Filter bar */}
      <div
        className="
          reveal mb-10
          flex flex-col gap-4
          sm:mb-12
          lg:flex-row lg:items-center lg:justify-between
        "
      >
        <div
          className="
            flex gap-2 overflow-x-auto pb-2
            sm:flex-wrap sm:overflow-visible sm:pb-0
          "
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`
                  shrink-0 border px-4 py-2.5
                  text-[10px] font-medium uppercase tracking-[0.22em]
                  transition-all duration-300

                  ${
                    isActive
                      ? "border-gold bg-gold text-stone-darkest"
                      : "border-stone-pale text-stone-light hover:border-gold/40 hover:text-stone-mid"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>

        <span
          className="
            text-[10px] font-medium uppercase tracking-[0.2em]
            text-stone-light
            lg:shrink-0 lg:text-right
          "
        >
          {projectCount} {projectCount === 1 ? "project" : "projects"}
        </span>
      </div>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section aria-labelledby="featured-projects-heading">
          <div className="reveal mb-8 flex items-center gap-4 sm:mb-10">
            <div className="h-px w-6 shrink-0 bg-gold" />

            <h2
              id="featured-projects-heading"
              className="
                text-[10px] font-medium uppercase tracking-[0.35em]
                text-gold
              "
            >
              Featured Work
            </h2>
          </div>

          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {featuredProjects.map((project, index) => (
              <FeaturedProject
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Remaining projects */}
      {remainingProjects.length > 0 && (
        <section
          className={`
            ${featuredProjects.length > 0 ? "mt-20 md:mt-24 lg:mt-32" : ""}
          `}
          aria-labelledby="more-projects-heading"
        >
          <div className="reveal mb-8 flex items-center gap-4 sm:mb-10 lg:mb-12">
            <div className="h-px w-6 shrink-0 bg-stone-pale" />

            <h2
              id="more-projects-heading"
              className="
                text-[10px] font-medium uppercase tracking-[0.35em]
                text-stone-light
              "
            >
              More Projects
            </h2>
          </div>

          <div
            className="
              grid grid-cols-1 gap-8
              sm:grid-cols-2
              md:gap-10
              xl:grid-cols-3
            "
          >
            {remainingProjects.map((project, index) => (
              <div
                key={project.id}
                className="reveal-scale"
                style={{
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {projectCount === 0 && (
        <div className="reveal py-24 text-center sm:py-28 lg:py-32">
          <p
            className="
              mx-auto max-w-xl
              font-['Cormorant_Garamond']
              text-3xl font-light leading-tight text-stone-light
              sm:text-4xl
            "
          >
            No projects are available in this category yet.
          </p>

          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className="btn-outline mt-8 justify-center"
          >
            <span>View All Projects</span>
          </button>
        </div>
      )}
    </div>
  );
}