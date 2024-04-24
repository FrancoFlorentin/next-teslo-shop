import { titleFont } from "@/config/fonts";

interface Props {
    title: string;
    subtitle?: string;
    className?: string;
}

export function Title({ title, subtitle, className}: Props) {
  return (
    <div className={`mt-3 ${className}`}>
      {/* Este h1 va a ser util para los motores de búsqueda de google */}
      <h1 className={`${titleFont.className} antialiased text-4xl font-semibold my-10`}>{title}</h1>

      {
        subtitle && (
          <h3 className="text-xl mb-5">{subtitle}</h3>
        )
      }
    

    </div>
  )
}
