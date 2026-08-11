import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ContactHero from "@/components/pages/contact/ContactHero";
import EstimateForm from "@/components/pages/contact/EstimateForm";
import { getServiceNames } from "@/features/services/api";

export default async function ContactPage() {
  const services = await getServiceNames();

  return (
    
    <div className="grain">
      <Header />

      <main>
        <ContactHero />
        <EstimateForm services={services} />
      </main>

      <Footer />
    </div>
  );
}