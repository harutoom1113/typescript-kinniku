type NamePlateProps = {
  name: string;
  place: string;
};

export default function NamePlate({ name, place }: NamePlateProps) {
  return (
    <div className="h-20 w-auto flex flex-col items-center">
      <div className="text-4xl text-black ">{name}</div>
      <div className="text-xl ">{place}</div>
    </div>
  );
}
