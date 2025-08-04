"use client"
import { Slider } from "@/components/ui/slider"

interface GradientSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step?: number
  label: string
  className?: string
}

export function GradientSlider({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  label,
  className = "",
}: GradientSliderProps) {
  const getGradientColor = (val: number) => {
    const percentage = (val - min) / (max - min)
  if (percentage <= 0.5) {
    // Green to slightly darker Yellow
    const r = Math.round(255 * (percentage * 2));
    // Reduce green slightly as it approaches yellow
    const g = Math.round(255 * (1 - (percentage * 0.3))); 
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Red
    const r = 255;
    const g = Math.round(255 * (2 - percentage * 2));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span
          className="text-sm font-bold px-2 py-1 rounded text-white"
          style={{ backgroundColor: getGradientColor(value[0]) }}
        >
          {value[0]}
        </span>
      </div>
      <div className="relative">
        <div
          className="absolute inset-0 h-2 rounded-full"
          style={{
            background: `linear-gradient(to right, rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 0, 0))`,
          }}
        />
        <Slider value={value} onValueChange={onValueChange} min={min} max={max} step={step} className="relative z-10" />
      </div>
    </div>
  )
}
