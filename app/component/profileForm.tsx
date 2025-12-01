import React from "react";
import Button, { ButtonText } from "@/app/component/button";
type FormDataType = {
  name: string;
  place: string;
  weight: number;
  height: number;
  userId: string;
};

type Props = {
  formData: FormDataType;
  isEditing: boolean;
  isSaving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSave: () => void;
};

export const ProfileForm: React.FC<Props> = ({
  formData,
  isEditing,
  isSaving,
  onChange,
  onEdit,
  onSave,
}) => {
  if (!isEditing) {
    return (
      <div className="w-1/2">
        <Button text={ButtonText.EDIT} onClick={onEdit} />
      </div>
    );
  }

  return (
    <div className="w-1/2 flex flex-col items-center">
      <input
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="NAME"
        className="w-full border p-2 rounded my-3 h-15"
      />
      <input
        name="place"
        value={formData.place}
        onChange={onChange}
        placeholder="PLACE"
        className="w-full border p-2 rounded my-3 h-15"
      />
      <input
        name="weight"
        value={formData.weight}
        onChange={onChange}
        placeholder="WEIGHT"
        className="w-full border p-2 rounded my-3 h-15"
      />
      <input
        name="height"
        value={formData.height}
        onChange={onChange}
        placeholder="HEIGHT"
        className="w-full border p-2 rounded my-3 h-15"
      />
      <input
        name="userId"
        value={formData.userId}
        onChange={onChange}
        placeholder="USER ID"
        className="w-full border p-2 rounded mt-3 mb-10 h-15"
      />
      <div className="mt-3 mb-20 ">
        {isSaving ? (
          <button
            className="bg-black text-white font-black text-xs h-15 w-full px-20 rounded-md"
            disabled
          >
            loading...
          </button>
        ) : (
          <Button text={ButtonText.DONE} onClick={onSave} />
        )}
      </div>
    </div>
  );
};
