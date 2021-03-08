const incomeTaxBrackets = {
  2020: {
    'S': [
      {threshold: 0,      rate: 0.10},
      {threshold: 9875,   rate: 0.12},
      {threshold: 40125,  rate: 0.22},
      {threshold: 85525,  rate: 0.24},
      {threshold: 163300, rate: 0.32},
      {threshold: 207350, rate: 0.35},
      {threshold: 518400, rate: 0.37},
    ],
    'MFJ': [
      {threshold: 0,      rate: 0.10},
      {threshold: 19750,  rate: 0.12},
      {threshold: 80250,  rate: 0.22},
      {threshold: 171050, rate: 0.24},
      {threshold: 326600, rate: 0.32},
      {threshold: 414700, rate: 0.35},
      {threshold: 622050, rate: 0.37},
    ],
    'MFS': [
      {threshold: 0,      rate: 0.10},
      {threshold: 9875,   rate: 0.12},
      {threshold: 40125,  rate: 0.22},
      {threshold: 85525,  rate: 0.24},
      {threshold: 163300, rate: 0.32},
      {threshold: 207350, rate: 0.35},
      {threshold: 311025, rate: 0.37},
    ],
    'HOH': [
      {threshold: 0,      rate: 0.10},
      {threshold: 14100,  rate: 0.12},
      {threshold: 53700,  rate: 0.22},
      {threshold: 85500,  rate: 0.24},
      {threshold: 163300, rate: 0.32},
      {threshold: 207350, rate: 0.35},
      {threshold: 518400, rate: 0.37},
    ],
  },
  2021: {
    'S': [
      {threshold: 0,      rate: 0.10},
      {threshold: 9950,   rate: 0.12},
      {threshold: 40525,  rate: 0.22},
      {threshold: 86375,  rate: 0.24},
      {threshold: 164925, rate: 0.32},
      {threshold: 209425, rate: 0.35},
      {threshold: 523600, rate: 0.37},
    ],
    'MFJ': [
      {threshold: 0,      rate: 0.10},
      {threshold: 19900,  rate: 0.12},
      {threshold: 81050,  rate: 0.22},
      {threshold: 172750, rate: 0.24},
      {threshold: 329850, rate: 0.32},
      {threshold: 418850, rate: 0.35},
      {threshold: 628300, rate: 0.37},
    ],
    'MFS': [
      {threshold: 0,      rate: 0.10},
      {threshold: 9950,   rate: 0.12},
      {threshold: 40525,  rate: 0.22},
      {threshold: 86375,  rate: 0.24},
      {threshold: 164925, rate: 0.32},
      {threshold: 209425, rate: 0.35},
      {threshold: 314150, rate: 0.37},
    ],
    'HOH': [
      {threshold: 0,      rate: 0.10},
      {threshold: 14200,  rate: 0.12},
      {threshold: 54200,  rate: 0.22},
      {threshold: 86350,  rate: 0.24},
      {threshold: 164900, rate: 0.32},
      {threshold: 209400, rate: 0.35},
      {threshold: 523600, rate: 0.37},
    ],
  }
};

const longTermCapGainsBrackets = {
  2020: {
    'S': [
      {threshold: 0,      rate: 0.0},
      {threshold: 40000,  rate: 0.15},
      {threshold: 441450, rate: 0.20}
    ],
    'MFJ': [
      {threshold: 0,      rate: 0.0},
      {threshold: 80000,  rate: 0.15},
      {threshold: 496600, rate: 0.20}
    ],
    'MFS': [
      {threshold: 0,      rate: 0.0},
      {threshold: 40000,  rate: 0.15},
      {threshold: 248300, rate: 0.20}
    ],
    'HOH': [
      {threshold: 0,      rate: 0.0},
      {threshold: 53600,  rate: 0.15},
      {threshold: 469050, rate: 0.20}
    ],
  },
  2021: {
    'S': [
      {threshold: 0,      rate: 0.0},
      {threshold: 40400,  rate: 0.15},
      {threshold: 445850, rate: 0.20}
    ],
    'MFJ': [
      {threshold: 0,      rate: 0.0},
      {threshold: 80800,  rate: 0.15},
      {threshold: 501600, rate: 0.20}
    ],
    'MFS': [
      {threshold: 0,      rate: 0.0},
      {threshold: 40400,  rate: 0.15},
      {threshold: 250800, rate: 0.20}
    ],
    'HOH': [
      {threshold: 0,      rate: 0.0},
      {threshold: 54100,  rate: 0.15},
      {threshold: 473750, rate: 0.20}
    ],
  }
}

