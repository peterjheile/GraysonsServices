interface SectionHeadingProps {
  title: string;
  description: string;
}

export default function SectionHeading({
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">
        {title}
      </h3>
      <p className="mt-1 text-xs font-light text-[#a39890]">{description}</p>
    </div>
  );
}