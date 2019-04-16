#!/usr/bin/env python

"""EDA.py: Exploratory Data Analysis of sample dataset"""

__author__      = "Tim Verlaan 11669128"

import csv
import math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt 
from scipy import stats
import seaborn as sns
import pprint as pp
import json

def set_up():
    """Parsing & Preprocessing"""
    
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

    # remove the outliners - considered outliner when bigger than 3 std.dev to the right of the distribution
    df = df[df['GDP ($ per capita) dollars'] < (3*df['GDP ($ per capita) dollars'].std())]

    print(df)

    return(df)


def central_tendency(df):
    """Analyzing & Presenting GDP"""

    # make boxplots to see if there are outliners
    # sns.boxplot(x=df['GDP ($ per capita) dollars'])

    # calc descriptives. Note: mode[0] makes sure it only prints the value, not the zero and the dtype
    std_dev = df['GDP ($ per capita) dollars'].std()
    mode = df['GDP ($ per capita) dollars'].mode()[0]
    mean = df['GDP ($ per capita) dollars'].mean()
    median = df['GDP ($ per capita) dollars'].median()

    print(f'\n GDP standard deviation = {std_dev} \n GDP mode = {mode} \n GDP mean = {mean} \n GDP median = {median} \n')

    # Sturge's Rule for amount of Bins in histogram source: https://www.statisticshowto.datasciencecentral.com/choose-bin-sizes-statistics/
    K = round(1 + math.log(226,2))

   # plot the GDP graph with correct graph info
    df['GDP ($ per capita) dollars'].hist(bins=K)
    plt.ylabel('Number of Countries')
    plt.xlabel('GDP ($ per capita)')
    plt.suptitle('GDP ($ per capita) around the Globe')
    plt.show()

def five_num_sum (df):
    """Analyzing & Presenting Infancy"""

    # check if the descriptives match
    # print(df.describe())

    # make boxplots to see if there are outliners and swarm plot to see distribution more clearly
    sns.boxplot(x=df['Infant mortality (per 1000 births)'])
    sns.swarmplot(x=df['Infant mortality (per 1000 births)'], color = ".01")
  
    # calc the min, first quant, median, third quant, max
    infant_minimum = df['Infant mortality (per 1000 births)'].min()
    infant_25 = df['Infant mortality (per 1000 births)'].quantile(0.25)
    infant_median = df['Infant mortality (per 1000 births)'].median()
    infant_75 = df['Infant mortality (per 1000 births)'].quantile(0.75)
    infant_maximum = df['Infant mortality (per 1000 births)'].max()

    #print the boxplot and swarmplot
    plt.show()
    
    # print the descriptives
    print(f' Infant minimum = {infant_minimum}\n Infant first quantile = {infant_25}\n Infant median = {infant_median}\n Infant third quantile = {infant_75}\n Infant maximum = {infant_maximum} \n ')

def converting(df):
    """Presenting in a JSON file"""

    # create dict with country-column as index
    df_dict = df.set_index('Country').T.to_dict('dict')

    # make json file from the dict
    with open('result.json', 'w') as fp:
        json.dump(df_dict, fp)

    # use pretty print to see if dict matches the json example in the exercise
    # pp.pprint(df_dict)


if __name__ == "__main__":
    """Separating the function and calling them orderly"""
    
    df  = set_up()
    
    central_tendency(df)

    five_num_sum(df)

    converting(df)


