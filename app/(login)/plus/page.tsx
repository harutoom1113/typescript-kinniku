import NamePlate from "@/app/component/namePlate";
import WhiteButton, { WhiteButtonText } from "./ui/whiteButton";
import CalendarTileJP from "./ui/calendarTile";
import RiveAnimation from "@/app/component/riveAnimation";

export default function Plus() {
  return (
    <div className="flex flex-col justify-center items-center mt-12">
      <NamePlate name="Jane" place="san flancisco" />
      <CalendarTileJP />
      <div className="flex flex-col mt-10  gap-4 justify-center items-center w-1/2">
        <WhiteButton text={WhiteButtonText.RUN} />
        <WhiteButton text={WhiteButtonText.WEIGHT} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <RiveAnimation />
        </div>
      </div>
    </div>
  );
}
