import { Vector3 } from "@react-three/fiber";
import Module from "../../Interfaces/Module.types"
import StatusEffect from "../../Interfaces/StatusEffect.types";

export interface ModularBuilderProps {
    selection?: (comp: Module | null) => void;
    models: Array<Module>
    statuses: StatusEffect[]
    position?: Vector3
    debug?: boolean
    selectionEffect?: StatusEffect
}