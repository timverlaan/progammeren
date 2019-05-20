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
small_df['coverage'] = small_df['coverage'].fillna('"War"')


# print(small_df)

small_dict = small_df.to_dict(orient='index')

# with pd.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
#     print(small_df)

# create dict with country-column as index
# df_dict = small_df.set_index('fullName').T.to_dict('dict')

# print(df_dict)

# make json file from the dict
with open('result3.json', 'w') as fp:
    json.dump(small_dict, fp)

    # use pretty print to see if dict matches the json example in the exercise
pp.pprint("result3.json")
