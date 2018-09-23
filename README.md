# Carnegie Cupid

1st place GSK category - HackCMU 2018

More information available at [Devpost](https://devpost.com/software/carnegie-cupid)

## Installation

```shell
$ git clone https://github.com/lydiaxing/date-app.git
$ cd date-app
$ npm install
$ npm run
```

Created at Carnegie Mellon University during HackCMU.

## Inspiration
Dating is hard. You've probably at least heard stories of awkward mix-ups or other embarrassing situations on dates. Through all the confusing signs, how do you make sure that your date is really into you?

## What it does
Carnegie Cupid uses the power of machine learning and computer vision to take all the ambiguity away. It uses real-time voice-to-text transcription and sentiment analysis to measure how positive the conversation is. Using computer vision and machine learning on frames from your webcam feed, Carnegie Cupid recognizes whether or not your date is interested in you. These metrics help you steer the conversation and ensure that you and your date have a good time!

## How we built it
We decided that in order to make our work accessible to the most people possible, we would build our application using browser-based technologies. This means anyone with a phone, computer, or any internet-connected device can get dating help immediately. 

Our project consists of three main components: a browser-based client, a node.js server, and calls to external APIs. As we do both speech analysis and facial analysis, we used Microsoft CustomVision to analyze faces to see if they matched an “interested” pattern. We also used both native WebKit voice recognition and Microsoft Azure to analyze voice sentiments. Each client takes in data and sends it to the external services for analysis. The central node.js server keeps each client in sync with the other. If both the clients show the same signals - that is, both clients are “interested” in each other, then an alert sounds. 

## Challenges we ran into
A lot of the technologies we used in this project were very cutting-edge, and documentation was often sparse. We had to frequently experiment, and at times reverse-engineer, some of the technologies. Finally, as our code had to be designed around multiple asynchronous APIs, we had to work hard to avoid the possibility of our code turning into “callback hell.”

## Accomplishments that we're proud of
We are very proud of how we made our application very easy to use and accessible. Although browser-based technologies are generally less powerful than their desktop counterparts, we willingly took on this limitation in order to have the possibility of reaching the most users possible. Using responsive design, our web app adapts to screen sizes and ratios of any kind. We also used the popular MVVM design pattern for our single page application. 


## What we learned
We learned a lot about the capabilities and limitations of artificial intelligence. In addition, we focused on ensuring that our all of our individual components and features meshed well with each other. We also learned a lot about how to organize our code in a way which makes it possible to efficiently collaborate with multiple people, without stepping on each others’ toes and getting into merge conflicts.

## What's next for Carnegie Cupid
Carnegie Cupid helps you on the date, but you need to have a date in the first place. The next step is helping you get dates! 

