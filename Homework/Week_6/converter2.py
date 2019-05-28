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

small_df['photoUrl'] = small_df['photoUrl'].fillna('https://bit.ly/2Yxo3Jh')
small_df['coverage'] = small_df['coverage'].fillna('War')

country_series = small_df.groupby('country').apply(lambda r : r.drop(['country'], axis=1).to_json())

fullList = []

for ind, a in country_series.iteritems():
    b = json.loads(a)
    c = b['fullName']
    smallDict = {}
    smallDict['country'] = ind
    smallDict['journalists'] = []
    smallDict['pieChart'] = []
    male = 0
    female = 0 
    genderDict = {}
    genderDict['genderTotal'] = []

    for index, journalist in c.items():
        smallerDict = {}
        for i in b.keys():
            smallerDict[i] = b[i][index]
            if b[i][index] == 'Male':
                male += 1
            if b[i][index] == 'Female':
                female += 1
        smallDict['journalists'].append(smallerDict)
    smallDict['pieChart'].append({'gender': 'male', 'value': male})
    smallDict['pieChart'].append({'gender': 'female', 'value': female})


    smallDict['lengthList'] = len(smallDict['journalists'])
    fullList.append(smallDict)


with open('result1.json', 'w') as f:
    json.dump(fullList, f)

    # pp.pprint(fullList)