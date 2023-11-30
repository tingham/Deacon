import { Archetype } from "../Model/Archetype";

// One to One Bi-Directional
// @param peerType
// @note Peers would never eager load because they are recursive by nature

export function Peer(peerType: typeof Archetype) {
    return function(target: any, property: any) {
    };
}
