export default interface Module {
    name?: string,
    path: string,
    slot?: string,

    isMonitored: boolean,
    status?: string,

    isSelectable: boolean,
    message?: string,

    isMovable: boolean,
    travelV3?: Array<number>,
    isMovedByDefault?: boolean,

    isParent: boolean,
    components?: Array<Module>
}