import NamePlate from "@/app/component/namePlate";
import WhiteButton from "./ui/whiteButton";
import CalendarTileJP from "./ui/calendarTile";
import RiveAnimation from "@/app/component/riveAnimation";

export default function Plus() {
  const text = "RUN";
  return (
    <div className="flex flex-col justify-center items-center">
      <NamePlate name="Jane" place="san flancisco" />
      <CalendarTileJP />
      <div className="flex flex-col bg-gray-100  gap-4 justify-center items-center">
        <WhiteButton text={text} />
        <WhiteButton text={text} />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <RiveAnimation />
      </div>
    </div>
  );
}
