import { FC } from "react";
import { generateFromString } from "generate-avatar";
import Image from "next/image";

const Avatar: FC<{
  image?: string | null;
  email: string;
  size?: "xl" | "base" | "sm" | "xs";
}> = ({ image, email, size }) => {
  size = size ?? "base";
  const svg = generateFromString(email!);

  if (image) {
    return (
      <div
        className={
          {
            xl: "h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32",
            base: "h-8 w-8 sm:h-10 sm:w-10",
            sm: "h-8 w-8",
            xs: "h-6 w-6",
          }[size] +
          " relative overflow-hidden rounded-full border border-transparent shadow group-hover:border-fuchsia-800 group-hover:shadow-lg group-hover:ring group-hover:ring-fuchsia-600/75"
        }
      >
        <Image alt="" layout="fill" src={image} />
      </div>
    );
  }
  return (
    <div
      className={
        {
          xl: "h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32",
          base: "h-8 w-8 sm:h-10 sm:w-10",
          sm: "h-8 w-8",
          xs: "h-6 w-6",
        }[size] +
        " relative overflow-hidden rounded-full border border-transparent shadow group-hover:border-fuchsia-800 group-hover:shadow-lg group-hover:ring group-hover:ring-fuchsia-600/75"
      }
    >
      <Image alt="" src={`data:image/svg+xml;utf8,${svg}`} layout="fill" />
    </div>
  );
};

export default Avatar;
