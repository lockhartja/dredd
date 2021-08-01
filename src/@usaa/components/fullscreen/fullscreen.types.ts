export interface UsaaDocument extends HTMLDocument
{
    mozFullScreenElement?: Element;
    mozCancelFullScreen?: () => void;
    msFullscreenElement?: Element;
    msExitFullscreen?: () => void;
    webkitFullscreenElement?: Element;
    webkitExitFullscreen?: () => void;
}

export interface UsaaDocumentElement extends HTMLElement
{
    mozRequestFullScreen?: () => void;
    msRequestFullscreen?: () => void;
    webkitRequestFullscreen?: () => void;
}
