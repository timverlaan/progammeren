import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt 
from scipy import stats
import seaborn as sns
import pprint as pp
import json

def set_up():
    
    csv_file = "input.csv"
        
    # strip the white spaces from the region column
    with open(csv_file) as f:
        reader = csv.reader(f, delimiter=",")
        with open("stripped.csv", "w") as fo:
            writer = csv.writer(fo)
            for row in reader:
                writer.writerow([e.strip() for e in row])

    # list with stand-ins for empty cells
    missing_values = ["n/a", "na", "unknown", "-", ""]

    # set missing values to NaN
    df = pd.read_csv("stripped.csv", na_values = missing_values, skipinitialspace = True)

    # drop columns we won't be using
    df = df.drop(columns=['Population', 'Area (sq. mi.)', 'Coastline (coast/area ratio)', 'Net migration', 
                            'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)', 'Other (%)', 
                            'Climate', 'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'])


    # strip the string 'dollar' and set remaining value to floats
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.lstrip('+-').str.rstrip('dollars').astype(float)

    # make commas into dots
    df['Infant mortality (per 1000 births)'] = df['Infant mortality (per 1000 births)'].str.replace(',', '.')
    df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)'].str.replace(',', '.')

    # make strings into numerics
    df['Infant mortality (per 1000 births)'] = pd.to_numeric(df['Infant mortality (per 1000 births)'], errors='coerce')
    df['Pop. Density (per sq. mi.)'] = pd.to_numeric(df['Pop. Density (per sq. mi.)'], errors='coerce')

    # unify the region column
    df.loc[df['Region'].str.contains('NEAR EAST'), 'Region'] = 'ASIA (EX. NEAR EAST)'

    # remove the outliners
    df = df[df['GDP ($ per capita) dollars'] < (3*df['GDP ($ per capita) dollars'].std())]

    print(df)

    return(df)


def central_tendency(df):

    # make boxplots to see if there are outliners
    # sns.boxplot(x=df['GDP ($ per capita) dollars'])

    std_dev = df['GDP ($ per capita) dollars'].std()
    mode = df['GDP ($ per capita) dollars'].mode()
    mean = df['GDP ($ per capita) dollars'].mean()
    median = df['GDP ($ per capita) dollars'].median()

    print(f'standard deviation = {std_dev} \n mode = {mode} \n mean = {mean} \n median = {median}')


   # plot the GDP graph with correct graph info
    df['GDP ($ per capita) dollars'].hist()
    plt.ylabel('Countries')
    plt.xlabel('GDP')
    plt.suptitle('GDP around the Globe')
    plt.show()

def five_num_sum (df):

    # check if the descriptives match
    # print(df.describe())

    # make boxplots to see if there are outliners
    sns.boxplot(x=df['Infant mortality (per 1000 births)'])
    
    # calc the min, first quant, median, third quant, max
    infant_minimum = df['Infant mortality (per 1000 births)'].min()
    infant_25 = df['Infant mortality (per 1000 births)'].quantile(0.25)
    infant_median = df['Infant mortality (per 1000 births)'].median()
    infant_75 = df['Infant mortality (per 1000 births)'].quantile(0.75)
    infant_maximum = df['Infant mortality (per 1000 births)'].max()
    
    # print the descriptives
    print(f' minimum = {infant_minimum}\n first quantile = {infant_25}\n median = {infant_median}\n third quantile = {infant_75}\n maximum = {infant_maximum} \n ')

def converting(df):

    df_dict = df.set_index('Country').T.to_dict('dict')

    with open('result.json', 'w') as fp:
        json.dump(df_dict, fp)

    pp.pprint(df_dict)


if __name__ == "__main__":

    df  = set_up()
    
    central_tendency(df)

    five_num_sum(df)

    converting(df)


