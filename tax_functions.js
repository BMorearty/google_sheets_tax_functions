// Given some income, return the income tax amount. Based on 2021 rates.
function INCOMETAX(income, filingStatus) {
  if (filingStatus !== 'MFJ') {
    throw new Error('filingStatus currently only supports MFJ');
  }
  if (income <= 19900) {
    return income * 0.10;
  }
  if (income <= 81050) {
    return 1990 + (income - 19900) * 0.12;
  }
  if (income <= 172750) {
    return 9328 + (income - 81050) * 0.22;
  }
  if (income <= 329850) {
    return 29502 + (income - 172750) * 0.24;
  }
  if (income <= 418850) {
    return 67206 + (income - 329850) * 0.32;
  }
  if (income <= 628300) {
    return 95686 + (income - 418850) * 0.35;
  }
  return 168993.50 + (income - 628300) * 0.37;
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
