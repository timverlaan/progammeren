import pandas as pd
df = pd.read_csv('dataSmall.csv')
df = df.sort_values('Value')
df = df[['LOCATION', 'TIME', 'Value']].to_json(orient='records')

f = open( 'data_oecd_small_sort.json', 'w')  
f.write(df) 
