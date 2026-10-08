import {useState} from 'react';
import {Chip, Menu, MenuItem, Stack} from '@mui/material';
import {alpha} from '@mui/material/styles';
import {Status, STATUS_LABELS} from '../../models/Status';
import {Priority, PRIORITY_LABELS} from '../../models/Priority';

type ChipListProps = {
    categoryName?: string | null;
    categoryColor?: string | null;
    priority?: string | null;
    status?: string | null;
    /** When set, the status chip opens a menu to pick another status. */
    onStatusChange?: (status: Status) => void;
    /** When set, the priority chip opens a menu to pick another priority. */
    onPriorityChange?: (priority: Priority) => void;
};

type OpenMenu = { anchor: HTMLElement; kind: 'status' | 'priority' };

export default function ChipList({
    categoryName, categoryColor, priority, status, onStatusChange, onPriorityChange,
}: ChipListProps) {
    const [menu, setMenu] = useState<OpenMenu | null>(null);

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

    const statusLabel = (value: string) => STATUS_LABELS[value as Status] ?? value;
    const priorityLabel = (value: string) => PRIORITY_LABELS[value as Priority] ?? value;

    // the chips live inside a clickable card: don't let the click open the card as well
    const openMenu = (kind: OpenMenu['kind']) => (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setMenu({anchor: event.currentTarget, kind});
    };

    const options = menu?.kind === 'status'
        ? Object.values(Status).map((s) => ({value: s, label: STATUS_LABELS[s], selected: s === status}))
        : Object.values(Priority).map((p) => ({value: p, label: PRIORITY_LABELS[p], selected: p === priority}));

    const handleSelect = (value: string, selected: boolean) => {
        const kind = menu?.kind;
        setMenu(null);
        if (selected) return;
        if (kind === 'status') onStatusChange?.(value as Status);
        else onPriorityChange?.(value as Priority);
    };

    return (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {categoryName && (
                <Chip
                    label={categoryName}
                    size="small"
                    sx={{
                        backgroundColor: alpha(categoryColor || '#888888', 0.15),
                        color: categoryColor || 'text.secondary',
                    }}
                />
            )}
            {priority && (
                <Chip
                    label={priorityLabel(priority)}
                    size="small"
                    color={getColor(priority)}
                    variant="outlined"
                    onClick={onPriorityChange ? openMenu('priority') : undefined}
                />
            )}
            {status && (
                <Chip
                    label={statusLabel(status)}
                    size="small"
                    color={getColor(status)}
                    variant="filled"
                    onClick={onStatusChange ? openMenu('status') : undefined}
                />
            )}
            <Menu
                anchorEl={menu?.anchor}
                open={menu !== null}
                onClose={() => setMenu(null)}
                onClick={(event) => event.stopPropagation()}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={option.selected}
                        onClick={() => handleSelect(option.value, option.selected)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </Stack>
    );
}
