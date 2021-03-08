# Google Sheets Tax Functions

Functions for Google Sheets to calculate income tax and short/long term capital gains tax.

US Federal tax only.

Supports 2020 and 2021 tax years, all filing statuses.

# Usage

Calculate federal income tax for 2021 on $50,000 of income if you are Married Filing Jointly:

```
=INCOMETAX(50000, "MFJ", 2021)
```

Calculate federal short term capital gains tax for 2021 on $40,000 of capital gains if you had $50,000 of regular income
and are Married Filing Jointly:

```
=STCGTAX(50000, 40000, "MFJ", 2021)
```

Calculate federal long term capital gains for 2021 tax on $40,000 of capital gains if you had $50,000 of regular income
and are Married Filing Jointly:

```
=LTCGTAX(50000, 40000, "MFJ", 2021)
```

# Installation

1. Make a Google sheet.
2. Choose **Tools: Script Editor** from the menu.
3. Remove the contents of the file (the function called `myFunction`).
4. Paste the contents of `tax_functions.js` into the file.
5. Click the 'Save project" button in the toolbar at the top. <img width="102" alt="Screen Shot 2021-03-03 at 9 39 20 PM" src="https://user-images.githubusercontent.com/16927/109916905-479fd700-7c69-11eb-831b-b22d72b1b974.png">
6. Now they're available for use in the sheet.

# Testing

To run tests:

1. In the Script Editor, select the `TEST_ALL` function to run. ![image](https://user-images.githubusercontent.com/16927/110349885-051f2700-7fe8-11eb-983b-8967e729e048.png)
2. Click the Run button.
