import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ServicesHero from "@/components/pages/services/ServicesHero"
import ServicesNav from "@/components/pages/services/ServicesNav"
import ServicesGrid from "@/components/pages/services/ServicesGrid"
import ProcessSection from "@/components/pages/services/ProcessSection"
import MaterialsSection from "@/components/pages/services/MaterialsSection"

export default function ServicesPage() {

    return (
    <main className="grain">
        <Header />
        <ServicesHero/>
        <ServicesNav/>
        <ServicesGrid/>
        <ProcessSection/>
        {/* <MaterialsSection/> */}
        <Footer/>
    </main>
    )
}