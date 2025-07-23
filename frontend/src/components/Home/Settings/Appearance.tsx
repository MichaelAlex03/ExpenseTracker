import {Palette } from "lucide-react";

const Appearance = () => {
  return (
     <div className="flex flex-row justify-center items-start border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-80">
      <div className="w-full flex flex-row items-center gap-4">
        <Palette />
        <h1 className="text-2xl text-[#09090B] font-semibold">Appearance</h1>
      </div>
    </div>
  )
}

export default Appearance