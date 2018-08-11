import { fetchZipCodes } from '../utils/ZipCodeService';
import * as types from '../constants/index'
// ACTION GENERATORS

const fetchZipCodesAction = () => ({
    type: types.FETCH_ZIPCODES,
    payload: fetchZipCodes()
});


// EXPORT ACTIONS
export { fetchZipCodesAction as fetchZipCodes };