// Given some income, return the income tax amount. Defaults to 2021 rates.
function INCOMETAX(income, filingStatus, year) {
  if (!incomeTaxBrackets[year]) {
    throw new Error(`${year} is not one of the supported years: ${Object.keys(incomeTaxBrackets)}`);
  }
  const brackets = incomeTaxBrackets[year][filingStatus];
  if (!brackets) {
    throw new Error(`"${filingStatus}" not one of the supported filing statuses: ${Object.keys(incomeTaxBrackets[year])}`);
  }

  let tax = 0;

  for (let i = 0; i < brackets.length; i++) {
    const rate = brackets[i].rate;
    const min  = brackets[i].threshold;
    const max  = brackets[i + 1] ? brackets[i + 1].threshold : income;

    const taxableInCurrentBracket = Math.min(income, max) - min;
    if (taxableInCurrentBracket < 0) {
      break;
    }

    tax += taxableInCurrentBracket * rate;
  }

  return tax;
}

// Given some regular income and some short term capital gains, return the the short term
// capital gains tax. Defaults to 2021 rates (same rates as income tax).
function STCGTAX(regularIncome, shortTermCapitalGains, filingStatus, year) {
  let regularTax = INCOMETAX(regularIncome, filingStatus, year);
  let totalTax = INCOMETAX(regularIncome + shortTermCapitalGains, filingStatus, year);
  return totalTax - regularTax;
}

// Given some regular income and some long term capital gains, return the long term
// capital gains tax. Defaults to 2021 rates.
function LTCGTAX(regularIncome, longTermCapitalGains, filingStatus, year) {
  if (!longTermCapGainsBrackets[year]) {
    throw new Error(`${year} is not one of the supported years: ${Object.keys(longTermCapGainsBrackets)}`);
  }
  const brackets = longTermCapGainsBrackets[year][filingStatus];
  if (!brackets) {
    throw new Error(`"${filingStatus}" not one of the supported filing statuses: ${Object.keys(incomeTaxBrackets[year])}`);
  }
  let tax = 0;
  let remainingRegularIncome = regularIncome;
  let remainingCapitalGains = longTermCapitalGains;
  for (let i = 0; i < brackets.length; i++) {
    let capitalGainsAtBracket;
    if (brackets[i + 1]) {
      const bracketSize = brackets[i + 1].threshold - brackets[i].threshold;
      const maxCapitalGainsAtBracket = Math.max(0, bracketSize - remainingRegularIncome);
      capitalGainsAtBracket = Math.min(maxCapitalGainsAtBracket, remainingCapitalGains);
      remainingRegularIncome = Math.max(0, remainingRegularIncome - bracketSize);
      remainingCapitalGains = Math.max(0, remainingCapitalGains - capitalGainsAtBracket);
    } else {
      capitalGainsAtBracket = remainingCapitalGains;
    }
    tax += capitalGainsAtBracket * brackets[i].rate;
  };
  return tax;
}

/**
 * Tests
 */
function ASSERT_(result) {
  if (!result) {
    throw new Error('Test failed');
  }
}

function ASSERT_EQUAL_(a, b) {
  const zero = 0.000001;
  if (Math.abs(a - b) > zero) {
    throw new Error(`Expected ${a} to equal ${b}`);
  }
}

