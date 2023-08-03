import Module from "../../Interfaces/Module.types"
import StatusEffect from "../../Interfaces/StatusEffect.types";

export interface ModularMeshProps {
    selection: { get: Module | null, set: (comp: Module | null) => void };
    selectionEffect: StatusEffect;
    data: Module;
    debug: boolean;
    position: number[];
    statuses: Array<StatusEffect>
}