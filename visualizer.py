#!/usr/bin/env python
# Name: Tim Verlaan 
# Student number: 11669128
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

def Average(lst): 
    return sum(lst) / len(lst) 

with open(INPUT_CSV, mode='r') as infile:
    reader = csv.reader(infile)
    
    with open('movies_new.csv', mode='w') as outfile:
        writer = csv.writer(outfile)
        for rows in reader:
            if not rows[2] == 'Year':
                data_dict[rows[2]].append(float(rows[1]))

averages = []
years = []

for rows in data_dict:
    averages.append(Average(data_dict[rows]))
for keys in data_dict.keys():
    years.append(int(keys))

if __name__ == "__main__":

    plt.plot(years, averages, 'k', years, averages, 'bo')
    plt.ylabel('Averages Rating')
    plt.xlabel('Year')
    plt.suptitle('Plotting IMDB highest scored 2008-2018')
    axes = plt.gca()
    axes.set_ylim([0,10])
    plt.show()