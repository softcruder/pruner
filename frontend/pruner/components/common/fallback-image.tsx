import Image from "next/image";

interface FImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const FImage = ({ src, alt, width, height, className }: FImageProps) => (
  <div className="flex items-center justify-center w-full h-full bg-gray-200">
    <Image
      src={src || "/placeholder.svg"}
      alt={alt || "Image"}
      width={width || 50}
      height={height || 50}
      className={className}
    />
  </div>
);