import Image from "next/image";

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width: number;
  height: number
}

export function ProductImage({alt, height, width, className, src, style}: Props) {

  const localSrc = ( src )
    ? src.startsWith('http') // https://urlcompletodelaimagen.jpg
      ? src
      : `/products/${src}`
    : "/imgs/placeholder.jpg"

  return (
    <Image
      src={localSrc} 
      width={width}
      height={height}
      alt={alt}
      className={className} 
      style={style}
    />
  )
}
