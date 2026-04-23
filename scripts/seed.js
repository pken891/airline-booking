const {MongoClient} = require('mongodb');
const uri = 'mongodb+srv://pken891:26MatBall!@airline-booking.lae1sqm.mongodb.net/airline-booking?retryWrites=true&w=majority';

//routes

const routes = [
    //sydney route w/ SyberJet
    {
        code: 'FA100',
        origin: 'Dairy Flat',
        destination: 'Sydney',
        aircraft: 'SyberJet',
        departTime: '10:00',
        arriveTime: '14:30',
        daysOfWeek: [5], //friday
        price: 499.00,
        seats: 8
    },

    {
        code: 'FA101',
        origin: 'Sydney',
        destination: 'Dairy Flat',
        aircraft: 'SyberJet',
        departTime: '10:00',
        arriveTime: '14:30',
        daysOfWeek: [0], //sunday
        price: 499.00,
        seats: 8
    },

    //rotorua shuttle, morning, cirrus jet 1
    {
        code: 'FA200',
        origin: 'Dairy Flat',
        destination: 'Rotorua',
        aircraft: 'Cirrus Jet',
        departTime: '07:00',
        arriveTime: '08:15',
        daysOfWeek: [1,2,3,4,5], //mon-fri
        price: 189.00,
        seats: 6
    },
    {
        code: 'FA201',
        origin: 'Rotorua',
        destination: 'Dairy Flat',
        aircraft: 'Cirrus Jet',
        departTime: '08:45',
        arriveTime: '10:00',
        daysOfWeek: [1,2,3,4,5], //mon-fri
        price: 189.00,
        seats: 6
    },
    //rotorua shuttle, afternoon, cirrus jet 1
    {
        code: 'FA202',
        origin: 'Dairy Flat',
        destination: 'Rotorua',
        aircraft: 'Cirrus Jet',
        departTime: '16:00',
        arriveTime: '17:15',
        daysOfWeek: [1,2,3,4,5], //mon-fri
        price: 189.00,
        seats: 6
    },
    {
        code: 'FA203',
        origin: 'Rotorua',
        destination: 'Dairy Flat',
        aircraft: 'Cirrus Jet',
        departTime: '18:00',
        arriveTime: '19:15',
        daysOfWeek: [1,2,3,4,5], //mon-fri
        price: 189.00,
        seats: 6
    },

    //great barrier island, cirrus jet 2
    {
        code: 'FA300',
        origin: 'Dairy Flat',
        destination: 'Great Barrier Island',
        aircraft: 'Cirrus Jet',
        departTime: '09:00',
        arriveTime: '09:45',
        daysOfWeek: [1,3,5], //mon,wed,fri
        price: 159.00,
        seats: 6
    },
    {
        code: 'FA301',
        origin: 'Great Barrier Island',
        destination: 'Dairy Flat',
        aircraft: 'Cirrus Jet',
        departTime: '09:00',
        arriveTime: '09:45',
        daysOfWeek: [2,4,6], //tues,wed,thurs
        price: 159.00,
        seats: 6
    },

    //chatham islands, HondaJet 1
    {
        code: 'FA400',
        origin: 'Dairy Flat',
        destination: 'Chatham Islands',
        aircraft: 'HondaJet',
        departTime: '08:00',
        arriveTime: '11:30',
        daysOfWeek: [2,5], //tues,fri
        price: 349.00,
        seats: 6
    },
    {
        code: 'FA401',
        origin: 'Chatham Islands',
        destination: 'Dairy Flat',
        aircraft: 'HondaJet',
        departTime: '08:00',
        arriveTime: '11:30',
        daysOfWeek: [3,6], //wed,sat
        price: 349.00,
        seats: 6
    },

    //lake tekapo, HondaJet 2
    {
        code: 'FA500',
        origin: 'Dairy Flat',
        destination: 'Lake Tekapo',
        aircraft: 'HondaJet',
        departTime: '09:00',
        arriveTime: '11:00',
        daysOfWeek: [1], //mon
        price: 279.00,
        seats: 6
    },
    {
        code: 'FA501',
        origin: 'Lake Tekapo',
        destination: 'Dairy Flat',
        aircraft: 'HondaJet',
        departTime: '09:00',
        arriveTime: '11:00',
        daysOfWeek: [2], //tues
        price: 279.00,
        seats: 6
    },
];

function generateFlights(routes, weeksAhead = 4) {
    const flights = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    //start at beggining of week (monday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());

    for (let week = 0; week < weeksAhead; week++) {
        for (let day = 0; day < 7; day++) {
            const currDate = new Date(startDate);
            currDate.setDate(startDate.getDate() + (week*7) + day);
            const dayOfWeek = currDate.getDay();

            for (const route of routes) {
                if (route.daysOfWeek.includes(dayOfWeek)){

                    const [departHour, departMin] = route.departTime.split(':').map(Number);
                    const [arriveHour, arriveMin] = route.departTime.split(':').map(Number);

                    const departure = new Date(currDate);
                    departure.setHours(departHour,departMin,0,0);

                    const arrival = new Date(currDate);
                    arrival.setHours(arriveHour,arriveMin,0,0);

                    //if arrival before departure, arrives next day
                    if (arrival < departure) {
                        arrival.setDate(arrival.getDate() +1);
                    }

                    const flightNum = `${route.code}-${currDate.toISOString().split('T')[0].replace(/-/g, '')}`;

                    flights.push({
                        flightNum: route.code,
                        origin: route.origin,
                        destination: route.destination,
                        aircraft: route.aircraft,
                        departureDateTime: departure,
                        arrivalDateTime: arrival,
                        price: route.price,
                        seatsTotal: route.seats,
                        seatsAvailable: route.seats
                    });
                }   
            }
        }
    }
    return flights;
}

async function seed() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('airline-booking');

        //clear existing data
        await db.collection('flights').deleteMany({});
        await db.collection('bookings').deleteMany({});
        await db.collection('routes').deleteMany({});
        console.log('Cleared existing data');

        //put in routes
        await db.collection('routes').insertMany(routes);
        console.log(`Inserted ${routes.length} routes across 4 weeks`);
        
        //put in flights
        const flights = generateFlights(routes, 4);
        await db.collection('flights').insertMany(flights);
        console.log(`Inserted ${flights.length} flights across 4 weeks`);

        //verify
        const flightCount = await db.collection('flights').countDocuments();
        const routeCount = await db.collection('routes').countDocuments();
        console.log(`\nDatabase now contains:`);
        console.log(`- ${routeCount} routes`);
        console.log(`- ${flightCount} flights`);

    } catch (e) {
        console.error(`seeding failed: `, e);
    } finally {
        await client.close();
        console.log(`\nDone!`);
    }
}

seed();