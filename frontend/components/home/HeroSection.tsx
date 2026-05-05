import { PrimaryButton } from "@/components/ui/buttons"


export function HeroSection(){

    return (
        <div className = "relative w-full h-[80vh] min-h-[450px]">

            {/* Hero Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
            >
                <source src="/videos/hero.webm" type="video/webm" />
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Hero Video Visibility Overlay */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,0.6)_100%)]"/>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0)_70%,rgba(0,0,0,0.4)_100%)]"/>

            {/* Bottom Left Content */}
            <div className={`
                absolute inset-0 flex items-end justify-center
                mx-auto
                max-w-7xl
                lg:justify-start
            `}>

                <div className = {`
                    w-75 mb-5
                    md:w-1/2
                    lg:w-1/2 ml-5 max-w-200
                `}>

                    <p className={`
                        text-center text-[10px] uppercase text-white
                        md:text-[12px] md:tracking-wide
                        lg:text-left lg:text-lg lg:tracking-wider

                        
                    `}>
                        Landscaping • Hardscaping • Outdoor Living
                    </p>
                      {/* Divider (subtle but HUGE improvement) */}
                    <div className="mt-2 h-px w-12 bg-white/40" />
                    <p className = "hidden sm:block lg:hidden text-center">
                        Patios, walls, walkways, grading, and full yard improvements done right.
                    </p>

                    <p className = "hidden lg:block mt-4 text-white">
                        We help homeowners improve their yards with landscaping, hardscaping, patios, retaining walls, grading, and cleanups—done right from start to finish.
                    </p>




                    {/* <p className={`
                        text-center mt-2 text-sm text-white
  
                    `}>

                        Patios, retaining walls, walkways, grading, and full yard transformations.
                    </p> */}

                </div>
            </div>


            {/* Center CTA */}
            <div className = "absolute inset-0 flex items-center justify-center">
                <div className = "text-center text-white translate-y-5">
                    <p className = "text-4xl font-highlight">We Make It Happen</p>
                    <PrimaryButton 
                        text="Request a Quote"
                        className = "mt-6 px-4 py-1 "
                    />
                </div>
            </div>


        </div>
    )

}