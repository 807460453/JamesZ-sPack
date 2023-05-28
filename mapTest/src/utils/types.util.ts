import type { LatLngExpression } from "leaflet";

export interface Mark {
    id: string,
    markerLatLng: LatLngExpression,
    locationName?: string
    // data:
}