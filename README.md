# Google Sheets Tax Functions

Functions for Google Sheets to calculate income tax and short/long term capital gains tax.

US Federal tax only.

**Currently based on 2021 tax rates.**

# Usage

Calculate federal income tax on $50,000 of income:

```
=INCOMETAX(50000)
```

Calculate federal short term capital gains tax on $40,000 of capital gains if you had $50,000 of regular income:

```
=STCGTAX(50000, 40000)
```

Calculate federal long term capital gains tax on $40,000 of capital gains if you had $50,000 of regular income:

```
=LTCGTAX(50000, 40000)
```

# Installation

1. Make a Google sheet.
2. Choose **Tools: Script Editor** from the menu.
3. Paste the contents of `tax_functions.js`. Now they're available for use in the sheet.

