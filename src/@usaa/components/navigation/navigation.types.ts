export interface UsaaNavigationItem {
    id?: string;
    title?: string;
    subtitle?: string;
    type: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';
    hidden?: (item: UsaaNavigationItem) => boolean;
    active?: boolean;
    disabled?: boolean;
    tooltip?: string;
    link?: string;
    externalLink?: boolean;
    target?: '_blank' | '_self' | '_parent' | '_top' | string;
    exactMatch?: boolean;
    isActiveMatchOptions?: {
        paths: string;
        fragment: string;
        matrixParams: string;
        queryParams: string;
    };
    function?: (item: UsaaNavigationItem) => void;
    classes?: {
        title?: string;
        subtitle?: string;
        icon?: string;
        wrapper?: string;
    };
    icon?: string;
    badge?: {
        title?: string;
        classes?: string;
    };
    children?: UsaaNavigationItem[];
    meta?: any;
}

export type UsaaVerticalNavigationAppearance = 'default' | 'compact' | 'dense' | 'thin';

export type UsaaVerticalNavigationMode = 'over' | 'side';

export type UsaaVerticalNavigationPosition = 'left' | 'right';
