import BigNumber from 'bignumber.js';

const TEN_MINUS_EIGHTEEN = new BigNumber(10).pow(-18);

export const formatTokenWithUnit = (value, token = 'Eth') => {
  const valueBN = new BigNumber(value);
  if (valueBN.isGreaterThanOrEqualTo(100000000000000)) {
    return [weiToEth(valueBN, 4), ` ${token}`];
  } else if (valueBN.isGreaterThanOrEqualTo(1000000000)) {
    return [roundStripZeros(valueBN.times(new BigNumber(10).pow(-9))), ' gWei'];
  } else if (valueBN.isGreaterThanOrEqualTo(1000000)) {
    return [roundStripZeros(valueBN.times(new BigNumber(10).pow(-6))), ' mWei'];
  } else if (valueBN.isGreaterThanOrEqualTo(1000)) {
    return [roundStripZeros(valueBN.times(new BigNumber(10).pow(-3))), ' kWei'];
  } else if (valueBN.isGreaterThanOrEqualTo(1)) {
    return [valueBN.toString(), ' Wei'];
  } else {
    return ['0.00', ''];
  }
};

const weiToEth = (value, decimal = 10) =>
  roundStripZeros(value.times(TEN_MINUS_EIGHTEEN), decimal);

const roundStripZeros = (value, decimal = 3) =>
  parseFloat(value.toFixed(decimal)).toString();


export const remove0x = (address: string): string =>
  address.indexOf('0x') === 0 ? address.substring(2) : address