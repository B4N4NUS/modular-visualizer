import { Module } from "./Module.types";
export interface ModularScene {
    sceneName: string | null;
    models: Array<Module> | null;
}
