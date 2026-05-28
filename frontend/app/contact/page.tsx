import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ContactHero from "@/components/pages/contact/ContactHero"
import EstimateForm from "@/components/pages/contact/EstimateForm"

export default function ContactPage() {

    return (
        <main className="grain">
            <Header />
            <ContactHero/>
            <EstimateForm/>
            <Footer />
        </main>
    )

}