import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt 
from scipy import stats
import seaborn as sns



# reader = csv.DictReader(open('input.csv'))

# # skip the header row
# next(reader)

# # remove leading and trailing whitespace from all values
# reader = (dict((k, v.strip()) for k, v in row.items() if v) for row in reader)


with open("input.csv") as f:
    reader = csv.reader(f, delimiter=",")
    with open("stripped.csv", "w") as fo:
        writer = csv.writer(fo)
        for row in reader:
            writer.writerow([e.strip() for e in row])


# list with stand-ins for empty cells
missing_values = ["n/a", "na", "unknown", "-", ""]

df_bef = pd.read_csv("stripped.csv", na_values = missing_values, skipinitialspace = True)

df = df_bef.drop(columns=['Population', 'Area (sq. mi.)', 'Coastline (coast/area ratio)', 'Net migration', 
                           'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)', 'Other (%)', 
                           'Climate', 'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'])

# pd.set_option('display.max_columns', 5)
pd.set_option("display.max_rows", 227)

df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.lstrip('+-').str.rstrip('dollars').astype(float)

df.loc[df['Region'].str.contains('NEAR EAST'), 'Region'] = 'ASIA (EX. NEAR EAST)'

sns.boxplot(x=df['GDP ($ per capita) dollars'])

z = np.abs(stats.zscore(df['GDP ($ per capita) dollars']))

df = df[(z < 3).drop()]

print(df)


df['GDP ($ per capita) dollars'].plot()
plt.show()