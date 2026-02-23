





























































































































































































































































































































































































































































































































































export const eventsData = {
    Dance: [
        {
            id: 'dance-solo',
            title: 'Solotaire',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹100',
            date: 'February 18',
            duration: '10:00am-10:30am',
            description: 'Showcase your individual rhythm and grace.',
            capacity: 20,
            currentRegistrations: 0,
        },
        {
            id: 'dance-group',
            title: 'Insync',
            teamSize: '4-12',
            minSize: 4,
            maxSize: 12,
            prize: 'Depends on registration',
            entryFee: '₹50 per person',
            date: 'February 18',
            duration: '11:00am-11:30am',
            description: 'Synchronize and mesmerize with your crew.',
            capacity: 10,
            currentRegistrations: 0,
        },
        {
            id: 'dance-faceoff',
            title: 'Face off (Classical vs Modern)',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹100',
            date: 'February 19',
            duration: '10:55am-11:30am',
            description: 'A battle of styles where tradition meets contemporary.',
            capacity: 20,
            currentRegistrations: 0,
        }
    ],
    Music: [
        {
            id: 'music-solo-male',
            title: 'Rhythm Rave (Male)',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹100',
            date: 'February 18',
            duration: '2:00pm-2:30pm',
            description: 'Voice of the soul (Male category).',
            capacity: 15,
            currentRegistrations: 0,
        },
        {
            id: 'music-solo-female',
            title: 'Swaragini (Female)',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹100',
            date: 'February 18',
            duration: '10:30am-11:00am',
            description: 'Voice of the soul (Female category).',
            capacity: 15,
            currentRegistrations: 0,
        },
        {
            id: 'music-duet',
            title: 'Crooner (Duet)',
            teamSize: '2',
            minSize: 2,
            maxSize: 2,
            prize: 'Depends on registration',
            entryFee: '₹150',
            date: 'February 19',
            duration: '10:00am-10:30am',
            description: 'Perfect harmony in pairs.',
            capacity: 5,
            currentRegistrations: 0,
        }
    ],
    Drama: [
        {
            id: 'drama-mono',
            title: 'Alone Spot Light',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹100',
            date: 'February 18',
            duration: '2:30pm-3:00pm',
            description: 'A solo theatrical performance.',
            capacity: 10,
            currentRegistrations: 0,
        },
        {
            id: 'drama-kavyansh',
            title: 'Kavya Vaibhav',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹100',
            date: 'February 19',
            duration: '10:30am-10:55am',
            description: 'Poetic expression through drama.',
            capacity: 10,
            currentRegistrations: 0,
        },
        {
            id: 'drama-admad',
            title: 'Ad Mad Show',
            teamSize: '5-10',
            minSize: 5,
            maxSize: 10,
            prize: 'Depends on registration',
            entryFee: '₹200',
            date: 'February 19',
            duration: '11:30am-12:00pm',
            description: 'Create and perform a hilarious advertisement.',
            capacity: 10,
            currentRegistrations: 0,
        }
    ],
    Poetry: [
        {
            id: 'literati-on-stage',
            title: 'ON stage Events',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹70',
            date: 'February 18-19th',
            description: 'Includes Tark Samwaad, Amplified Voices, Kavya Goshthi, Debate, and Slam Poetry.',
            explore: true,
            subEvents: [
                {
                    id: 'literati-on-stage-openmic',
                    title: 'Amplified Voices',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    prize: 'Depends on registration',
                    entryFee: '₹70',
                    date: 'February 19th',
                    duration: '4:25pm-5:35pm',
                    description: 'Speak your heart out in our premier amplified voices competition.',
                    capacity: 15,
                    currentRegistrations: 0
                }
            ]
        },
        {
            id: 'literati-off-stage',
            title: 'OFF stage Events',
            teamSize: '1-10',
            minSize: 1,
            maxSize: 10,
            prize: 'Depends on registration',
            entryFee: 'Free - ₹200',
            date: 'February 18-19th',
            description: 'Includes Creative Writing, Literati Quiz, Silent Skit, Book Cover Design, and Treasure Hunt.',
            explore: true,
            subEvents: [
                {
                    id: 'literati-off-tark',
                    title: 'Tark Samwaad',
                    date: 'February 18th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: '₹50',
                    duration: '10:00 am - 11:00 am & 1:00 pm - 2:00 pm',
                    description: 'Engage in logical discourse and intellectual reasoning.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-artistry',
                    title: 'Artistry alley',
                    date: 'February 18th',
                    prize: 'Depends on registration',
                    teamSize: '3-4',
                    minSize: 3,
                    maxSize: 4,
                    entryFee: '₹200',
                    duration: '10:00 am - 3:00 pm',
                    description: 'A dedicated space for visual arts and creative expression.',
                    capacity: 20,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-hindi-gd',
                    title: 'Samadhan',
                    date: 'February 18th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: '₹50',
                    duration: '2:00 pm - 3:00 pm',
                    description: 'Express and debate ideas in our national language.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-drishtikon',
                    title: 'Drishtikon',
                    date: 'February 18th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: '₹50',
                    duration: '3:00 pm - 4:00 pm',
                    description: 'A platform to share your unique perspective.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-global',
                    title: 'Global Discourse',
                    date: 'February 18th',
                    prize: 'Depends on registration',
                    teamSize: '2',
                    minSize: 2,
                    maxSize: 2,
                    entryFee: '₹100',
                    duration: '12:00 pm - 1:00 pm',
                    description: 'Discussion on global trends and events.',
                    capacity: 20,
                    currentRegistrations: 0,
                },

                {
                    id: 'literati-off-sketch-18',
                    title: 'Sketching',
                    date: 'February 18th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: 'Free',
                    duration: 'Online',
                    description: 'Bring your ideas to life on paper.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-poster-18',
                    title: 'Poster making',
                    date: 'February 18th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: 'Free',
                    duration: 'Online',
                    description: 'Design impactful visuals for meaningful themes.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-argue',
                    title: 'Argue-a-thon',
                    date: 'February 19th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: '₹50',
                    duration: '10:00 am - 12:00 pm',
                    description: 'The ultimate marathon of debate and persuasion.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-samadhan-19',
                    title: 'Discussion-De-Groupe',
                    date: 'February 19th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: '₹50',
                    duration: '2:00 pm - 3:00 pm',
                    description: 'Find creative solutions to real-world problems.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-manifest',
                    title: 'Manifest',
                    date: 'February 19th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: '₹50',
                    duration: '10:00 am - 1:00 pm',
                    description: 'A platform to articulate your vision and plans.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-pictionary',
                    title: 'Pictionary',
                    date: 'February 19th',
                    prize: 'Depends on registration',
                    teamSize: '2',
                    minSize: 2,
                    maxSize: 2,
                    entryFee: '₹100',
                    duration: '12:00 pm - 1:00 pm',
                    description: 'Guess the word through creative drawing.',
                    capacity: 20,
                    currentRegistrations: 0,
                },

                {
                    id: 'literati-off-sketch-19',
                    title: 'Sketching',
                    date: 'February 19th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: 'Free',
                    duration: 'Online',
                    description: 'Showcase your sketching skills in this online challenge.',
                    capacity: 10,
                    currentRegistrations: 0,
                },
                {
                    id: 'literati-off-poster-19',
                    title: 'Poster making',
                    date: 'February 19th',
                    prize: 'Depends on registration',
                    teamSize: '1',
                    minSize: 1,
                    maxSize: 1,
                    entryFee: 'Free',
                    duration: 'Online',
                    description: 'Create thematic posters in this digital competition.',
                    capacity: 10,
                    currentRegistrations: 0,
                }
            ]
        }
    ],
    Anchoring: [
        {
            id: 'wiwa-fun-fusion',
            title: 'Fun fusion arena',
            teamSize: '3',
            minSize: 3,
            maxSize: 3,
            prize: 'Depends on registration',
            entryFee: '₹200',
            date: 'February 18',
            duration: '2:00pm-3:00pm',
            description: 'Unleash the gamer in you.',
            capacity: 20,
            currentRegistrations: 0
        },
        {
            id: 'wiwa-speaksphere',
            title: 'SpeakSphere',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: '₹100',
            date: 'February 19',
            duration: '4:00pm-5:00pm',
            description: 'A platform to amplify your voice and connect through speech.',
            capacity: 20,
            currentRegistrations: 0
        }
    ],
    Gaming: [
        {
            id: 'media-cell-bgmi',
            title: 'BGMI',
            date: 'February 18-19',
            teamSize: '4',
            minSize: 4,
            maxSize: 4,
            prize: 'Depends on registration',
            entryFee: '₹50',
            duration: '11:00am-2:00pm',
            capacity: 64,
            currentRegistrations: 0,
            description: 'Battle it out in the ultimate mobile battle royale.'
        },
        {
            id: 'media-cell-valorant',
            title: 'Valorant',
            date: 'February 18-19',
            teamSize: '5',
            minSize: 5,
            maxSize: 5,
            prize: 'Depends on registration',
            entryFee: '₹50',
            duration: '11:00am-2:00pm',
            capacity: 12,
            currentRegistrations: 0,
            description: 'Defuse or plant in this tactical 5v5 shooter.'
        },
        {
            id: 'media-cell-mystery',
            title: 'Mystery Hunt',
            date: 'February 18',
            teamSize: '4',
            minSize: 4,
            maxSize: 4,
            prize: 'Depends on registration',
            entryFee: '₹50',
            duration: '12:00pm-1:30pm & 3:00pm-4:30pm',
            capacity: 20,
            currentRegistrations: 0,
            description: 'Expect the unexpected in this surprise challenge.'
        },
        {
            id: 'media-cell-fliptictactoe',
            title: 'Flip Tic Tak Toe',
            date: 'February 18-19',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: 'Free',
            duration: '12:00pm-1:00pm & 2:00pm-3:00pm',
            capacity: 20,
            currentRegistrations: 0,
            description: 'A fast-paced, physical twist on the classic game.'
        },
        {
            id: 'media-cell-cuppyramid',
            title: 'Cup Pyramid',
            date: 'February 18-19',
            teamSize: '2',
            minSize: 2,
            maxSize: 2,
            prize: 'Depends on registration',
            entryFee: 'Free',
            duration: '1:00pm-2:00pm & 3:00pm-4:00pm',
            description: 'Test your speed and steady hands with cup stacking.',
            capacity: 20,
            currentRegistrations: 0
        },
        {
            id: 'media-cell-filltheglass',
            title: 'Fill the Glass',
            date: 'February 18-19',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: 'Free',
            duration: '1:00pm-2:00pm & 3:00pm-4:00pm',
            description: 'Precision and speed are key to filling the glass first.',
            capacity: 20,
            currentRegistrations: 0
        },
        {
            id: 'media-cell-spinthememe',
            title: 'Spin the Meme',
            date: 'February 18-19',
            teamSize: '1',
            minSize: 1,
            maxSize: 1,
            prize: 'Depends on registration',
            entryFee: 'Free',
            duration: '12:00pm-5:00pm',
            description: 'Showcase your humor and creativity in this meme challenge.',
            capacity: 20,
            currentRegistrations: 0
        },
        {
            id: 'media-cell-upsiedown',
            title: 'Upside Down',
            date: 'February 19',
            teamSize: '4',
            minSize: 4,
            maxSize: 4,
            prize: 'Depends on registration',
            entryFee: 'Free',
            duration: '2:00pm-4:00pm',
            capacity: 20,
            currentRegistrations: 0,
            description: 'A challenge that will turn your world upside down.'
        },
        {
            id: 'media-cell-pickcorrect',
            title: 'Pick the Correct One',
            date: 'February 19',
            teamSize: '4',
            minSize: 4,
            maxSize: 4,
            prize: 'Depends on registration',
            entryFee: 'Free',
            duration: '12:00pm-1:00pm',
            capacity: 20,
            currentRegistrations: 0,
            description: 'Fast reflexes and sharp choices under pressure.'
        }
    ]
};
