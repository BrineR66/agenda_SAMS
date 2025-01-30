const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/calendarApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Modèle des événements
const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    date: Date,
    creator: String,
    image: String,
});

const Event = mongoose.model('Event', eventSchema);

// Ajouter un événement
app.post('/add-event', (req, res) => {
    const { title, description, location, date, creator, image } = req.body;

    const event = new Event({
        title,
        description,
        location,
        date: new Date(date),
        creator,
        image,
    });

    event.save()
        .then(() => res.status(200).json({ message: 'Event added successfully' }))
        .catch(err => res.status(400).json({ message: 'Error adding event' }));
});

// Obtenir tous les événements
app.get('/events', (req, res) => {
    Event.find()
        .then(events => res.json(events))
        .catch(err => res.status(400).json({ message: 'Error retrieving events' }));
});

// Supprimer un événement
app.delete('/delete-event/:id', (req, res) => {
    const eventId = req.params.id;
    Event.findByIdAndDelete(eventId)
        .then(() => res.status(200).json({ message: 'Event deleted' }))
        .catch(err => res.status(400).json({ message: 'Error deleting event' }));
});

// Lancer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});