function TEST_INCOMETAX() {
  // 2020 Single
  ASSERT_EQUAL_(INCOMETAX(10000, "S", 2020), 1002.50);
  ASSERT_EQUAL_(INCOMETAX(20000, "S", 2020), 2202.50);
  ASSERT_EQUAL_(INCOMETAX(50000, "S", 2020), 6790);
  ASSERT_EQUAL_(INCOMETAX(100000, "S", 2020), 18079.50);
  ASSERT_EQUAL_(INCOMETAX(150000, "S", 2020), 30079.50);
  ASSERT_EQUAL_(INCOMETAX(250000, "S", 2020), 62295);
  // For $600,000 income, NerdWallet calculator says 186517 but I think it's wrong.
  // https://www.nerdwallet.com/article/taxes/capital-gains-tax-rates
  ASSERT_EQUAL_(INCOMETAX(600000, "S", 2020), 186427);

  // 2020 Married Filing Jointly
  ASSERT_EQUAL_(INCOMETAX(10000, "MFJ", 2020), 1000);
  ASSERT_EQUAL_(INCOMETAX(20000, "MFJ", 2020), 2005);
  ASSERT_EQUAL_(INCOMETAX(50000, "MFJ", 2020), 5605);
  ASSERT_EQUAL_(INCOMETAX(100000, "MFJ", 2020), 13580);
  ASSERT_EQUAL_(INCOMETAX(150000, "MFJ", 2020), 24580);
  ASSERT_EQUAL_(INCOMETAX(250000, "MFJ", 2020), 48159);
  ASSERT_EQUAL_(INCOMETAX(600000, "MFJ", 2020), 159590);

  // 2020 Married Filing Separately
  ASSERT_EQUAL_(INCOMETAX(10000, "MFS", 2020), 1002.50);
  ASSERT_EQUAL_(INCOMETAX(20000, "MFS", 2020), 2202.50);
  ASSERT_EQUAL_(INCOMETAX(50000, "MFS", 2020), 6790);
  ASSERT_EQUAL_(INCOMETAX(100000, "MFS", 2020), 18079.50);
  ASSERT_EQUAL_(INCOMETAX(150000, "MFS", 2020), 30079.50);
  ASSERT_EQUAL_(INCOMETAX(250000, "MFS", 2020), 62295);
  ASSERT_EQUAL_(INCOMETAX(600000, "MFS", 2020), 190574.50);

  // 2020 Head of Household
  ASSERT_EQUAL_(INCOMETAX(10000, "HOH", 2020), 1000);
  ASSERT_EQUAL_(INCOMETAX(20000, "HOH", 2020), 2118);
  ASSERT_EQUAL_(INCOMETAX(50000, "HOH", 2020), 5718);
  ASSERT_EQUAL_(INCOMETAX(100000, "HOH", 2020), 16638);
  ASSERT_EQUAL_(INCOMETAX(150000, "HOH", 2020), 28638);
  ASSERT_EQUAL_(INCOMETAX(250000, "HOH", 2020), 60853.50);
  ASSERT_EQUAL_(INCOMETAX(600000, "HOH", 2020), 184985.50);

  // 2021 Single
  ASSERT_EQUAL_(INCOMETAX(10000, "S", 2021), 1001);
  ASSERT_EQUAL_(INCOMETAX(20000, "S", 2021), 2201);
  ASSERT_EQUAL_(INCOMETAX(50000, "S", 2021), 6748.50);
  ASSERT_EQUAL_(INCOMETAX(100000, "S", 2021), 18021);
  ASSERT_EQUAL_(INCOMETAX(150000, "S", 2021), 30021);
  ASSERT_EQUAL_(INCOMETAX(250000, "S", 2021), 62044.25);
  ASSERT_EQUAL_(INCOMETAX(600000, "S", 2021), 186072.25);

  // 2021 Married Filing Jointly
  ASSERT_EQUAL_(INCOMETAX(10000, "MFJ", 2021), 1000);
  ASSERT_EQUAL_(INCOMETAX(20000, "MFJ", 2021), 2002);
  ASSERT_EQUAL_(INCOMETAX(50000, "MFJ", 2021), 5602);
  ASSERT_EQUAL_(INCOMETAX(100000, "MFJ", 2021), 13497);
  ASSERT_EQUAL_(INCOMETAX(150000, "MFJ", 2021), 24497);
  ASSERT_EQUAL_(INCOMETAX(250000, "MFJ", 2021), 48042);
  ASSERT_EQUAL_(INCOMETAX(600000, "MFJ", 2021), 159088.50);

  // 2021 Married Filing Separately
  ASSERT_EQUAL_(INCOMETAX(10000, "MFS", 2021), 1001);
  ASSERT_EQUAL_(INCOMETAX(20000, "MFS", 2021), 2201);
  ASSERT_EQUAL_(INCOMETAX(50000, "MFS", 2021), 6748.50);
  ASSERT_EQUAL_(INCOMETAX(100000, "MFS", 2021), 18021);
  ASSERT_EQUAL_(INCOMETAX(150000, "MFS", 2021), 30021);
  ASSERT_EQUAL_(INCOMETAX(250000, "MFS", 2021), 62044.25);
  ASSERT_EQUAL_(INCOMETAX(600000, "MFS", 2021), 190261.25);

  // 2021 Head of Household
  ASSERT_EQUAL_(INCOMETAX(10000, "HOH", 2021), 1000);
  ASSERT_EQUAL_(INCOMETAX(20000, "HOH", 2021), 2116);
  ASSERT_EQUAL_(INCOMETAX(50000, "HOH", 2021), 5716);
  ASSERT_EQUAL_(INCOMETAX(100000, "HOH", 2021), 16569);
  ASSERT_EQUAL_(INCOMETAX(150000, "HOH", 2021), 28569);
  ASSERT_EQUAL_(INCOMETAX(250000, "HOH", 2021), 60595);
  ASSERT_EQUAL_(INCOMETAX(600000, "HOH", 2021), 184623);
}

