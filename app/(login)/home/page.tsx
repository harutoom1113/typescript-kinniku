import NamePlate from "@/app/component/namePlate";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className="rounded-full h-40 w-40 bg-amber-500"></div>
      <NamePlate name="Jane" place="san flancisco" />
    </div>
  );
}
