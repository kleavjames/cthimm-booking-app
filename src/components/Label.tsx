import { FC } from "react";

type LabelProps = {
  label: string;
  values: string;
};

export const Label: FC<LabelProps> = ({ label, values }) => {
  return (
    <div>
      <p className="text-sm">{label}</p>
      <p className="text-lg font-bold text-white">{values}</p>
    </div>
  );
};
