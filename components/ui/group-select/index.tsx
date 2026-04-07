import React from "react";

import AppIcon from "../app-icon";
import Box from "../box";
import AppPressable from "../pressable";
import Typography from "../typography";

// import {Box, AppPressable, Typography, AppIcon} from '../ui'

interface GroupSelectItem {
  name: string;
  onSelect: () => void;
  value?: string;
  icon?: string;
}

interface GroupSelectProps {
  items: GroupSelectItem[];
  selectedValue?: string;
}

const GroupSelect = ({ items, selectedValue }: GroupSelectProps) => {
  return (
    <Box flexDirection="row" flexWrap="wrap" gap={8} marginTop={12}>
      {items.map(({ name, onSelect, value, icon }) => (
        <AppPressable key={value} onPress={onSelect} flex={1}>
          <Box
            height={40}
            borderWidth={2}
            px={12}
            flexDirection="row"
            alignItems="center"
            justifyContent={icon ? "flex-start" : "center"}
            borderColor={selectedValue === value ? "primary-100" : "neutral-300"}
            borderRadius={8}
          >
            <Typography
              variant="body-bold"
              color={selectedValue === value ? "primary-100" : "neutral-500"}
            >
              {name}
            </Typography>
            {icon && (
              <AppIcon
                name={icon}
                size={20}
                color={selectedValue === value ? "#2C67F6" : "#959CA7"}
              />
            )}
          </Box>
        </AppPressable>
      ))}
    </Box>
  );
};

export { GroupSelect };
