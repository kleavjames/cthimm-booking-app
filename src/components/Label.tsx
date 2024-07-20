import { FC } from "react";

type LabelProps = {
  label: string;
  values: string;
  valuesTwo?: string;
  placeholder?: string;
};

export const Label: FC<LabelProps> = ({
  label,
  values,
  placeholder,
  valuesTwo,
}) => {
  return (
    <div>
      <p className="text-sm">{label}</p>
      {values ? (
        valuesTwo ? (
          <div>
            <p className="text-lg font-bold text-white">{values}</p>
            <p className="text-lg font-bold text-white">{valuesTwo}</p>
          </div>
        ) : (
          <p className="text-lg font-bold text-white">{values}</p>
        )
      ) : (
        <p className="text-lg text-red-400">{placeholder}</p>
      )}
    </div>
  );
};
