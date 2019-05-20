import pandas as pd
import pprint as pp
import json

# list with stand-ins for empty cells
missing_values = ["n/a", "na", "unknown", "-", ""]

# set missing values to NaN
df = pd.read_csv("data_journalists.csv", na_values = missing_values, skipinitialspace = True, error_bad_lines=False)

# columns
columns_keep = ['year', 'fullName', 'gender', 'typeOfDeath', 'employedAs', 'organizations', 'jobs', 'coverage', 'mediums', 'country', 'photoUrl']

small_df = df[columns_keep]

country_series = small_df.groupby('country').apply(lambda r : r.drop(['country'], axis=1).to_json())

fullDict = {}

for ind, a in country_series.iteritems():
    b = json.loads(a)
    c = b['fullName']
    smallDict = {}
    for index, journalist in c.items():
        smallDict[journalist] = {}
        for i in b.keys():
            smallDict[journalist][i] = b[i][index]
    fullDict[ind] = (smallDict)

with open('result2.json', 'w') as f:
    json.dump(fullDict, f)