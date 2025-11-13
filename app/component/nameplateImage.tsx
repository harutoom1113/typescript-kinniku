type NamePlateProps = {
  name: string;
  place: string;
};

export default function NamePlateImage({ name, place }: NamePlateProps) {
  return (
    <div className=" w-auto flex flex-col items-center">
      <div className="rounded-full h-40 w-40 bg-linear-to-bl from-[#FF00D6] to-[#FF4D00]"></div>
      <div className="text-2xl text-black ">{name}</div>
      <div className="text-xl ">{place}</div>
    </div>
  );
}
