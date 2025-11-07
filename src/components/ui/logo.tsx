import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
}) => {
  const circleSize = { sm: 100, md: 140, lg: 180 };
  const iconScale = { sm: 1.3, md: 1.5, lg: 1.7 };
  const textSize = { sm: "text-[12px]", md: "text-[15px]", lg: "text-[18px]" };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* 円の中にアイコン＋テキスト */}
      <div
        className="rounded-full flex flex-col items-center justify-center overflow-hidden relative shadow-sm hover:opacity-90 transition-opacity"
        style={{
          width: `${circleSize[size]}px`,
          height: `${circleSize[size]}px`,
          backgroundColor: "#FFD1D7", // 背景色（ボタンと揃える）
          border: "2px solid #dad6d7", // ボタンと同じ枠線
        }}
      >
        {/* アイコン */}
        <div
          className="relative w-[60%] h-[60%] flex items-center justify-center"
          style={{
            transform: `scale(${iconScale[size]})`,
            transformOrigin: "center",
          }}
        >
          <Image
            src="/Cal_Weight.png"
            alt="CalWeight Icon"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* テキスト（円の中） */}
        <span
          className={`absolute bottom-[15%] text-white font-semibold ${textSize[size]}`}
        >
          CalWeight
        </span>
      </div>
    </div>
  );
};
