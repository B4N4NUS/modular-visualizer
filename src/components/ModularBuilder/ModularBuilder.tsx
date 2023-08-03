import ModularMesh from "../ModularMesh/ModularMesh";
import Module from "../../Interfaces/Module.types";
import React, { useEffect, useState } from "react";
import { ModularBuilderProps } from "./ModularBuilder.types";
import StatusEffect from "../../Interfaces/StatusEffect.types";

export default function ModularBuilder(props: ModularBuilderProps) {
    const [userSelect, setUserSelect] = useState<Module | null>(null)
    const [selEffect, setSelEffect] = useState<StatusEffect>({
        displayMode: "blink",
        targetRGB: [0, 0.19, 0.2],
        speed: 10
    })
    useEffect(() => {
        if (props.selection) {
            props.selection(userSelect)
        }
    }, [userSelect])

    useEffect(() => {
        if (props.selectionEffect) {
            setSelEffect(props.selectionEffect)
        }
    })

    return <>
        <group position={props.position} onPointerMissed={() => {
            if (userSelect) {
                setUserSelect(null)
            }
        }}>
            {props.models && props.models.map((elem: Module, ind: any) => {
                return <ModularMesh {...props}
                    debug={props.debug === undefined ? false : props.debug}
                    selection={{ get: userSelect, set: setUserSelect }}
                    selectionEffect={selEffect}
                    data={elem}
                    position={[0, 0, 0]}
                    key={ind} />
            })}
        </group>
    </>
}