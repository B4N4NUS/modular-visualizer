import Module from "./Module.types";

export default interface ModularScene {
    sceneName: string | null,
    models: Array<Module> | null
}