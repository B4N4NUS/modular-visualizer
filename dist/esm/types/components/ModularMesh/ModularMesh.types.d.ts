import { Module } from "../../Interfaces/Module.types";
import { StatusEffect } from "../../Interfaces/StatusEffect.types";
export interface ModularMeshProps {
    selection: {
        get: Module;
        set: (comp: Module) => void;
    };
    data: Module;
    debug: boolean;
    position: number[];
    statuses: Array<StatusEffect>;
}
