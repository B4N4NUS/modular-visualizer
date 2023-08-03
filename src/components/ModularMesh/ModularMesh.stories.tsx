import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import ModularMesh from "./ModularMesh";
import MotherBoardModelInfo from '../../../public/server/motherBoardOnly.json'
import DriveModelInfo from '../../../public/server/driveOnly.json'
import serverStatusInfo from '../../../public/server/statusInfo.json'
import { Canvas } from "@react-three/fiber";
import Module from "../../Interfaces/Module.types";
import { OrbitControls } from "@react-three/drei";

const meta: Meta<typeof ModularMesh> = {
    component: ModularMesh,
    title: "ModularMesh",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ModularMesh>;

export const MotherBoard: Story = (args) => {
    const [selectedInfo, setInfo] = useState<Module | null>(null)
    return <>
        {selectedInfo && <div className="wall-of-text" style={{ position: "absolute", right: 0, zIndex: 200, userSelect: "none" }}>
            <div style={{ flexDirection: "row", display: "flex" }}>
                <div className="info-header" style={{ flex: 1 }}>
                    {selectedInfo.name}
                </div>
                <div className='button-icon' style={{ height: 20, width: 20 }} onClick={() => {
                    setInfo(null)
                }}>
                    <img src={"cross.svg"} style={{ height: 20, width: 20 }}></img>
                </div>
            </div>

            {selectedInfo.isMovable && <>
                <div className="info-desk">
                    [Can Be Moved]
                </div>
            </>}


            {selectedInfo.isMonitored && <>
                <div className="info-desk">
                    {"Status - [" + selectedInfo.status + "]"}
                </div>
                <div className="info-text">
                    {selectedInfo.message}
                </div>

            </>}

            {selectedInfo.isParent && <>
                <div className="info-desk">
                    {"Child Components - [" + selectedInfo.components?.length + "]"}
                </div>

                {selectedInfo.components?.map((elem, ind) => {
                    return <div className="info-text" key={ind}> {"[" + ind + "] - " + elem.name} </div>
                })
                }

            </>}
        </div>}
        <Canvas camera={{ position: [0.5, 0.5, 0.5] }} style={{ width: "100vw", overflow:"hidden", height: "100vh", background: "#b3b3b3" }} >
            <ambientLight intensity={1} />
            <gridHelper />
            <pointLight castShadow={true} position={[0, 1, 1]} />

            <ModularMesh  {...args} selection={{ get: selectedInfo, set: setInfo }} />
            <OrbitControls />
        </Canvas>
    </>
};
MotherBoard.args = {
    data: MotherBoardModelInfo,
    statuses: serverStatusInfo,
    position: [0, 0, 0]
};


export const Drive: Story = (args) => {
    const [selectedInfo, setInfo] = useState<Module | null>(null)
    return <>
        {selectedInfo && <div className="wall-of-text" style={{ position: "absolute", right: 0, zIndex: 200, userSelect: "none" }}>
            <div style={{ flexDirection: "row", display: "flex" }}>
                <div className="info-header" style={{ flex: 1 }}>
                    {selectedInfo.name}
                </div>
                <div className='button-icon' style={{ height: 20, width: 20 }} onClick={() => {
                    setInfo(null)
                }}>
                    <img src={"cross.svg"} style={{ height: 20, width: 20 }}></img>
                </div>
            </div>

            {selectedInfo.isMovable && <>
                <div className="info-desk">
                    [Can Be Moved]
                </div>
            </>}


            {selectedInfo.isMonitored && <>
                <div className="info-desk">
                    {"Status - [" + selectedInfo.status + "]"}
                </div>
                <div className="info-text">
                    {selectedInfo.message}
                </div>

            </>}

            {selectedInfo.isParent && <>
                <div className="info-desk">
                    {"Child Components - [" + selectedInfo.components?.length + "]"}
                </div>

                {selectedInfo.components?.map((elem, ind) => {
                    return <div className="info-text" key={ind}> {"[" + ind + "] - " + elem.name} </div>
                })
                }

            </>}
        </div>}
        <Canvas camera={{ position: [0.5, 0.5, 0.5] }} style={{ width: "100vw", overflow:"hidden", height: "100vh", background: "#b3b3b3" }} >
            <ambientLight intensity={1} />
            <gridHelper />
            <pointLight castShadow={true} position={[0, 1, 1]} />

            <ModularMesh  {...args} selection={{ get: selectedInfo, set: setInfo }} />
            <OrbitControls />
        </Canvas>
    </>
};
Drive.args = {
    data: DriveModelInfo,
    statuses: serverStatusInfo,
    position: [0, 0, 0]
};
