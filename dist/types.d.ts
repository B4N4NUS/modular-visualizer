import React from 'react';
import { Vector3 } from '@react-three/fiber';

interface Module {
    name?: string;
    path: string;
    slot?: string;
    isMonitored: boolean;
    status?: string;
    isSelectable: boolean;
    message?: string;
    isMovable: boolean;
    travelV3?: Array<number>;
    isMovedByDefault?: boolean;
    isParent: boolean;
    components?: Array<Module>;
}

interface StatusEffect {
    signature?: string;
    displayMode?: "blink" | "static" | "fade";
    targetRGB?: Array<number>;
    speed?: number;
}

interface ModularBuilderProps {
    selection?: (comp: Module | null) => void;
    models: Array<Module>;
    statuses: StatusEffect[];
    position?: Vector3;
    debug?: boolean;
    selectionEffect?: StatusEffect;
}

declare function ModularBuilder(props: ModularBuilderProps): React.JSX.Element;

interface ModularMeshProps {
    selection: {
        get: Module | null;
        set: (comp: Module | null) => void;
    };
    selectionEffect: StatusEffect;
    data: Module;
    debug: boolean;
    position: number[];
    statuses: Array<StatusEffect>;
}

declare function ModularMesh(props: ModularMeshProps): React.JSX.Element;

interface ModularScene {
    sceneName?: string;
    models: Array<Module>;
}

export { ModularBuilder, ModularMesh, ModularScene, Module, StatusEffect };
