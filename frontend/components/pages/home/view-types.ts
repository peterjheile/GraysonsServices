export type AboutUs = {
  eyebrow: string;
  titleLineNormal: string;
  titleLineHighlight: string;
  paragraphs: string[];
  url: string;
}







export type ValueIconName = "craftsmanship" | "communication" | "commitment" | "dependable";
export type ValueCard = { 
  icon: ValueIconName;
  title: string;
  body: string;
};

export type CredCard = {
  title: string;
  body: string;
};









export type Testimonial = {
  id: number,
  name: string,
  role: string,
  stars: number,
  quote: string,
  project: string,
  featured: boolean
}

export type ContactFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  projectDetails: string;
};





