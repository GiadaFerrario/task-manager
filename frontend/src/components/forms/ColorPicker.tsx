import {Box, Stack} from "@mui/material";

type ColorPickerProps = {
    colors: readonly string[];
    value: string;
    onChange: (color: string) => void;
};

export default function ColorPicker({colors, value, onChange}: ColorPickerProps) {
    // a category can have a color outside the palette (created through the API): keep it selectable
    const options = colors.includes(value) ? colors : [value, ...colors];

    return (
        <Stack direction="row" spacing={1} role="radiogroup" aria-label="Category color" flexWrap="wrap" useFlexGap>
            {options.map((color) => (
                <Box
                    key={color}
                    component="button"
                    type="button"
                    role="radio"
                    aria-checked={color === value}
                    aria-label={color}
                    onClick={() => onChange(color)}
                    sx={{
                        width: 28,
                        height: 28,
                        p: 0,
                        flexShrink: 0,
                        boxSizing: "border-box",
                        borderRadius: "50%",
                        backgroundColor: color,
                        cursor: "pointer",
                        border: "2px solid white",
                        outline: color === value ? `2px solid ${color}` : "1px solid rgba(0,0,0,0.2)",
                        outlineOffset: 1,
                    }}
                />
            ))}
        </Stack>
    );
}
