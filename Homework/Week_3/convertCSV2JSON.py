#!/usr/bin/env python

"""Universal CSV to JSON converter with scalability options"""

__author__      = "Tim Verlaan 11669128"

import csv  
import json  
  
def convert():
    """Convert CSV file to JSON file"""

    # Open the CSV  
    f = open( 'data_april1.csv')  

    # Change each fieldname to the appropriate field name. I know, so difficult.  
    reader = csv.DictReader( f, fieldnames = ( "STN","YYYYMMDD","SP","UX" ))  

    # skip the header 
    next(reader)

    # Parse the CSV into JSON  
    out = json.dumps( [ row for row in reader ] )  
 
    # Save the JSON  
    f = open( 'data_april.json', 'w')  
    f.write(out)  


if __name__ == "__main__":
    """Separating the function, for scalability purposes"""
    
    convert()

