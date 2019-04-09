#!/usr/bin/env python
# Name: Tim Verlaan 
# Student number: 11669128
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    title = dom.find_all("h3", {"class": "lister-item-header"})
    rating = dom.find_all("div", {"class": "inline-block ratings-imdb-rating"})
    year_of_release = dom.find_all("span", {"class": "lister-item-year text-muted unbold"})
    stars = dom.find_all( "p", {"class": ""})
    runtime = dom.find_all("span", {"class": "runtime"})

    titles = []
    ratings = []
    years = []
    star_names = []
    runtimes = []

    
    for item in title:
        title_name = item.find("a").text
        titles.append(title_name)
        # print(title_name)
        
    
    for item in rating:
        if item.text is not None:
            score = item.text[2:5]
            ratings.append(score)
        # print(item.text) 
        
    for item in year_of_release:
        if len(item.text) == 11:
            year = item.text[6:10]
        elif len(item.text) == 10:
            year = item.text[5:9]
        else:
            year = item.text[1:5]
        years.append(year)

        # print(item.text)

    for item in stars:
        stars_film = ""
        for star in item.find_all("a", href=lambda href: href and "li_st" in href):
            star_name = star.text
            stars_film += star_name + "; "
        if stars_film:
            stars_film = stars_film.rstrip('; ')
            star_names.append(stars_film)
    

        # try:
        #     print(star_name)    
        # except:
        #     pass

    for item in runtime:
        time = item.text[:3]
        runtimes.append(time)
        # print(time)

    # print(titles)
    # print(ratings)
    # print(years)
    # print(star_names)
    # print(runtimes)
    # del star_names[0:2]
    # print(star_names)

    rows = zip(titles, ratings, years, star_names, runtimes)

    result = list(rows)
    # print(result)

    return [result]   # REPLACE THIS LINE AS WELL IF APPROPRIATE


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    
    for line in movies:
        for lin in line:
            for li in lin:
                print (li)
                # pass
            writer.writerow(lin)


    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)