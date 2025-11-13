type NamePlateProps = {
  name: string;
  place: string;
};

export default function NamePlateImage({ name, place }: NamePlateProps) {
  return (
    <div className=" w-auto flex flex-col items-center">
      <div className="rounded-full h-60 w-60 bg-linear-to-bl from-[#FF00D6] to-[#FF4D00]"></div>
      <div className="text-2xl text-black mt-10 mb-3">{name}</div>
      <div className="text-xl my-3">{place}</div>
    </div>
  );
}