function TEST_STCGTAX() {
  // 2020 Single
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "S", 2020), 48015.50);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "S", 2020), 17077);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "S", 2020), 13390);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "S", 2020), 67215.50);
  // Nerdwallet says the following result should be 141501.50.
  // https://www.nerdwallet.com/article/taxes/capital-gains-tax-rates
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "S", 2020), 141411.50);
  // Nerdwallet says the following result should be 186517.
  // https://www.nerdwallet.com/article/taxes/capital-gains-tax-rates
  ASSERT_EQUAL_(STCGTAX(0, 600000, "S", 2020), 186427);
  // Nerdwallet says the following result should be 186787.
  // https://www.nerdwallet.com/article/taxes/capital-gains-tax-rates
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "S", 2020), 186697);

  // 2020 Married Filing Jointly
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "MFJ", 2020), 37739);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "MFJ", 2020), 12575);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "MFJ", 2020), 9205);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "MFJ", 2020), 49451);
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "MFJ", 2020), 123431);
  ASSERT_EQUAL_(STCGTAX(0, 600000, "MFJ", 2020), 159590);
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "MFJ", 2020), 159840);

  // 2020 Married Filing Separately
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "MFS", 2020), 48015.50);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "MFS", 2020), 17077);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "MFS", 2020), 13390);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "MFS", 2020), 67995);
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "MFS", 2020), 145559);
  ASSERT_EQUAL_(STCGTAX(0, 600000, "MFS", 2020), 190574.50);
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "MFS", 2020), 190844.50);

  // 2020 Head of Household
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "HOH", 2020), 48015.50);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "HOH", 2020), 15720);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "HOH", 2020), 11948);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "HOH", 2020), 67215.50);
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "HOH", 2020), 141411.50);
  ASSERT_EQUAL_(STCGTAX(0, 600000, "HOH", 2020), 184985.50);
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "HOH", 2020), 185255.50);

  // 2021 Single
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "S", 2021), 47823.25);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "S", 2021), 17020);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "S", 2021), 13348.50);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "S", 2021), 67023.25);
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "S", 2021), 141245.25);
  ASSERT_EQUAL_(STCGTAX(0, 600000, "S", 2021), 186072.25);
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "S", 2021), 186342.25);

  // 2021 Married Filing Jointly
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "MFJ", 2021), 37705);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "MFJ", 2021), 12495);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "MFJ", 2021), 9202);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "MFJ", 2021), 49157);
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "MFJ", 2021), 123046.50);
  ASSERT_EQUAL_(STCGTAX(0, 600000, "MFJ", 2021), 159088.50);
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "MFJ", 2021), 159338.50);

  // 2021 Married Filing Separately
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "MFS", 2021), 47823.25);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "MFS", 2021), 17020);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "MFS", 2021), 13348.50);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "MFS", 2021), 67740.25);
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "MFS", 2021), 145434.25);
  ASSERT_EQUAL_(STCGTAX(0, 600000, "MFS", 2021), 190261.25);
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "MFS", 2021), 190531.25);

  // 2021 Head of Household
  ASSERT_EQUAL_(STCGTAX(90000, 164000, "HOH", 2021), 47826);
  ASSERT_EQUAL_(STCGTAX(30000, 80000, "HOH", 2021), 15653);
  ASSERT_EQUAL_(STCGTAX(0, 80000, "HOH", 2021), 11896);
  ASSERT_EQUAL_(STCGTAX(150000, 200000, "HOH", 2021), 67026);
  ASSERT_EQUAL_(STCGTAX(200000, 400000, "HOH", 2021), 141246);
  ASSERT_EQUAL_(STCGTAX(0, 600000, "HOH", 2021), 184623);
  ASSERT_EQUAL_(STCGTAX(1000, 600000, "HOH", 2021), 184893);
}

