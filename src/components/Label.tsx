import { FC } from "react";

type LabelProps = {
  label: string;
  values: string;
  placeholder?: string;
};

export const Label: FC<LabelProps> = ({ label, values, placeholder }) => {
  return (
    <div>
      <p className="text-sm">{label}</p>
      {values ? (
        <p className="text-lg font-bold text-white">{values}</p>
      ) : (
        <p className="text-lg text-red-400">{placeholder}</p>
      )}
    </div>
  );
};
