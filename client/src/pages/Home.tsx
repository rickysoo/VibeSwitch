import VibeToggle from "@/components/VibeToggle";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <VibeToggle 
        onChange={(isOn) => {
          console.log("Vibe state changed:", isOn ? "ON" : "OFF");
        }} 
      />
    </div>
  );
}
