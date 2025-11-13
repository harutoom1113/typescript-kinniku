import Button from "@/app/component/button";
import NamePlate2 from "@/app/component/nameplateImage";

export default function Profile() {
  const text = "EDIT";
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <NamePlate2 name="Jane" place="san flancisco" />
      <Button text={text} />
    </div>
  );
}
