export default interface StatusEffect {
        signature?: string;
        displayMode?: "blink" | "static" | "fade";
        targetRGB?: Array<number>;
        speed?: number;
}