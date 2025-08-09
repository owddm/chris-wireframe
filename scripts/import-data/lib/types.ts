/*
  "groups": {
    "15632202": {
      "city": "Osaka",
      "country": "jp",
      "description": "Hello 👋\n\nthe web is fascinating and while the web community in Osaka is sparkling, we do feel that there is little opportunity to exchange in english - the language of the web(?). In our meetups we often have presentations by our members on topic which are of their interest:\n\nWordpress Plugin? *Cool thing.* Secret for AWS! *Certainly.* Usability of japanese websites? *Yes, please.* Typography for Accessibility? *Nice.* Latest GraphQL framework? *Definitely.*\n\nWe want to organize events with presentations and we welcome anyone to join and present their projects, ideas or new things they learned at the meetup. This meetup could be your opportunity to practice your presentation skills and/or find like-minded friends to exchange about life as web *(semi-?)* 😉 professional.\n\nRecently, more and more members from Kyoto have a hard time joining us, which is why we recently set up the [KWDDM](https://www.meetup.com/kyoto-web-developers-and-designers-meetup) which, same like this here, is organized by volunteers. Any money we collect is just to cover our costs.",
      "events": [
        {
          "description": "We arrange our first get together and make it fun.",
          "duration": 7200000,
          "feeSettings": null,
          "id": "194472502",
          "image": {
            "file": "images/events/5/1/1/506739.webp",
            "res": [[1600, 900], [720, 405], [356, 200]],
            "corners": ["122b45", "0e182a", "2f3022", "112a44"]
          },
          "maxTickets": 0,
          "numberOfAllowedGuests": 2,
          "time": 1406364300000,
          "title": "Let's Meet Soon ... ",
          "topics": [],
          "venue": "21427172"
        },
*/

export type Event = {
  description: string;
  duration: number;
  feeSettings: null;
  id: string;
  image?: {
    location: string; // Path to the image file (changed from 'file' to match remote schema)
    date?: number; // Timestamp when image was added
  };
  maxTickets: number;
  numberOfAllowedGuests: number;
  time: number;
  title: string;
  topics: string[];
  venue: string;
  howToFindUs?: string;
};

export type EventJSON = {
  groups: {
    [key: string]: {
      city: string;
      country: string;
      description: string;
      events: Event[];
    };
  };
};

/*
  "groups": [
    {
      "content": "Let's Meet Soon ... ",
      "event": "194472502",
      "photos": [
        {
          "file": "images/events/3/9/1/059082.webp",
          "caption": "Dave and His notes :). ",
          "res": [[1200, 1600], [540, 720], [150, 200]],
          "corners": ["9b7458", "63371a", "040508", "5b1310"]
        },
        {
          "file": "images/events/3/9/1/059762.webp",
          "caption": "The Host's Bear Designed Cappuccino ",
          "res": [[1200, 1600], [540, 720], [150, 200]],
          "corners": ["7a5038", "8c6544", "6f4120", "746a69"]
        }
      ],
      "timestamp": 1406364300000
    },
*/

export type Photo = {
  location: string; // Changed from 'file' to 'location'
  caption?: string;
  date?: number;
  res?: [number, number][];
  corners?: string[];
  removed?: boolean;
};

export type PhotoJSON = {
  groups: {
    [key: string]: {
      content: string;
      event?: string;
      photos: Photo[];
      timestamp: number;
    };
  };
};

/*
  "venues": [
    {
      "address": "3 Chome-6-3 Awajimachi Chūō-ku",
      "city": "Osaka",
      "country": "jp",
      "crossStreet": null,
      "gmaps": "https://maps.app.goo.gl/t6MWWptqjio2EyHU8",
      "id": "21427172",
      "lat": 34.6866328,
      "lng": 135.4986822,
      "name": "Caffe Pascucci",
      "postalCode": "541-0047",
      "state": ""
    },
*/

export type Venue = {
  address: string;
  city: string;
  country: string;
  crossStreet: string | null;
  gmaps?: string;
  id: string;
  lat: number;
  lng: number;
  name: string;
  postalCode: string;
  state: string;
};

export type VenueJSON = {
  venues: Venue[];
};

// Combined type for the events.json that includes both groups and venues
export type EventsWithVenuesJSON = EventJSON & VenueJSON;
