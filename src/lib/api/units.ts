// Represents all of the units available from world meterological organization.
// https://codes.wmo.int/common/unit

import unitJson from './wmo-units.json';

export interface WmoUnitDef {
	name: string;
	id: string;
	notation: string;
	altLabel: string;
}

export type WmoUnitType =
	| "'"
	| "''"
	| '(Y)_pref'
	| '(Z)_pref'
	| '(y)_pref'
	| '(z)_pref'
	| '0.001'
	| '1'
	| 'A'
	| 'AU'
	| 'Bq'
	| 'Bq_l-1'
	| 'Bq_m-2'
	| 'Bq_m-3'
	| 'Bq_s_m-3'
	| 'C'
	| 'C_-1'
	| 'C_m-1'
	| 'Cel'
	| 'DU'
	| 'E_pref'
	| 'F'
	| 'G_pref'
	| 'Gy'
	| 'H'
	| 'Hz'
	| 'J'
	| 'J_kg-1'
	| 'J_m-2'
	| 'K'
	| 'K_m-1'
	| 'K_m2_kg-1_s-1'
	| 'K_m_s-1'
	| 'M_pref'
	| 'N'
	| 'N_m-2'
	| 'N_units'
	| 'Ohm'
	| 'P_pref'
	| 'Pa'
	| 'Pa_s-1'
	| 'S'
	| 'S_m-1'
	| 'Sv'
	| 'T'
	| 'T_pref'
	| 'V'
	| 'W'
	| 'W_m-1_sr-1'
	| 'W_m-2'
	| 'W_m-2_sr-1'
	| 'W_m-2_sr-1_cm'
	| 'W_m-2_sr-1_m'
	| 'W_m-3_sr-1'
	| 'Wb'
	| 'a'
	| 'a_pref'
	| 'c_pref'
	| 'cb_-1'
	| 'cb_s-1'
	| 'cd'
	| 'cm'
	| 'cm_h-1'
	| 'cm_s-1'
	| 'd'
	| 'dB'
	| 'dB_deg-1'
	| 'dB_m-1'
	| 'dPa_s-1'
	| 'd_pref'
	| 'daPa'
	| 'da_pref'
	| 'deg2'
	| 'degC'
	| 'deg_s-1'
	| 'degree_(angle)'
	| 'degrees_true'
	| 'dm'
	| 'eV'
	| 'f_pref'
	| 'ft'
	| 'g'
	| 'g_kg-1'
	| 'g_kg-1_s-1'
	| 'gpm'
	| 'h'
	| 'hPa'
	| 'hPa_-1'
	| 'hPa_h-1'
	| 'hPa_s-1'
	| 'h_pref'
	| 'ha'
	| 'kPa'
	| 'k_pref'
	| 'kg'
	| 'kg-2_s-1'
	| 'kg_kg-1'
	| 'kg_kg-1_s-1'
	| 'kg_m-1'
	| 'kg_m-2'
	| 'kg_m-2_s-1'
	| 'kg_m-3'
	| 'km'
	| 'km_d-1'
	| 'km_h-1'
	| 'kt'
	| 'kt_km-1'
	| 'l'
	| 'lm'
	| 'log_(m-1)'
	| 'log_(m-2)'
	| 'lx'
	| 'm'
	| 'm-1'
	| 'm2'
	| 'm2_-1'
	| 'm2_Hz-1'
	| 'm2_rad-1_s'
	| 'm2_s'
	| 'm2_s-1'
	| 'm2_s-2'
	| 'm3'
	| 'm3_m-3'
	| 'm3_s-1'
	| 'm4'
	| 'mSv'
	| 'm_pref'
	| 'm_s-1'
	| 'm_s-1_km-1'
	| 'm_s-1_m-1'
	| 'm_s-2'
	| 'min'
	| 'mm'
	| 'mm6_m-3'
	| 'mm_h-1'
	| 'mm_s-1'
	| 'mol'
	| 'mol_mol-1'
	| 'mon'
	| 'n_pref'
	| 'nautical_mile'
	| 'nbar'
	| 'okta'
	| 'pH_unit'
	| 'p_pref'
	| 'pc'
	| 'percent'
	| 'rad'
	| 'rad_m-1'
	| 's'
	| 's-1'
	| 's-2'
	| 's_m-1'
	| 'sr'
	| 't'
	| 'u'
	| 'u_pref'
	| 'week';

// Map of unit id to unit type def
export const unitTypeMap = Object.fromEntries(
	unitJson.map((unitDef) => {
		return [unitDef.id as WmoUnitType, unitDef];
	})
) as Record<WmoUnitType, WmoUnitDef>;
