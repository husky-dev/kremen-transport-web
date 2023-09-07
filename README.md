# #Kremen.Transport - Web

Map of public transport in Kremenchuk City, Ukraine.

- **GitHub:** [Web](https://github.com/husky-dev/kremen-transport-web), [Mobile](https://github.com/husky-dev/kremen-transport-mobile), [API](https://github.com/husky-dev/kremen-api)
- **Apps:** [Web](https://transport.kremen.dev), [App Store](https://apps.apple.com/ua/app/kremenchuk-public-transport/id1600469756), [Google Play](https://play.google.com/store/apps/details?id=com.krementransport)

An application for tracking buses, trolleybuses, and minibuses in Kremenchuk, Ukraine is available. You can use it to find out the arrival time of the transport at the bus stop and view only the required routes on the map.

![kremen-transport-web.jpeg](docs/kremen-transport-web.jpeg)

The project started as a pet-project that I used to test new technologies, libraries, and architectural solutions. Over time, it gained a user base and began to be used on the official website of the [Kremenchuk City Council](https://kremen.gov.ua/).

As practice has shown, the main use case arises when a user arrives at a bus stop and wants to know how long they will have to wait for the desired transport to arrive. To make this case as efficient as possible, I have optimized both the interface and the API. Upon launching the app, it immediately displays the user's current location, nearest stops, and available buses. The app then sends requests to the API, fetching the current positions of transport only for the routes selected by the user, resulting in a minimal data package sent by the back-end. Subsequently, a connection is established with the back-end using web sockets, enabling the user to receive real-time data from the server.

![kremen-transport-mobile.png](docs/kremen-transport-mobile.png)

At the back-end, Redis is utilized for caching and Pub/Sub tasks, while transport movement logs are stored in MongoDB.

![kremen-transport-architecture.png](docs/kremen-transport-architecture.png)

All user data and settings are stored locally, either in a browser or on a smartphone. The platform does not collect data specific to any individual. It only collects analytics related to the use of its features, without any reference to the individual user.

Technologies used:

- **Web:** React, TypeScript, ESBuild.
- **Mobile:** React Native, TypeScript.
- **API:** NodeJS, TypeScript, Docker, Docker Compose, Redis, MongoDB.

## Contacts

Jaroslav Khorishchenko

[hello@husky-dev.me](mailto:hello@husky-dev.me)
