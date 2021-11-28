import { Mission } from "@core/models";
import { IPosition } from "@core/models/sub-interfaces/iposition.interface";
import { Immutable } from "@fretve/global-types";

export function _getClosestMission(
    position: Immutable<IPosition>,
    missions: Immutable<Mission[]>
): {mission: Immutable<Mission>, distanceInMeters: number } {
    let closestMission: Immutable<Mission>;
    let closestDistance: number | undefined;
    for(const mission of missions){
        const pos = mission.position;
        if(pos == null) continue;
        // const val = Math.pow(position.latitude - pos.latitude, 2) + Math.pow(position.longitude - pos.latitude, 2);
        const distance  = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(position.latitude, position.longitude),
            new google.maps.LatLng(pos.latitude, pos.longitude)
        )
        if(closestDistance === undefined || distance < closestDistance){ 
            closestDistance = distance;
            closestMission = mission;
        };
    };
    return {mission: closestMission!, distanceInMeters: closestDistance!}

}