function TEST_LTCGTAX() {
  // 2020 Single
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "S", 2020), 24600);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "S", 2020), 10500);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "S", 2020), 6000);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "S", 2020), 30000);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "S", 2020), 67927.50);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "S", 2020), 91927.50);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "S", 2020), 92127.50);

  // 2020 Married Filing Jointly
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "MFJ", 2020), 24600);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "MFJ", 2020), 4500);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "MFJ", 2020), 0);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "MFJ", 2020), 30000);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "MFJ", 2020), 65170);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "MFJ", 2020), 83170);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "MFJ", 2020), 83370);

  // 2020 Married Filing Separately
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "MFS", 2020), 24885);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "MFS", 2020), 10500);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "MFS", 2020), 6000);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "MFS", 2020), 35085);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "MFS", 2020), 77585);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "MFS", 2020), 101585);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "MFS", 2020), 101785);

  // 2020 Head of Household
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "HOH", 2020), 24600);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "HOH", 2020), 8460);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "HOH", 2020), 3960);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "HOH", 2020), 30000);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "HOH", 2020), 66547.50);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "HOH", 2020), 88507.50);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "HOH", 2020), 88707.50);

  // 2021 Single
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "S", 2021), 24600);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "S", 2021), 10440);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "S", 2021), 5940);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "S", 2021), 30000);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "S", 2021), 67707.50);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "S", 2021), 91647.50);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "S", 2021), 91847.50);

  // 2021 Married Filing Jointly
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "MFJ", 2021), 24600);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "MFJ", 2021), 4380);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "MFJ", 2021), 0);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "MFJ", 2021), 30000);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "MFJ", 2021), 64920);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "MFJ", 2021), 82800);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "MFJ", 2021), 83000);

  // 2021 Married Filing Separately
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "MFS", 2021), 24760);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "MFS", 2021), 10440);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "MFS", 2021), 5940);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "MFS", 2021), 34960);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "MFS", 2021), 77460);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "MFS", 2021), 101400);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "MFS", 2021), 101600);

  // 2021 Head of Household
  ASSERT_EQUAL_(LTCGTAX(90000, 164000, "HOH", 2021), 24600);
  ASSERT_EQUAL_(LTCGTAX(30000, 80000, "HOH", 2021), 8385);
  ASSERT_EQUAL_(LTCGTAX(0, 80000, "HOH", 2021), 3885);
  ASSERT_EQUAL_(LTCGTAX(150000, 200000, "HOH", 2021), 30000);
  ASSERT_EQUAL_(LTCGTAX(200000, 400000, "HOH", 2021), 66312.50);
  ASSERT_EQUAL_(LTCGTAX(0, 600000, "HOH", 2021), 88197.50);
  ASSERT_EQUAL_(LTCGTAX(1000, 600000, "HOH", 2021), 88397.50);
}

function TEST_ALL() {
  TEST_INCOMETAX();
  TEST_STCGTAX();
  TEST_LTCGTAX();
}
