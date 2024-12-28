import { unit } from 'mathjs';
import type { Unit } from 'mathjs';
import { unitTypeMap, type WmoUnitType } from './api/units';
import type { UnitOfMeasure } from './api/models';

const feetInMile = 5280;

type UnitSystem = 'metric' | 'imperial';

const wmoTypeToMathJs = {
  "Cel": "degC",
} as Record<WmoUnitType, string>;

export function convertToUnit(value: number, uom: UnitOfMeasure): Unit {
  try {
    const mappedType = wmoTypeToMathJs[uom.unitType];
    if (mappedType) {
      return unit(value, mappedType);
    }

    const unitDef = unitTypeMap[uom.unitType]
    return unit(value, unitDef.notation);
  } catch (e) {
    return unit(value, 'unknown');
  }
}

export interface DisplayableUnit {
  value: number
  notation: string
}


const imperialMap = {
  "km/h": "mi/h",
  "m/s": "ft/s",
  "m": "ft",
  "mm": "in",
  "cm": "in",
  "degC": "degF",
  // TODO: inches of mercury
  "Pa": "bar",
  "kPa": "bar",
  "hPa": "bar",
  "dPa": "bar",
} as Record<string, string>

export function displayUnit(u: Unit, system: UnitSystem): DisplayableUnit {

  const unitType = u.formatUnits().replaceAll(" ", "");

  if (system == "imperial") {
    const mapping = imperialMap[unitType];
    if (!mapping) {
      return {
        value: u.toNumber(),
        notation: u.formatUnits(),
      }
    }

    return {
      value: u.toNumber(mapping),
      notation: mapping,
    }
  }

  return {
    value: u.toNumber(),
    notation: u.formatUnits(),
  }
}
