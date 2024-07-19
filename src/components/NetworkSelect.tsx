import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  luzonChurches,
  mindanaoChurches,
  networks,
  visayasChurches,
} from "@/constants/networks";
import { FC } from "react";

type NetworkSelectProps = {
  onChange: (value: string) => void;
  value: string;
};

export const NetworkSelect: FC<NetworkSelectProps> = ({ onChange, value }) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select network/churches" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Networks</SelectLabel>
          {networks.map((network) => (
            <SelectItem key={network.id} value={network.name}>
              {network.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Luzon Churches</SelectLabel>
          {luzonChurches.map((network) => (
            <SelectItem key={network.id} value={network.name}>
              {network.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Visayas Churches</SelectLabel>
          {visayasChurches.map((network) => (
            <SelectItem key={network.id} value={network.name}>
              {network.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Mindanao Churches</SelectLabel>
          {mindanaoChurches.map((network) => (
            <SelectItem key={network.id} value={network.name}>
              {network.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
