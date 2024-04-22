import { useEffect, useMemo, useState } from "react";
import { randomSeed } from "../sprite/edit";
import { CharacterCreator } from "./CharacterCreator";
import { Game } from "./Game";
import useAoRtc from "@/hooks/useAoRtc";
import { rtcEventEmitter } from "@/lib/services/ao-rtc";

function generateOtherToon(i: number) {
	return {
		id: "otherToon" + i,
		avatarSeed: randomSeed(),
		displayName: "Toon #" + i,
		savedPosition: {
			x: i * 2 + 1,
			y: i * 2 + 1,
		},
	};
}

const otherToons = Array.from(Array(4).keys()).map(generateOtherToon);

export const GameDemo = () => {
	const [seed, setSeed] = useState(randomSeed());
	const { rtc } = useAoRtc();
	const [mediaStream, setMediaStream] = useState<MediaStream>();

	const demoState = useMemo(
		() => ({
			user: {
				id: "me",
				avatarSeed: seed,
				displayName: "ME!!",
				savedPosition: {
					x: 7,
					y: 3,
				},
			},
			otherToons,
		}),
		[seed],
	);

	useEffect(()=>{
		rtcEventEmitter.on('mediaStream', (stream)=> setMediaStream(stream));
		if(mediaStream){
			const video = document.getElementById("video-call") as HTMLVideoElement;
			video.srcObject = mediaStream;
		} else if (mediaStream === null){
			const video = document.getElementById("video-call") as HTMLVideoElement;
			video.srcObject = null;
		}
	},
		[mediaStream])

	return (
		<div className=" flex flex-row items-center justify-center h-screen w-screen">
			<CharacterCreator initialSeed={seed} onSeedChange={setSeed} />
			<div style={{display: 'flex', gap:'10px', flexDirection:"column"}}>
				<video id="video-call" autoPlay playsInline muted style={{border: 'solid 1px black'}}></video>

				<button onClick={()=> rtc.register({})}>Register</button>
				<button onClick={()=> rtc.getUsers().then((users)=> console.log(users) )}>Get Users</button>
				<button onClick={()=> rtc.getContractConnections().then((connections)=> console.log(connections) )}>Get Connections</button>
				<button onClick={()=> rtc.updateConnectionStates()}>Update</button>

			</div>
			<Game
				aoStateProp={demoState}
				onSelectToon={(toonId) => {
					rtc.connect({id: "lRl6Ox45GxJBtaCf-E50VvcGYbTbMq3FUaZMJqUfCjpmq_7bV7fhRXZivgmomb4EIU3SFJPySVSX_oPSbjHBumx87GYu-GtG8ZmpOA_ipwtHJykl8bTTAQOtiVgoMyH5nMw4C2vTVSHWa5FvnmA8GG3pLDVqv-ruFdJW2fId2I2zjyyNzMocxb7OcCqs5kxLVdDrel1V-PlEt09ees7y8SKR0gjEDdeTyzZ8qQZS7WqrpVq0KO-zWdet5rJE6FqixoTDkzcP5d78Xd29AbUnwmt2siS2dXMF63OlO5_h_yI_ZVkU0YcbbZABsll9RcCTzlid4eh1LUPBWxW171fiZyM3zNDinJ6GsVrJ8ZMSzvQOluXFyGhwnCBpghCGJ2iUKEmRarDUMKAGFICj10nvbo6hvZeb8t8w2jlxuyIV50j-48ECKOmLSj0NwGRGih93Iave0tzB3JWyOVfvOJ4WYkjRaCoQMgLUqEgNGWmjot-Ki9UGqwqkygujH7TLfCT64P3QEWUdXdEc9h3vTy97lCmr0Cea_BzWwQXeZOE9Ul00xYfEk1OETjIrQoD9bDaWC0S5JMpC7-hzlKFaBbGSRGR0a6mJ7F7EP61K9nL1U3EMbzRC1L-VtFmOY-Ytlatr49zH3Wz4OcCYik2ld4ootGTXWA0s_kmJwZK1Z2ynHYs"})
					.then((connectedClient)=> connectedClient.getMediaStream({id: "lRl6Ox45GxJBtaCf-E50VvcGYbTbMq3FUaZMJqUfCjpmq_7bV7fhRXZivgmomb4EIU3SFJPySVSX_oPSbjHBumx87GYu-GtG8ZmpOA_ipwtHJykl8bTTAQOtiVgoMyH5nMw4C2vTVSHWa5FvnmA8GG3pLDVqv-ruFdJW2fId2I2zjyyNzMocxb7OcCqs5kxLVdDrel1V-PlEt09ees7y8SKR0gjEDdeTyzZ8qQZS7WqrpVq0KO-zWdet5rJE6FqixoTDkzcP5d78Xd29AbUnwmt2siS2dXMF63OlO5_h_yI_ZVkU0YcbbZABsll9RcCTzlid4eh1LUPBWxW171fiZyM3zNDinJ6GsVrJ8ZMSzvQOluXFyGhwnCBpghCGJ2iUKEmRarDUMKAGFICj10nvbo6hvZeb8t8w2jlxuyIV50j-48ECKOmLSj0NwGRGih93Iave0tzB3JWyOVfvOJ4WYkjRaCoQMgLUqEgNGWmjot-Ki9UGqwqkygujH7TLfCT64P3QEWUdXdEc9h3vTy97lCmr0Cea_BzWwQXeZOE9Ul00xYfEk1OETjIrQoD9bDaWC0S5JMpC7-hzlKFaBbGSRGR0a6mJ7F7EP61K9nL1U3EMbzRC1L-VtFmOY-Ytlatr49zH3Wz4OcCYik2ld4ootGTXWA0s_kmJwZK1Z2ynHYs"}).then((stream)=>{setMediaStream(stream)}));
				}}
				onViewFeed={() => {
					alert("onViewFeed");
				}}
				onSavePosition={async (position) => {
					await new Promise((resolve) => setTimeout(resolve, 2000));
					return confirm(`onSavePosition: ${JSON.stringify(position)}`);
				}}
			/>
		</div>
	);
};