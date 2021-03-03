# Google Sheets Tax Functions

Functions for Google Sheets to calculate income tax and short/long term capital gains tax.

US Federal tax only.

**Currently based on 2021 tax rates for Married Filing Jointly.**

# Usage

Calculate federal income tax on $50,000 of income if you are Married Filing Jointly:

```
=INCOMETAX(50000, "MFJ")
```

Calculate federal short term capital gains tax on $40,000 of capital gains if you had $50,000 of regular income
and are Married Filing Jointly:

```
=STCGTAX(50000, 40000, "MFJ")
```

Calculate federal long term capital gains tax on $40,000 of capital gains if you had $50,000 of regular income
and are Married Filing Jointly:

```
=LTCGTAX(50000, 40000, "MFJ")
```

# Installation

1. Make a Google sheet.
2. Choose **Tools: Script Editor** from the menu.
3. Paste the contents of `tax_functions.js`. Now they're available for use in the sheet.

