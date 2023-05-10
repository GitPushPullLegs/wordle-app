# Wordle Clone

This is a clone of the popular wordle game using React and Flask.

## Installation

1. Clone the repo
2. Create a .env file and set the following variables:
   - GOOGLE_APPLICATION_CREDENTIALS
   - GCP_PROJECT
3. In one terminal window:
    - `cd client`
    - `npm install` to install all npm dependencies.
    - `npm run start` to start the React frontend.
4. In another terminal window:
   - `pip install -r requirements.txt` to install all requirements.
   - `python server/main.py` to start the flask backend.

## Usage

Go to [http://localhost:3000/](http://localhost:3000/) and login with your Google account then start playing!

## Features

* Play wordle with your physical keyboard or the on-screen keyboard.
* See how many games you've played, how often you win, your current streak and your longest streak!