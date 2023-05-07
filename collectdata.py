from bs4 import BeautifulSoup
import requests
import pymongo
from datetime import datetime
import schedule
import time

# Set up the MongoDB Atlas connection (Edit that details for you)
client = pymongo.MongoClient("mongodb+srv://root:6blVpEqG9Ke0bkwc@cluster0.7n95vwk.mongodb.net/carpriceprediction?retryWrites=true&w=majority")
db = client["carpriceprediction"]
coll = db["vehicles"]

count=0

# define the URL of the webpage you want to scrape
url = "https://ikman.lk/en/ads/sri-lanka/vans?sort=date&order=desc&buy_now=0&urgent=0&page="

# define the label names
label_names = [
    "Brand:",
    "Model:",
    "Trim / Edition:",
    "Year of Manufacture:",
    "Condition:",
    "Transmission:",
    "Body type:",
    "Fuel type:",
    "Engine capacity:",
    "Mileage:",
    "Amount"
]

# define a function to scrape and insert car details into the database
def scrape_and_insert():
    global count
    for page in range(1, 86):

        # make a request to the URL and get the HTML content
        response = requests.get(url+str(page))
        html_content = response.content

        # create a BeautifulSoup object and parse the HTML content
        soup = BeautifulSoup(html_content, "html.parser")

        # find all the anchor tags with class "card-link--3ssYv gtm-ad-item"
        anchor_tags = soup.find_all("a", class_="card-link--3ssYv gtm-ad-item")

        # loop through the anchor tags and scrape the details for each car
        for tag in anchor_tags:
            # make a request to the car's URL and get the HTML content
            response = requests.get("https://ikman.lk"+tag["href"])
            html_content = response.content

            # create a BeautifulSoup object and parse the HTML content
            soup = BeautifulSoup(html_content, "html.parser")

            # create a dictionary to store the label-value pairs
            car_details = {label: "" for label in label_names}

            # find all the label and value elements using their class names
            label_elements = soup.find_all("div", class_="word-break--2nyVq label--3oVZK")
            value_elements = soup.find_all("div", class_="word-break--2nyVq value--1lKHt")

            # iterate over the label and value elements and update the dictionary with the values
            for label_element, value_element in zip(label_elements, value_elements):
                label = label_element.text.strip()
                value = value_element.text.strip()
                if label in car_details:
                    car_details[label] = value

            # find the element containing the amount value
            amount_element = soup.find("div", class_="amount--3NTpl")

            # update the car_details dictionary with the amount value
            if amount_element:
                car_details["Amount"] = amount_element.text.strip()

            # skip the row if all cells are empty
            if all(value == "-" for value in car_details.values()):
                continue

            # replace empty values with "-"
            for label in car_details:
                if not car_details[label]:
                    car_details[label] = "-"

            # Insert the car details into the database
            coll.insert_one(car_details)

            count=count+1
            print(f"{count} car details inserted into MongoDB Atlas")

        # print the number of URLs processed after each cycle
        print(f"{len(anchor_tags)} URLs processed for page {page}")
        

# schedule the function to run every day at a specific time (Edit time you want)
schedule.every().day.at("19:17").do(scrape_and_insert)

# run the scheduler continuously
while True:
    schedule.run_pending()
    time.sleep(1)