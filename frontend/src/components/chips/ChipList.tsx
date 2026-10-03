import { Stack, Chip } from '@mui/material';
import { Status } from '../../models/Status';
import { Priority } from '../../models/Priority';

type ChipListProps = {
    categoryName?: string | null;
    categoryColor?: string | null;
    priority?: string | null;
    status?: string | null;
};

export default function ChipList({ categoryName, categoryColor, priority, status }: ChipListProps) {

    const colorMap: Record<string, 'error' | 'warning' | 'success' | 'default'> = {
        [Status.TODO]: 'error',
        [Status.IN_PROGRESS]: 'warning',
        [Status.DONE]: 'success',
        [Priority.HIGH]: 'error',
        [Priority.MEDIUM]: 'warning',
        [Priority.LOW]: 'success',
    };

    const getColor = (value?: string) => {
        if (!value) return 'default';
        return colorMap[value.toUpperCase()] || 'default';
    };

    return (
        <Stack direction="row" spacing={1.5}>
            {categoryName && (
                <Chip
                    label={categoryName}
                    variant="outlined"
                    sx={{
                        borderColor: categoryColor || 'gray',
                        color: categoryColor || 'inherit',
                    }}
                />
            )}
            {priority && <Chip label={priority} color={getColor(priority)} variant="outlined" />}
            {status && <Chip label={status} color={getColor(status)} variant="filled" />}
        </Stack>
    );
}
