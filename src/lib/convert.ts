import { unit } from 'mathjs';
import type { Unit } from 'mathjs';
import { unitTypeMap, type WmoUnitType } from './api/units';
import type { UnitOfMeasure } from './api/models';

const feetInMile = 5280;

export type UnitSystem = 'metric' | 'imperial';

export type UnitType = {
	type: 'unit';
	unit: Unit;
};

export type DisplayableUnitType = {
	type: 'displayable';
	unit: DisplayableUnit;
};

export type ConvertableUnit = UnitType | DisplayableUnitType;

const wmoTypeToMathJs = {
	Cel: 'degC'
} as Record<WmoUnitType, string>;

export function convertToUnit(value: number, uom?: UnitOfMeasure): ConvertableUnit {
	if (!uom) {
		return {
			type: 'displayable',
			unit: {
				notation: 'unknown',
				value: value
			}
		};
	}

	if (uom.unitType == 'percent') {
		return {
			type: 'displayable',
			unit: {
				notation: '%',
				value: value
			}
		};
	}

	try {
		const mappedType = wmoTypeToMathJs[uom.unitType];
		if (mappedType) {
			return {
				type: 'unit',
				unit: unit(value, mappedType)
			};
		}

		const unitDef = unitTypeMap[uom.unitType];
		return {
			type: 'unit',
			unit: unit(value, unitDef.notation)
		};
	} catch (e) {
		return {
			type: 'displayable',
			unit: {
				notation: uom.unitType,
				value: value
			}
		};
	}
}

export interface DisplayableUnit {
	value: number;
	notation: string;
}

const imperialMap = {
	'km/h': 'mi/h',
	'm/s': 'ft/s',
	m: 'ft',
	mm: 'in',
	cm: 'in',
	degC: 'degF',
	// TODO: inches of mercury
	Pa: 'bar',
	kPa: 'bar',
	hPa: 'bar',
	dPa: 'bar'
} as Record<string, string>;

export function displayUnit(convertible: ConvertableUnit, system: UnitSystem): DisplayableUnit {
	if (convertible.type == 'displayable') {
		return convertible.unit;
	}

	const u = convertible.unit;

	const unitType = u.formatUnits().replaceAll(' ', '');

	if (system == 'imperial') {
		const mapping = imperialMap[unitType];
		if (!mapping) {
			return {
				value: u.toNumber(),
				notation: u.formatUnits()
			};
		}

		return {
			value: u.toNumber(mapping),
			notation: mapping
		};
	}

	return {
		value: u.toNumber(),
		notation: u.formatUnits()
	};
}

export function formatFloat(n: number, decimals: number): string {
	const fact = Math.pow(10, decimals);
	const rounded = Math.round(n * fact) / fact;
	const noDec = Math.round(rounded);
	return (noDec == rounded ? noDec : rounded).toString();
}
