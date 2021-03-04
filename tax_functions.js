
const incomeTaxBrackets = {
  'MFJ': [
    {threshold: 0,      rate: 0.10},
    {threshold: 19901,  rate: 0.12},
    {threshold: 81051,  rate: 0.22},
    {threshold: 172751, rate: 0.24},
    {threshold: 329851, rate: 0.32},
    {threshold: 418851, rate: 0.35},
    {threshold: 628301, rate: 0.37},
  ],
};

// Given some income, return the income tax amount. Based on 2021 rates.
function INCOMETAX(income, filingStatus) {
  const brackets = incomeTaxBrackets[filingStatus];
  if (!brackets) {
    throw new Error(`"${filingStatus}" not supported as a filing status`);
  }

  let tax = 0;

  for (let i = 0; i < brackets.length; i++) {
    const rate = brackets[i].rate;
    const min  = Math.max(0, brackets[i].threshold - 1);
    const max  = brackets[i + 1] ? brackets[i + 1].threshold - 1 : income;

    const taxableInCurrentBracket = Math.min(income, max) - min;
    if (taxableInCurrentBracket < 0) {
      break;
    }

    tax += taxableInCurrentBracket * rate;
  }

  return tax;
}

// Given some regular income and some short term capital gains, return the the short term
// capital gains tax. Based on 2021 rates (same rates as income tax).
function STCGTAX(regularIncome, shortTermCapitalGains, filingStatus) {
  if (filingStatus !== 'MFJ') {
    throw new Error('filingStatus currently only supports MFJ');
  }
  var regularTax = INCOMETAX(regularIncome, filingStatus);
  var totalTax = INCOMETAX(regularIncome + shortTermCapitalGains, filingStatus);
  return totalTax - regularTax;
}

// Given some regular income and some long term capital gains, return the long term
// capital gains tax. Based on 2021 rates.
function LTCGTAX(regularIncome, longTermCapitalGains, filingStatus) {
  if (filingStatus !== 'MFJ') {
    throw new Error('filingStatus currently only supports MFJ');
  }
  var taxedAt = {
    0: 0,
    15: 0,
    20: 0
  };
  taxedAt[0] = Math.min(Math.max(0, 80800 - regularIncome), longTermCapitalGains);
  longTermCapitalGains = Math.max(0, longTermCapitalGains - taxedAt[0]);
  taxedAt[15] = Math.min(Math.max(0, 501601 - regularIncome), longTermCapitalGains);
  longTermCapitalGains = Math.max(0, longTermCapitalGains - taxedAt[15]);
  taxedAt[20] = longTermCapitalGains;

  return taxedAt[15] * 0.15 + taxedAt[20] * 0.20;
}
