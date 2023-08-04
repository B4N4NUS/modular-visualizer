
import { useEffect, useState, useRef, startTransition } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFrame } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import { ModularMeshProps } from "./ModularMesh.types";
import { Group, Object3D, Vector3 } from 'three'
import React from "react";
import StatusEffect from "../../Interfaces/StatusEffect.types";

const loader = new GLTFLoader();

export default function ModularMesh(props: ModularMeshProps) {

    // Реф модели для применения эффектов.
    const modelRef = useRef()

    // Нынешний эффект детали.
    const [status, setStatus] = useState<StatusEffect>()
    // Стандартный эффект детали.
    const [defaultStatus, setDefaultStatus] = useState<StatusEffect>()
    // Трехмерная модель детали.
    const [model, setModel] = useState<Group>()
    // Массив точек, описывающих слоты, найденные на модели.
    const [interactables, setInteractables] = useState<Array<{ position: Vector3 | null, slot: string | null }>>([])
    // Финальная точка перемещения детали.
    const [maxElevation, setMaxElevation] = useState<number[]>([0, 0, 0])
    // Передвинута ли деталь.
    const [elevating, setElevating] = useState(false)
    // Будет ли деталь анимирована для визуализации эффекта
    const [isAnimated, setIsAnimated] = useState(false)
    // Анимировать ли деталь как выбранную.
    const [selected, setSelected] = useState(false)
    // Пересекает ли курсор пользователя деталь.
    const [hovered, setHovered] = useState<boolean>(false)

    // Положение детали.
    const { position } = useSpring({
        position: elevating && modelRef ? maxElevation : props.position,
        config: config.slow,
    })

    // Инициализация стартовых эффектов.
    useEffect(() => {
        if (props.data.isMonitored) {
            setIsAnimated(true)
            let stat = props.statuses.find((elem: StatusEffect) => {
                return (elem.signature === props.data.status)
            })
            setDefaultStatus(stat)
            setStatus(stat)
            props.debug && console.log("[DEBUG] Monitoring animation for [" + props.data.name + "] was configured")
        }
    }, [props.data.status])

    // Стартовая инициализация основого состояния детали.
    useEffect(() => {
        if (!props.data) {
            return
        }

        props.debug && console.log("[DEBUG] Creating Modular Mesh for [" + props.data.name + "]")

        if (props.data.isMovable) {
            setIsAnimated(true)
            if (props.data.travelV3)
                setMaxElevation([props.position[0] + props.data.travelV3[0], props.position[1] + props.data.travelV3[1], props.position[2] + props.data.travelV3[2]])
            if (props.data.isMovedByDefault)
                setElevating(props.data.isMovedByDefault)
            props.debug && console.log("[DEBUG] Movement animation for [" + props.data.name + "] was configured")
        }

        // Модель гружу через GLTFLoader.load, так как у него есть колбек, в котором можно обработать куски модели. Если такое добавят в UseLoader, то нужно будет перейти на него.
        loader.load(props.data.path,
            (gltf) => {
                setModel(gltf.scene)
                // Обработка слотов в модели.
                if (props.data.isParent) {
                    let slotInteractables = new Array<{ position: Vector3 | null, slot: string | null }>
                    gltf.scene.children.map((elem) => {
                        if (elem.type === "Object3D") {
                            slotInteractables.push({ position: elem.position, slot: elem.name })
                        }
                    })
                    setInteractables(slotInteractables)
                    props.debug && console.log("[DEBUG] Found " + slotInteractables.length + " slots in [" + props.data.name + "]")
                }
                props.debug && console.log("[DEBUG] Created Modular Mesh for [" + props.data.name + "]")
            },
            (xhr) => {
            }
        )
    }, [])

    // Обнуление визуала детали при изменении выбранной детали, либо статуса детали.
    useEffect(() => {
        (modelRef.current as any).traverse((obj: { material: { emissive: { setRGB: (arg0: number, arg1: number, arg2: number) => void; }; needsUpdate: boolean; }; }) => {
            if (obj.material && obj.material.emissive) {
                obj.material.emissive.setRGB(0, 0, 0)
                obj.material.needsUpdate = false
            }
        });
        if (selected) {
            setStatus(props.selectionEffect)
        }

    }, [selected, props.data.status])

    // Чистка стейтов после выбора другой детали.
    useEffect(() => {
        if (props.data && props.selection && selected)
            if (props.selection.get !== props.data) {
                setSelected(false)
                setStatus(defaultStatus)
                props.debug && console.log("[Debug] Unselect on " + props.data.name)
            }
    }, [props.selection && props.selection.get])

    // Изменение курсора при пересечении детали.
    useEffect(() => {
        if (hovered) {
            if (props.data.isSelectable) {
                document.body.style.cursor = 'help'
            }
            if (props.data.isMovable) {
                document.body.style.cursor = 'grab'
            }
        }
        return () => { document.body.style.cursor = 'auto' }
    }, [hovered])

    // Обработка эффекта детали в каждом фрейме.
    useFrame((state, delta) => {
        if (!modelRef) {
            return
        }

        if (status && modelRef.current && status.displayMode)
            switch (status.displayMode) {
                case "blink": {
                    if (status.speed && status.targetRGB) {
                        (modelRef.current as any).traverse((obj: { material: { emissive: { setRGB: (arg0: number, arg1: number, arg2: number) => void; }; needsUpdate: boolean; }; }) => {
                            if (status.speed && status.targetRGB && obj.material && obj.material.emissive && Math.sin(state.clock.getElapsedTime() * status.speed) > 0) {
                                obj.material.emissive.setRGB(Math.sin(state.clock.getElapsedTime() * status.speed) * status.targetRGB[0], Math.sin(state.clock.getElapsedTime() * status.speed) * status.targetRGB[1], Math.sin(state.clock.getElapsedTime() * status.speed) * status.targetRGB[2]);
                                obj.material.needsUpdate = true
                            }
                        });
                    }
                    break
                }
                case "fade": {
                    if (status.speed && status.targetRGB) {
                        (modelRef.current as any).traverse((obj: { material: { emissive: { setRGB: (arg0: number, arg1: number, arg2: number) => void; }; needsUpdate: boolean; }; }) => {
                            if (status.speed && status.targetRGB && obj.material && obj.material.emissive) {
                                obj.material.emissive.setRGB((Math.sin(state.clock.getElapsedTime() * status.speed) * 0.5 + 0.5) * status.targetRGB[0], (Math.sin(state.clock.getElapsedTime() * status.speed) * 0.5 + 0.5) * status.targetRGB[1], (Math.sin(state.clock.getElapsedTime() * status.speed) * 0.5 + 0.5) * status.targetRGB[2]);
                                obj.material.needsUpdate = true
                            }
                        });
                    }
                    break
                }
                default: {
                    (modelRef.current as any).traverse((obj: { material: { emissive: { setRGB: (arg0: number, arg1: number, arg2: number) => void; }; needsUpdate: boolean; }; }) => {
                        if (status.targetRGB && obj.material && obj.material.emissive) {
                            obj.material.emissive.setRGB(status.targetRGB[0], status.targetRGB[1], status.targetRGB[2]);
                            obj.material.needsUpdate = false
                        }
                    });
                    break
                }
            }
    })

    return (
        <animated.group {...props} position={position as any}
            onClick={(e) => {
                e.stopPropagation()
                if (e.delta > 0 || props.selection?.get === props.data || (props.data && !props.data.isSelectable)) {
                    return
                }
                setSelected(!selected)
                startTransition(() => {
                    if (props.selection)
                        props.selection.set(props.data)
                })

            }}
            onDoubleClick={(e) => {
                if (props.data.isMovable) {
                    setElevating(!elevating)

                }
                e.stopPropagation()
            }}

            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                setHovered(false)
            }}
        >
            <primitive object={model ? model : new Object3D} ref={modelRef} />

            {props.data.components && interactables.map((elem: any, ind) => {
                let b = props.data.components?.find((comp) => {
                    return elem.slot === comp.slot
                })
                if (b)
                    return <ModularMesh {...props} data={b} position={elem.position.toArray()} key={ind} />
            })}
        </animated.group>
    )
}