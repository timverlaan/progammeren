import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt 
from scipy import stats
import seaborn as sns

csv_file = "input.csv"
    
# strip the white spaces from the region column
with open(csv_file) as f:
    reader = csv.reader(f, delimiter=",")
    with open("stripped.csv", "w") as fo:
        writer = csv.writer(fo)
        for row in reader:
            writer.writerow([e.strip() for e in row])

stripped_csv = "stripped.csv"

data = {}
with open(stripped_csv) as file:
    csv_reader = csv.DictReader(stripped_csv)
    for row in csv_reader:
        country = row["Country"]
        data[country] = row

print(data)


# list with stand-ins for empty cells
missing_values = ["n/a", "na", "unknown", "-", ""]

# set missing values to NaN
df_bef = pd.read_csv("stripped.csv", na_values = missing_values, skipinitialspace = True)

# drop columns we won't be using
df = df_bef.drop(columns=['Population', 'Area (sq. mi.)', 'Coastline (coast/area ratio)', 'Net migration', 
                        'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)', 'Other (%)', 
                        'Climate', 'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'])

# pd.set_option('display.max_columns', 5)
# pd.set_option("display.max_rows", 227)

# strip the string 'dollar' and set remaining value to floats
df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.lstrip('+-').str.rstrip('dollars').astype(float)

# unify the region column
df.loc[df['Region'].str.contains('NEAR EAST'), 'Region'] = 'ASIA (EX. NEAR EAST)'

print(df)

def central_tendency():

    # make boxplots to see if there are outliners
    sns.boxplot(x=df['GDP ($ per capita) dollars'])

    # z = np.abs(stats.zscore(df['GDP ($ per capita) dollars']))

    # df = df[(z < 3).drop()]


    # df['GDP ($ per capita) dollars'].plot()
    # plt.show()

def five_num_sum ():
    
    pass

def converting():

    pass


if __name__ == "__main__":
    
    central_tendency()

    # five_num_sum()

    # converting()


