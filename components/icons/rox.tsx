import * as React from "react";

export const RoxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    fill="none"
    className="transform-3d size-[26px] lg:size-[28px] text-rox-lightblack dark:text-white"
    style={{
      transform: "rotateY(0deg)",
      filter: "blur(0px)",
    }}
    {...props}
  >
    <path
      d="M100 100V0C155.225 0 200 44.775 200 100H100ZM100 0C44.775 0 0 44.775 0 100C55.225 100 100 55.225 100 0ZM100 200C155.225 200 200 155.225 200 100C144.775 100 100 144.775 100 200ZM0 100C0 155.225 44.775 200 100 200V100H0Z"
      fill="currentColor"
    />
  </svg>
);
