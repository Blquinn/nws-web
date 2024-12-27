// @JsonSerializable(converters: [CoordinateJsonConverter()])
export class Coordinate {
	lat: number;
	lon: number;

	constructor(lat: number, lon: number) {
		this.lat = lat;
		this.lon = lon;
	}

	haversineDistanceTo(point: Coordinate): number {
		return haversineDistance(this, point);
	}
}

/* Taken from http://www.movable-type.co.uk/scripts/latlong.html */
export function haversineDistance(first: Coordinate, second: Coordinate): number {
	const R = 6371e3; // metres
	const φ1 = (first.lat * Math.PI) / 180; // φ, λ in radians
	const φ2 = (second.lat * Math.PI) / 180;
	const Δφ = ((second.lat - first.lat) * Math.PI) / 180;
	const Δλ = ((second.lon - first.lon) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // in metres
}
