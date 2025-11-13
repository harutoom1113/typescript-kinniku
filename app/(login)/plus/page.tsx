import NamePlate from "@/app/component/namePlate";
import WhiteButton from "./ui/whiteButton";
import CalendarTileJP from "./ui/calendarTile";

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
    </div>
  );
}
