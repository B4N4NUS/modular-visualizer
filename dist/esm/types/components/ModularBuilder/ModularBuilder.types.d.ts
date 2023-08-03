import { Module } from "../../Interfaces/Module.types";
import { StatusEffect } from "../../Interfaces/StatusEffect.types";
export interface ModularBuilderProps {
    selection: {
        get: Module;
        set: (comp: Module) => void;
    };
    models: Array<Module>;
    statuses: Array<StatusEffect>;
    position: Array<number>;
}
